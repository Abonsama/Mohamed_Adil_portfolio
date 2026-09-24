"use client";

import React, { useState, useEffect } from "react";
import { IoClose, IoChevronBack, IoChevronForward, IoOpenOutline } from "react-icons/io5";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { Project, ProjectSection } from "../actions/projects";

interface CyberpunkProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export default function CyberpunkProjectModal({
  project,
  onClose,
}: CyberpunkProjectModalProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setCurrentSlide(0);
  }, [project]);

  if (!project) return null;

  // 1. Build normal sections
  const sections: { id: string; label: string; data?: ProjectSection }[] = [
    { id: "overview", label: "OVERVIEW", data: project.overview },
    { id: "why", label: "WHY BUILT", data: project.why },
    { id: "techStack", label: "TECH STACK", data: project.techStack },
    { id: "challenges", label: "CHALLENGES", data: project.challenges },
  ].filter((s) => s.data && s.data.content);

  // 2. Append LINKS as its own full section slide if any link exists
  const hasLinks = project.links && (project.links.live || project.links.github || project.links.linkedin);
  if (hasLinks) {
    sections.push({
      id: "links",
      label: "PROJECT LINKS",
    });
  }

  const activeSection = sections[currentSlide] || sections[0];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? sections.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === sections.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8">
      {/* Modal Container with Accent Corners */}
      {/*
        CHANGED: `min-h-[580px]` was a hard floor that wins over `max-h-[90vh]`
        whenever the two conflict (per CSS spec min-height always beats
        max-height), so on a short/landscape mobile viewport the modal was
        forced taller than the screen. The 580px floor now only applies at
        sm+ where there's room for it; mobile lets content define the height,
        capped by max-h-[90vh] as before.
      */}
      <div className="relative w-full max-w-5xl min-h-0 sm:min-h-[580px] max-h-[90vh] bg-neutral-950/95 border border-[var(--primary-color,#00ffcc)]/40 shadow-[0_0_25px_rgba(0,255,204,0.15)] flex flex-col justify-between text-neutral-200">
        
        {/* Cyberpunk HUD Corner Brackets */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-[var(--primary-color,#00ffcc)] z-20" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-[var(--primary-color,#00ffcc)] z-20" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-[var(--primary-color,#00ffcc)] z-20" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-[var(--primary-color,#00ffcc)] z-20" />

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-neutral-800/80 bg-neutral-900/40">
          <div className="flex items-center gap-3 min-w-0">
            <span
              className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor] flex-shrink-0"
              style={{ backgroundColor: project.color, color: project.color }}
            />
            <h2 className="text-xl md:text-2xl font-bold tracking-wider text-white uppercase font-mono truncate">
              {project.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800/60 rounded transition-colors flex-shrink-0"
            aria-label="Close modal"
          >
            <IoClose className="w-6 h-6" />
          </button>
        </div>

        {/* Main Content Viewport */}
        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
          {activeSection.id === "links" ? (
            /* Dedicated FULL LINKS SLIDE View */
            <div className="h-full flex flex-col justify-center space-y-6">
              <div className="text-xs font-mono tracking-widest text-[var(--primary-color,#00ffcc)] uppercase">
                // SEC_0{currentSlide + 1} :: PROJECT ACCESS ENDPOINTS
              </div>
              <h3 className="text-2xl font-bold text-white font-mono">
                External Resources & Links
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {project.links.live && (
                  <a
                    href={project.links.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-6 bg-neutral-900/60 border border-neutral-800 hover:border-[var(--primary-color,#00ffcc)] rounded-lg transition-all hover:shadow-[0_0_15px_rgba(0,255,204,0.2)] flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <IoOpenOutline className="w-8 h-8 text-[var(--primary-color,#00ffcc)]" />
                      <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300">
                        [ LIVE DEMO ]
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-mono font-bold text-white group-hover:text-[var(--primary-color,#00ffcc)] transition-colors">
                        Deploy Target
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 font-sans">
                        Launch public production preview
                      </p>
                    </div>
                  </a>
                )}

                {project.links.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-6 bg-neutral-900/60 border border-neutral-800 hover:border-white rounded-lg transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <FaGithub className="w-8 h-8 text-neutral-300 group-hover:text-white" />
                      <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300">
                        [ REPOSITORY ]
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-mono font-bold text-white transition-colors">
                        Source Code
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 font-sans">
                        Inspect codebase on GitHub
                      </p>
                    </div>
                  </a>
                )}

                {project.links.linkedin && (
                  <a
                    href={project.links.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative p-6 bg-neutral-900/60 border border-neutral-800 hover:border-blue-400 rounded-lg transition-all hover:shadow-[0_0_15px_rgba(96,165,250,0.2)] flex flex-col justify-between h-44"
                  >
                    <div className="flex items-center justify-between">
                      <FaLinkedin className="w-8 h-8 text-blue-400" />
                      <span className="text-[10px] font-mono text-neutral-500 group-hover:text-neutral-300">
                        [ NETWORK ]
                      </span>
                    </div>
                    <div>
                      <h4 className="text-lg font-mono font-bold text-white transition-colors">
                        Project Article
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 font-sans">
                        View write-up or announcement
                      </p>
                    </div>
                  </a>
                )}
              </div>
            </div>
          ) : (
            /* Standard Section Content View */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
              {activeSection.data?.imageUrl ? (
                <div className="relative w-full h-56 sm:h-64 md:h-80 rounded overflow-hidden border border-neutral-800 bg-black">
                  <img
                    src={activeSection.data.imageUrl}
                    alt={activeSection.label}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full h-56 sm:h-64 md:h-80 rounded border border-neutral-800/80 bg-neutral-900/20 flex items-center justify-center font-mono text-neutral-600 text-xs tracking-widest">
                  [ NO SIGNAL MEDIA ]
                </div>
              )}

              <div className="flex flex-col justify-between h-full space-y-4">
                <div>
                  <div className="text-xs font-mono tracking-widest text-[var(--primary-color,#00ffcc)] mb-2 uppercase">
                    // SEC_0{currentSlide + 1} :: {activeSection.label}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3 font-mono">
                    {activeSection.data?.title || activeSection.label}
                  </h3>
                  <p className="text-neutral-300 leading-relaxed text-sm md:text-base font-sans">
                    {activeSection.data?.content}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Arrow Navigation Footer */}
        <div className="flex items-center justify-between p-4 md:p-6 border-t border-neutral-800/80 bg-neutral-900/40 gap-2">
          <button
            onClick={handlePrev}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-neutral-700/80 hover:border-[var(--primary-color,#00ffcc)] text-xs font-mono text-neutral-300 hover:text-white transition-colors flex-shrink-0"
          >
            <IoChevronBack className="w-4 h-4" /> <span className="hidden sm:inline">PREV</span>
          </button>

          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {sections.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 transition-all ${
                  idx === currentSlide
                    ? "bg-[var(--primary-color,#00ffcc)] w-6"
                    : "bg-neutral-700 hover:bg-neutral-500 w-2"
                }`}
                aria-label={`Go to section ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-3 sm:px-4 py-2 border border-neutral-700/80 hover:border-[var(--primary-color,#00ffcc)] text-xs font-mono text-neutral-300 hover:text-white transition-colors flex-shrink-0"
          >
            <span className="hidden sm:inline">NEXT</span> <IoChevronForward className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}