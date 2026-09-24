"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/context/AuthContext";
import { getSkills, saveSkills, Skill } from "@/app/actions/skills";

// Dynamic import of pure star canvas (No avatar, no clicks)
const StarBackground = dynamic(() => import("../components/StarBackground"), {
  ssr: false,
});

export default function SkillsPage() {
  const { isLoggedIn } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // New Skill Form State
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState("#00ffcc");
  const [newLevel, setNewLevel] = useState(75);

  // Load Initial Data
  useEffect(() => {
    getSkills().then(setSkills);
  }, []);

  // Save to GitHub / Local JSON
  const syncSkills = async (updatedSkills: Skill[]) => {
    setSkills(updatedSkills);
    if (isLoggedIn) {
      setIsSaving(true);
      await saveSkills(updatedSkills);
      setIsSaving(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newSkill: Skill = {
      id: Date.now().toString(),
      name: newName.trim(),
      color: newColor,
      level: Number(newLevel),
    };

    const updated = [...skills, newSkill];
    setNewName("");
    await syncSkills(updated);
  };

  const handleRemoveSkill = async (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    await syncSkills(updated);
  };

  const handleLevelChange = async (id: string, value: number) => {
    const updated = skills.map((s) =>
      s.id === id ? { ...s, level: value } : s
    );
    await syncSkills(updated);
  };

  // SVG Radar Geometry Calculations
  const center = 150;
  const radius = 100;
  const total = skills.length;

  const getCoordinates = (index: number, currentRadius: number) => {
    if (total === 0) return { x: center, y: center };
    const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
    return {
      x: center + currentRadius * Math.cos(angle),
      y: center + currentRadius * Math.sin(angle),
    };
  };

  const radarPolygonPoints = skills
    .map((skill, index) => {
      const { x, y } = getCoordinates(index, (skill.level / 100) * radius);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    // FIX: dropped `h-[calc(100vh-90px)]` + `overflow-hidden` at md+.
    // That combo hard-clipped anything taller than one screen, and no
    // amount of overflow-y-auto on descendants could undo an ancestor's
    // overflow-hidden. min-h alone lets the page grow and scroll normally
    // at every breakpoint, so nothing is ever unreachable again.
    <div className="relative w-full min-h-[calc(100vh-90px)]">
      {/* 1. CLEAN STAR CANVAS BACKGROUND */}
      <StarBackground />

      {/* 2. PAGE CONTENT LAYER */}
      {/* FIX: removed the extra `md:overflow-y-auto` here too — this
          element no longer needs to own any scroll, the page does. */}
      <div className="container relative z-10 w-full px-4 py-6 md:px-8 md:py-10 text-white flex flex-col md:flex-row items-center md:items-start justify-center gap-8 md:gap-16 pb-16">
        
        {/* LEFT SIDE: RADAR SVG GRAPH */}
        {/* FIX: sticky + self-start keeps the chart pinned in view while
            you scroll the list beside it on desktop — this is what the
            fixed-height/overflow-hidden setup was trying to achieve, but
            sticky does it natively and can't clip anything. Mobile is
            unaffected (sticky only applies at md+). */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0 md:sticky md:top-28 md:self-start">
          <div className="relative w-[260px] h-[260px] sm:w-[300px] sm:h-[300px]">
            <svg className="w-full h-full overflow-visible" viewBox="0 0 300 300">
              {/* Background Web Rings */}
              {[0.25, 0.5, 0.75, 1].map((scale, ringIdx) => {
                const points = skills
                  .map((_, i) => {
                    const { x, y } = getCoordinates(i, radius * scale);
                    return `${x},${y}`;
                  })
                  .join(" ");

                return (
                  <polygon
                    key={ringIdx}
                    points={points}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radius Lines */}
              {skills.map((_, i) => {
                const { x, y } = getCoordinates(i, radius);
                return (
                  <line
                    key={i}
                    x1={center}
                    y1={center}
                    x2={x}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.15)"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Radar Area Polygon */}
              {skills.length > 0 && (
                <polygon
                  points={radarPolygonPoints}
                  fill="rgba(0, 255, 204, 0.1)"
                  stroke="var(--primary-color, #00ffcc)"
                  strokeWidth="2"
                />
              )}

              {/* Vertex Color Nodes */}
              {skills.map((skill, i) => {
                const { x, y } = getCoordinates(i, radius);
                return (
                  <circle
                    key={skill.id}
                    cx={x}
                    cy={y}
                    r="6"
                    fill="#000000"
                    stroke={skill.color}
                    strokeWidth="3"
                  />
                );
              })}
            </svg>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-gray-400 font-mono text-xs tracking-widest uppercase">
              // proficiency_matrix
            </p>
            {isSaving && (
              <span className="text-xs text-[var(--primary-color,#00ffcc)] animate-pulse font-mono">
                • Syncing...
              </span>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: LIST & ADD FORM */}
        {/* FIX: removed `md:max-h-[75vh] overflow-y-auto` — this column no
            longer tries to own its own bounded scroll region. It just
            flows as part of the page, which the page now scrolls. */}
        <div className="flex flex-col gap-6 w-full max-w-xl pr-1 md:pr-3 custom-scrollbar">
          
          {/* SKILLS LIST */}
          <div className="grid grid-cols-1 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col gap-3 p-4 bg-black/60 border border-neutral-800 rounded-xl backdrop-blur-md shadow-lg"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-3.5 h-3.5 rounded-sm shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: skill.color, color: skill.color }}
                    />
                    <span className="font-mono font-bold text-base md:text-lg tracking-wide text-white">
                      {skill.name}
                    </span>
                  </div>

                  {isLoggedIn && (
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-mono px-2.5 py-1 rounded bg-red-950/40 border border-red-500/30 transition-colors"
                    >
                      DELETE
                    </button>
                  )}
                </div>

                {/* Progress Bar & Slider */}
                <div className="flex items-center gap-4">
                  <div className="w-full bg-neutral-900 h-2.5 rounded-full overflow-hidden border border-neutral-800">
                    <div
                      className="h-full transition-all duration-300 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
                        color: skill.color,
                      }}
                    />
                  </div>

                  {isLoggedIn ? (
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={skill.level}
                      onChange={(e) =>
                        handleLevelChange(skill.id, Number(e.target.value))
                      }
                      className="w-28 accent-[var(--primary-color,#00ffcc)] cursor-pointer"
                    />
                  ) : (
                    <span className="text-xs font-mono text-neutral-400 w-10 text-right">
                      {skill.level}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* SPACIOUS ADD SKILL FORM (Admin Only) */}
          {isLoggedIn && (
            <form
              onSubmit={handleAddSkill}
              className="flex flex-col gap-4 p-5 bg-black/90 border border-[var(--primary-color,#00ffcc)]/50 rounded-xl shadow-[0_0_20px_rgba(0,255,204,0.1)] backdrop-blur-md mt-2"
            >
              <div className="text-xs font-mono tracking-widest text-[var(--primary-color,#00ffcc)]">
                // INJECT_NEW_SKILL
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Skill Name (e.g. ROS 2, Next.js)"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="p-3 bg-neutral-900/80 border border-neutral-700 rounded-lg text-white font-mono text-sm focus:outline-none focus:border-[var(--primary-color,#00ffcc)]"
                  required
                />

                <div className="flex items-center justify-between px-3 py-2 bg-neutral-900/80 border border-neutral-700 rounded-lg">
                  <span className="text-xs font-mono text-neutral-400">Theme Color:</span>
                  <input
                    type="color"
                    value={newColor}
                    onChange={(e) => setNewColor(e.target.value)}
                    className="w-8 h-8 rounded bg-transparent cursor-pointer border-0"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
                  <span className="text-xs font-mono text-neutral-400 whitespace-nowrap">
                    Level: {newLevel}%
                  </span>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={newLevel}
                    onChange={(e) => setNewLevel(Number(e.target.value))}
                    className="w-full sm:w-48 accent-[var(--primary-color,#00ffcc)] cursor-pointer"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 bg-[var(--primary-color,#00ffcc)] text-black font-mono font-bold rounded-lg hover:opacity-90 transition-opacity text-sm shadow-[0_0_10px_rgba(0,255,204,0.3)]"
                >
                  + ADD SKILL
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}