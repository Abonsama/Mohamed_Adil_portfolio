"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { getProjects, saveProjects, Project } from "@/app/actions/projects";

// Reusable Image Input (Supports both URL and File Upload)
function ImagePickerInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (val: string) => void;
}) {
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-mono text-gray-400">{label}</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Direct URL Input */}
        <input
          type="url"
          placeholder="Paste Image URL..."
          value={value.startsWith("data:") ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          className="p-3 bg-black border border-white/20 rounded text-sm text-white font-mono focus:border-[var(--primary-color)] outline-none"
        />

        {/* File Upload Button */}
        <label className="flex items-center justify-center p-3 bg-white/5 border border-dashed border-white/30 hover:border-white/60 rounded cursor-pointer font-mono text-xs text-gray-300 transition-colors">
          <span>📁 {value.startsWith("data:") ? "Image Uploaded!" : "Upload Local Image"}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Preview Thumbnail */}
      {value && (
        <div className="relative w-24 h-16 border border-white/20 rounded overflow-hidden mt-1">
          <img src={value} alt="Preview" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute top-0 right-0 bg-red-600 text-white text-[10px] px-1 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default function NewProjectPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [color, setColor] = useState("#00f0ff");
  const [orbitSpeed, setOrbitSpeed] = useState(0.006);

  const [overviewContent, setOverviewContent] = useState("");
  const [overviewImage, setOverviewImage] = useState("");

  const [whyContent, setWhyContent] = useState("");
  const [whyImage, setWhyImage] = useState("");

  const [techContent, setTechContent] = useState("");
  const [techImage, setTechImage] = useState("");

  const [challengesContent, setChallengesContent] = useState("");
  const [challengesImage, setChallengesImage] = useState("");

  const [liveUrl, setLiveUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const existing = await getProjects();

    const newProj: Project = {
      id: Date.now().toString(),
      title,
      color,
      orbitRadius: 0, // Computed dynamically by solar canvas order
      orbitSpeed: Number(orbitSpeed),
      size: 16,
      overview: {
        title: "Overview",
        content: overviewContent,
        imageUrl: overviewImage || undefined,
      },
      why: {
        title: "Why Built",
        content: whyContent,
        imageUrl: whyImage || overviewImage || undefined,
      },
      techStack: {
        title: "Tech Stack",
        content: techContent,
        imageUrl: techImage || overviewImage || undefined,
      },
      challenges: {
        title: "Challenges",
        content: challengesContent,
        imageUrl: challengesImage || overviewImage || undefined,
      },
      links: {
        live: liveUrl || undefined,
        github: githubUrl || undefined,
        linkedin: linkedinUrl || undefined,
      },
    };

    await saveProjects([...existing, newProj]);
    setIsSubmitting(false);
    router.push("/projects");
  };

  return (
    /* Forced viewport scrolling wrapper */
    <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-black text-white p-6 md:p-12">
      <div className="pt-6 max-w-3xl mx-auto flex flex-col gap-8 pb-32">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/20 pb-4">
          <h1 className="text-2xl font-bold font-mono">Create New Solar Project</h1>
          <button
            type="button"
            onClick={() => router.push("/projects")}
            className="text-sm font-mono text-gray-400 hover:text-white px-3 py-1 bg-white/5 border border-white/10 rounded"
          >
            ← Cancel
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* 1. ORBITAL PROPERTIES */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold font-mono text-[var(--primary-color)]">
              1. Orbital Properties
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-400 font-mono block mb-1">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white focus:border-[var(--primary-color)] outline-none"
                />
              </div>

              <div className="flex items-center gap-6">
                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">
                    Planet Color
                  </label>
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-12 h-10 rounded bg-transparent cursor-pointer border-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-gray-400 font-mono block mb-1">
                    Orbit Speed
                  </label>
                  <input
                    type="range"
                    min="0.002"
                    max="0.015"
                    step="0.001"
                    value={orbitSpeed}
                    onChange={(e) => setOrbitSpeed(Number(e.target.value))}
                    className="w-32 accent-[var(--primary-color)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 2. OVERVIEW */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold font-mono text-[var(--primary-color)]">
              2. Overview Section
            </h2>
            <textarea
              required
              rows={3}
              placeholder="Detailed project overview..."
              value={overviewContent}
              onChange={(e) => setOverviewContent(e.target.value)}
              className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white focus:border-[var(--primary-color)] outline-none"
            />
            <ImagePickerInput
              label="Overview Screenshot (URL or Local File)"
              value={overviewImage}
              onChange={setOverviewImage}
            />
          </div>

          {/* 3. WHY BUILT */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold font-mono text-[var(--primary-color)]">
              3. Why Built Section
            </h2>
            <textarea
              required
              rows={3}
              placeholder="Motivation / Problem solved..."
              value={whyContent}
              onChange={(e) => setWhyContent(e.target.value)}
              className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white focus:border-[var(--primary-color)] outline-none"
            />
            <ImagePickerInput
              label="Section Image (Optional - defaults to Overview image)"
              value={whyImage}
              onChange={setWhyImage}
            />
          </div>

          {/* 4. TECH STACK */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold font-mono text-[var(--primary-color)]">
              4. Tech Stack Section
            </h2>
            <textarea
              required
              rows={3}
              placeholder="Technologies used..."
              value={techContent}
              onChange={(e) => setTechContent(e.target.value)}
              className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white focus:border-[var(--primary-color)] outline-none"
            />
            <ImagePickerInput
              label="Section Image (Optional)"
              value={techImage}
              onChange={setTechImage}
            />
          </div>

          {/* 5. CHALLENGES */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold font-mono text-[var(--primary-color)]">
              5. Challenges Section
            </h2>
            <textarea
              required
              rows={3}
              placeholder="Key technical hurdles encountered..."
              value={challengesContent}
              onChange={(e) => setChallengesContent(e.target.value)}
              className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white focus:border-[var(--primary-color)] outline-none"
            />
            <ImagePickerInput
              label="Section Image (Optional)"
              value={challengesImage}
              onChange={setChallengesImage}
            />
          </div>

          {/* 6. EXTERNAL LINKS */}
          <div className="p-6 bg-white/5 border border-white/10 rounded-xl flex flex-col gap-4">
            <h2 className="text-lg font-bold font-mono text-[var(--primary-color)]">
              6. External Links
            </h2>
            <input
              type="url"
              placeholder="Live Demo URL"
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white font-mono focus:border-[var(--primary-color)] outline-none"
            />
            <input
              type="url"
              placeholder="GitHub Repository URL"
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white font-mono focus:border-[var(--primary-color)] outline-none"
            />
            <input
              type="url"
              placeholder="LinkedIn Post URL"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              className="w-full p-3 bg-black border border-white/20 rounded text-sm text-white font-mono focus:border-[var(--primary-color)] outline-none"
            />
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full p-4 bg-[var(--primary-color)] text-black font-bold font-mono rounded-xl hover:opacity-90 transition-opacity text-center disabled:opacity-50 mt-4 cursor-pointer"
          >
            {isSubmitting ? "Deploying Project..." : "+ Deploy Project"}
          </button>
        </form>
      </div>
    </div>
  );
}