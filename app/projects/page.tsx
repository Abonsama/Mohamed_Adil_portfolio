"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { getProjects, saveProjects, Project } from "@/app/actions/projects";
import SolarSystemCanvas from "@/app/components/SolarSystemCanvas";
import CyberpunkProjectModal from "@/app/components/CyberpunkProjectModal";

// Reusable crisp star background
const StarBackground = dynamic(() => import("../components/StarBackground"), {
  ssr: false,
});

export default function ProjectsPage() {
  const { isLoggedIn } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);

  useEffect(() => {
    getProjects().then(setProjects);
  }, []);

  const handleDeleteProject = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    await saveProjects(updated);
  };

  return (
    // CHANGED: same fix as the skills page — locked viewport height +
    // overflow-hidden was clipping the project list on mobile once the
    // canvas and list both needed vertical space. md+ is untouched.
    <div className="relative w-full min-h-[calc(100vh-90px)] overflow-y-auto md:h-[calc(100vh-90px)] md:overflow-hidden">
      {/* 1. STAR BACKGROUND */}
      <StarBackground />

      {/* 2. SOLAR SYSTEM PAGE CONTENT */}
      <div className="relative z-10 w-full min-h-full px-4 py-8 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* LEFT COLUMN: SCROLLABLE PROJECT LIST */}
        {/* CHANGED: nested max-h-[80vh]/overflow-y-auto now only applies at
            md+, avoiding a scroll-inside-a-scroll on mobile. Also given
            order-2 below so the canvas (the more engaging visual) shows
            first on mobile; desktop keeps its original list-left order. */}
        <div className="order-2 md:order-1 flex flex-col gap-4 w-full md:w-1/3 md:max-h-[80vh] md:overflow-y-auto pr-2 custom-scrollbar">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h1 className="text-2xl font-bold font-mono tracking-wider">
              PROJECTS
            </h1>

            {/* Admin Add Button */}
            {isLoggedIn && (
              <Link
                href="/projects/new"
                className="px-3 py-1.5 bg-[var(--primary-color)] text-black font-mono font-bold text-xs rounded hover:opacity-90 transition-opacity"
              >
                + ADD PROJECT
              </Link>
            )}
          </div>

          <div className="flex flex-col gap-3">
            {projects.map((p) => {
              const isHovered = hoveredProject?.id === p.id;

              return (
                <div
                  key={p.id}
                  onClick={() => setActiveProject(p)}
                  onMouseEnter={() => setHoveredProject(p)}
                  onMouseLeave={() => setHoveredProject(null)}
                  className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                    isHovered
                      ? "bg-white/10 border-white/40 translate-x-1"
                      : "bg-black/40 border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: p.color }}
                    />
                    <span className="font-mono text-sm font-semibold">
                      {p.title}
                    </span>
                  </div>

                  {isLoggedIn && (
                    <button
                      onClick={(e) => handleDeleteProject(p.id, e)}
                      className="text-red-400 hover:text-red-300 text-xs font-mono px-2 py-1 bg-red-950/40 border border-red-500/30 rounded"
                    >
                      DELETE
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: 2D SOLAR SYSTEM CANVAS */}
        <div className="order-1 md:order-2 flex-1 flex items-center justify-center w-full">
          <SolarSystemCanvas
            projects={projects}
            activeProject={activeProject}
            hoveredProject={hoveredProject}
            onSelectProject={setActiveProject}
            onHoverProject={setHoveredProject}
          />
        </div>
      </div>

      {/* 3. CYBERPUNK HUD DETAILS MODAL */}
      {activeProject && (
        <CyberpunkProjectModal
          project={activeProject}
          onClose={() => setActiveProject(null)}
        />
      )}
    </div>
  );
}