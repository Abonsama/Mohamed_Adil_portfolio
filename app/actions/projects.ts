"use server";

import fs from "fs/promises";
import path from "path";
import { revalidatePath } from "next/cache";

export interface ProjectSection {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  color: string;
  orbitRadius: number;
  orbitSpeed: number;
  size: number;
  overview: ProjectSection;
  why: ProjectSection;
  techStack: ProjectSection;
  challenges: ProjectSection;
  links: {
    live?: string;
    github?: string;
    linkedin?: string;
  };
}

const localFilePath = path.join(process.cwd(), "data", "projects.json");

export async function getProjects(): Promise<Project[]> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const filePath = "data/projects.json";

  // In production (Vercel), fetch latest JSON straight from GitHub API
  if (token && owner && repo) {
    try {
      const res = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        }
      );

      if (res.ok) {
        const fileData = await res.json();
        const content = Buffer.from(fileData.content, "base64").toString("utf8");
        return JSON.parse(content);
      }
    } catch (e) {
      console.error("Failed to fetch projects from GitHub API:", e);
    }
  }

  // Fallback to local filesystem (development mode)
  try {
    const data = await fs.readFile(localFilePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export async function saveProjects(projects: Project[]): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const filePath = "data/projects.json";

  // 1. Try local write (works in dev mode)
  try {
    await fs.writeFile(localFilePath, JSON.stringify(projects, null, 2), "utf8");
  } catch {
    // Expected to fail on Vercel read-only filesystem
  }

  // 2. Commit to GitHub API
  if (token && owner && repo) {
    try {
      const getFileRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
          },
          cache: "no-store",
        }
      );

      let sha = "";
      if (getFileRes.ok) {
        const fileData = await getFileRes.json();
        sha = fileData.sha;
      }

      const contentEncoded = Buffer.from(
        JSON.stringify(projects, null, 2)
      ).toString("base64");

      const updateRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github.v3+json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: "Update projects.json via Admin Panel",
            content: contentEncoded,
            sha: sha || undefined,
          }),
        }
      );

      if (updateRes.ok) {
        // Revalidate Next.js cache so pages render updated JSON instantly
        revalidatePath("/projects");
        revalidatePath("/");
        return true;
      }
    } catch (err) {
      console.error("GitHub API commit error:", err);
      return false;
    }
  }

  return true;
}