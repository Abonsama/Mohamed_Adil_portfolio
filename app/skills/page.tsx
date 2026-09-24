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
  const [newColor, setNewColor] = useState("#00ffff");
  const [newLevel, setNewLevel] = useState(50);

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
    <div className="relative w-full h-[calc(100vh-90px)] overflow-hidden">
      {/* 1. CLEAN STAR CANVAS BACKGROUND (NO AVATAR / NO DETAILS BOX) */}
      <StarBackground />

      {/* 2. PAGE CONTENT LAYER */}
      <div className="relative z-10 w-full h-full px-8 py-4 text-white flex flex-col md:flex-row items-center justify-center gap-12">
        
        {/* LEFT SIDE: RADAR SVG GRAPH */}
        <div className="flex flex-col items-center gap-4 flex-shrink-0">
          <div className="relative w-[300px] h-[300px]">
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
                  fill="rgba(255, 255, 255, 0.1)"
                  stroke="rgba(255, 255, 255, 0.6)"
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
            <p className="text-gray-400 font-semibold text-xs tracking-widest uppercase">
              based on level / proficiency
            </p>
            {isSaving && (
              <span className="text-xs text-[var(--primary-color)] animate-pulse">
                • Syncing...
              </span>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: INTERNAL SCROLLABLE LIST */}
        <div className="flex flex-col gap-6 w-full max-w-xl max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
          
          {/* SKILLS LIST */}
          <div className="grid grid-cols-1 gap-4">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex flex-col gap-2 p-4 bg-black/50 border border-white/10 rounded-2xl backdrop-blur-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span
                      className="w-4 h-4 rounded-sm shadow-sm"
                      style={{ backgroundColor: skill.color }}
                    />
                    <span className="font-bold text-lg">{skill.name}</span>
                  </div>

                  {isLoggedIn && (
                    <button
                      onClick={() => handleRemoveSkill(skill.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-semibold px-2 py-1 rounded bg-red-950/40 border border-red-500/30 transition-colors"
                    >
                      Delete
                    </button>
                  )}
                </div>

                {/* Progress Bar & Slider */}
                <div className="flex items-center gap-4">
                  <div className="w-full bg-gray-900 h-3 rounded-full overflow-hidden border border-white/20">
                    <div
                      className="h-full transition-all duration-300 rounded-full"
                      style={{
                        width: `${skill.level}%`,
                        backgroundColor: skill.color,
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
                      className="w-28 accent-[var(--primary-color)] cursor-pointer"
                    />
                  ) : (
                    <span className="text-xs font-mono text-gray-400 w-10 text-right">
                      {skill.level}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ADD SKILL FORM (Admin Only) */}
          {isLoggedIn && (
            <form
              onSubmit={handleAddSkill}
              className="flex flex-wrap items-center gap-4 p-4 bg-black/80 border border-[var(--primary-color)] rounded-2xl shadow-lg backdrop-blur-md"
            >
              <input
                type="text"
                placeholder="Skill Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-1 min-w-[140px] p-2 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-[var(--primary-color)]"
                required
              />

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">Color:</span>
                <input
                  type="color"
                  value={newColor}
                  onChange={(e) => setNewColor(e.target.value)}
                  className="w-8 h-8 rounded bg-transparent cursor-pointer border-none"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400">{newLevel}%</span>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={newLevel}
                  onChange={(e) => setNewLevel(Number(e.target.value))}
                  className="w-20 accent-[var(--primary-color)] cursor-pointer"
                />
              </div>

              <button
                type="submit"
                className="px-4 py-2 bg-[var(--primary-color)] text-black font-bold rounded-xl hover:opacity-90 transition-opacity text-sm"
              >
                + Add
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}