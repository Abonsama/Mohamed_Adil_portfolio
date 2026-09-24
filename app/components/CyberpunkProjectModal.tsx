"use client";

import React, { useState } from "react";
import { Project, ProjectSection } from "@/app/actions/projects";

interface Props {
  project: Project;
  onClose: () => void;
}

type TabType = "overview" | "why" | "techStack" | "challenges" | "links";

const CHARS_PER_PAGE = 220; // Auto-paginates long text chunks

export default function CyberpunkProjectModal({ project, onClose }: Props) {
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [pageIndex, setPageIndex] = useState(0);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  // Get active section payload
  const getSectionData = (): ProjectSection => {
    switch (activeTab) {
      case "why":
        return project.why;
      case "techStack":
        return project.techStack;
      case "challenges":
        return project.challenges;
      default:
        return project.overview;
    }
  };

  const currentSection = getSectionData();

  // Split text into pages if content exceeds space
  const textPages = React.useMemo(() => {
    const text = currentSection.content || "";
    if (text.length <= CHARS_PER_PAGE) return [text];
    const pages: string[] = [];
    for (let i = 0; i < text.length; i += CHARS_PER_PAGE) {
      pages.push(text.slice(i, i + CHARS_PER_PAGE));
    }
    return pages;
  }, [currentSection]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setPageIndex(0);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg">
      
      {/* EXPANDED IMAGE PREVIEW MODAL */}
      {isImageExpanded && currentSection.imageUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-6 cursor-zoom-out"
          onClick={() => setIsImageExpanded(false)}
        >
          <div className="relative max-w-4xl w-full max-h-[85vh] border-2 border-[var(--primary-color)] p-2 bg-black rounded-lg">
            {/* Cyberpunk Bracket Corners */}
            <div className="absolute -top-2 -left-2 w-6 h-6 border-t-2 border-l-2 border-white" />
            <div className="absolute -top-2 -right-2 w-6 h-6 border-t-2 border-r-2 border-white" />
            <div className="absolute -bottom-2 -left-2 w-6 h-6 border-b-2 border-l-2 border-white" />
            <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-2 border-r-2 border-white" />

            <img
              src={currentSection.imageUrl}
              alt="Expanded Preview"
              className="w-full h-auto max-h-[75vh] object-contain rounded"
            />
            <p className="text-center text-xs font-mono text-gray-400 mt-2">
              [CLICK ANYWHERE TO CLOSE PREVIEW]
            </p>
          </div>
        </div>
      )}

      {/* MAIN CYBERPUNK HUD WINDOW */}
      <div className="relative w-full max-w-3xl bg-black/90 border border-white/20 p-8 rounded-xl shadow-2xl flex flex-col gap-6">
        
        {/* FOUR CYBERPUNK CORNER BRACKETS */}
        <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-white pointer-events-none" />
        <div className="absolute -top-3 -right-3 w-8 h-8 border-t-2 border-r-2 border-white pointer-events-none" />
        <div className="absolute -bottom-3 -left-3 w-8 h-8 border-b-2 border-l-2 border-white pointer-events-none" />
        <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-white pointer-events-none" />

        {/* HEADER & CLOSE BUTTON */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shadow-lg"
              style={{ backgroundColor: project.color }}
            />
            <h2 className="text-2xl font-bold font-mono tracking-wider text-white">
              {project.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white font-mono text-sm px-3 py-1 bg-white/5 border border-white/20 rounded hover:bg-white/10 transition-colors"
          >
            [ESC / CLOSE]
          </button>
        </div>

        {/* HUD DOT / TAB NAVIGATION */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 custom-scrollbar">
          {[
            { key: "overview", label: "01. OVERVIEW" },
            { key: "why", label: "02. WHY BUILT" },
            { key: "techStack", label: "03. TECH STACK" },
            { key: "challenges", label: "04. CHALLENGES" },
            { key: "links", label: "05. LINKS" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key as TabType)}
              className={`px-3 py-1.5 font-mono text-xs tracking-wider rounded transition-all flex items-center gap-2 ${
                activeTab === tab.key
                  ? "bg-white text-black font-bold shadow-lg"
                  : "bg-black/50 text-gray-400 hover:text-white border border-white/10"
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  activeTab === tab.key ? "bg-black" : "bg-gray-600"
                }`}
              />
              {tab.label}
            </button>
          ))}
        </div>

        {/* BODY CONTENT AREA */}
        {activeTab !== "links" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start min-h-[220px]">
            {/* TEXT & AUTO-PAGINATION */}
            <div className="flex flex-col justify-between h-full gap-4">
              <div className="flex flex-col gap-2">
                <h3 className="text-lg font-bold font-mono text-[var(--primary-color)] uppercase">
                  {currentSection.title}
                </h3>
                <p className="text-gray-300 font-sans leading-relaxed text-sm">
                  {textPages[pageIndex] || "No content specified."}
                </p>
              </div>

              {/* PAGINATION CONTROLS (If content splits across pages) */}
              {textPages.length > 1 && (
                <div className="flex items-center gap-3 pt-2 font-mono text-xs">
                  <button
                    disabled={pageIndex === 0}
                    onClick={() => setPageIndex((p) => p - 1)}
                    className="px-2 py-1 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20"
                  >
                    ← PREV
                  </button>
                  <span className="text-gray-400">
                    PAGE {pageIndex + 1} / {textPages.length}
                  </span>
                  <button
                    disabled={pageIndex === textPages.length - 1}
                    onClick={() => setPageIndex((p) => p + 1)}
                    className="px-2 py-1 bg-white/10 rounded disabled:opacity-30 hover:bg-white/20"
                  >
                    NEXT →
                  </button>
                </div>
              )}
            </div>

            {/* SCREENSHOT PREVIEW CARD */}
            <div className="relative group cursor-zoom-in border border-white/20 rounded-lg overflow-hidden bg-black/60 p-1">
              {currentSection.imageUrl ? (
                <img
                  src={currentSection.imageUrl}
                  alt="Section Screenshot"
                  onClick={() => setIsImageExpanded(true)}
                  className="w-full h-48 object-cover rounded group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-48 flex items-center justify-center font-mono text-xs text-gray-500 border border-dashed border-gray-700">
                  [ NO IMAGE ATTACHED ]
                </div>
              )}
              <span className="absolute bottom-2 right-2 px-2 py-1 bg-black/80 text-[10px] font-mono text-gray-300 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Click to Expand
              </span>
            </div>
          </div>
        ) : (
          /* LINKS TAB */
          <div className="flex flex-col gap-4 min-h-[220px] justify-center">
            <h3 className="text-lg font-bold font-mono text-[var(--primary-color)] uppercase">
              Project Access & Links
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {project.links?.live && (
                <a
                  href={project.links.live}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-[var(--primary-color)] transition-all group"
                >
                  <span className="text-xl">🌐</span>
                  <div>
                    <p className="font-bold text-sm text-white font-mono">Live Demo</p>
                    <p className="text-xs text-gray-400 group-hover:underline">Visit Site →</p>
                  </div>
                </a>
              )}

              {project.links?.github && (
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-[var(--primary-color)] transition-all group"
                >
                  <span className="text-xl">💻</span>
                  <div>
                    <p className="font-bold text-sm text-white font-mono">GitHub Repo</p>
                    <p className="text-xs text-gray-400 group-hover:underline">View Source →</p>
                  </div>
                </a>
              )}

              {project.links?.linkedin && (
                <a
                  href={project.links.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-4 bg-white/5 border border-white/20 rounded-xl hover:bg-white/10 hover:border-[var(--primary-color)] transition-all group"
                >
                  <span className="text-xl">🔗</span>
                  <div>
                    <p className="font-bold text-sm text-white font-mono">LinkedIn</p>
                    <p className="text-xs text-gray-400 group-hover:underline">Post Details →</p>
                  </div>
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}