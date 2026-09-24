"use server";

import fs from "fs/promises";
import path from "path";

export interface Skill {
  id: string;
  name: string;
  color: string;
  level: number;
}

const localFilePath = path.join(process.cwd(), "data", "skills.json");

// Read Skills
export async function getSkills(): Promise<Skill[]> {
  try {
    const data = await fs.readFile(localFilePath, "utf8");
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// Save Skills (Local File in Dev + GitHub Commit in Production)
export async function saveSkills(skills: Skill[]): Promise<boolean> {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const filePath = "data/skills.json";

  // 1. Always save locally first
  try {
    await fs.writeFile(localFilePath, JSON.stringify(skills, null, 2), "utf8");
  } catch (e) {
    console.error("Local write failed:", e);
  }

  // 2. If GitHub environment variables exist, commit directly to GitHub API
  if (token && owner && repo) {
    try {
      // Get current file SHA from GitHub
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

      // Commit updated JSON
      const contentEncoded = Buffer.from(
        JSON.stringify(skills, null, 2)
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
            message: "Update skills.json via Portfolio Admin Panel",
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