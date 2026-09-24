"use server";

import fs from "fs/promises";
import path from "path";

export interface ProjectSection {
  title: string;
  content: string;
  imageUrl?: string;
}

export interface Project {
  id: string;
  title: string;
  color: string; // Planet color (e.g. #ff0055)
  orbitRadius: number; // Orbit distance in pixels
  orbitSpeed: number; // Orbital speed factor
  size: number; // Planet radius
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

  // 1. Always save locally
  try {
    await fs.writeFile(localFilePath, JSON.stringify(projects, null, 2), "utf8");
  } catch (e) {
    console.error("Local write error:", e);
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

      return updateRes.ok;
    } catch (err) {
      console.error("GitHub API commit error:", err);
      return false;
    }
  }

  return true;
}