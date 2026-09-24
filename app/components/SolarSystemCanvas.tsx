"use client";

import React, { useRef, useEffect, useState } from "react";
import { Project } from "@/app/actions/projects";

interface Props {
  projects: Project[];
  activeProject: Project | null;
  hoveredProject: Project | null;
  onSelectProject: (p: Project) => void;
  onHoverProject: (p: Project | null) => void;
}

export default function SolarSystemCanvas({
  projects,
  activeProject,
  hoveredProject,
  onSelectProject,
  onHoverProject,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const anglesRef = useRef<{ [key: string]: number }>({});
  const [primaryColor, setPrimaryColor] = useState("rgba(255, 255, 255, 0.8)");

  // Extract CSS custom property --primary-color dynamically
  useEffect(() => {
    if (typeof window !== "undefined") {
      const computed = getComputedStyle(document.documentElement)
        .getPropertyValue("--primary-color")
        .trim();

      if (computed) {
        setPrimaryColor(computed);
      }
    }
  }, []);

  useEffect(() => {
    // Initialize random starting angles for each project
    projects.forEach((p) => {
      if (anglesRef.current[p.id] === undefined) {
        anglesRef.current[p.id] = Math.random() * Math.PI * 2;
      }
    });

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;

      // 1. Subtle Central Core & Glow (using CSS --primary-color)
      const sunRadius = 24;
      const sunGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        2,
        centerX,
        centerY,
        sunRadius
      );

      sunGlow.addColorStop(0, primaryColor);
      sunGlow.addColorStop(0.6, "rgba(255, 255, 255, 0.15)");
      sunGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = sunGlow;
      ctx.beginPath();
      ctx.arc(centerX, centerY, sunRadius, 0, Math.PI * 2);
      ctx.fill();

      // Solid Central Node Dot
      ctx.fillStyle = primaryColor;
      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fill();

      // Central Label
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("PROJECTS", centerX, centerY + 16);

      // 2. Planets & Dynamic Orbit Rings
      projects.forEach((p, index) => {
        // Compute radius dynamically based on index so planets auto-fill gaps when deleted
        const computedRadius = 90 + index * 50;

        // Increment angle using each project's orbit speed
        anglesRef.current[p.id] =
          (anglesRef.current[p.id] || 0) + (p.orbitSpeed || 0.005);

        const currentAngle = anglesRef.current[p.id];
        const planetX = centerX + Math.cos(currentAngle) * computedRadius;
        const planetY = centerY + Math.sin(currentAngle) * computedRadius;

        const isHovered = hoveredProject?.id === p.id;
        const isActive = activeProject?.id === p.id;

        // Draw Circular Orbit Track Ring
        ctx.strokeStyle =
          isActive || isHovered
            ? "rgba(255, 255, 255, 0.35)"
            : "rgba(255, 255, 255, 0.08)";
        ctx.lineWidth = isActive || isHovered ? 1.5 : 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, computedRadius, 0, Math.PI * 2);
        ctx.stroke();

        // Planet Halo Glow
        const glowRadius = p.size * (isHovered || isActive ? 1.8 : 1.3);
        const planetGlow = ctx.createRadialGradient(
          planetX,
          planetY,
          p.size * 0.3,
          planetX,
          planetY,
          glowRadius
        );
        planetGlow.addColorStop(0, p.color);
        planetGlow.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.fillStyle = planetGlow;
        ctx.beginPath();
        ctx.arc(planetX, planetY, glowRadius, 0, Math.PI * 2);
        ctx.fill();

        // Solid Planet Body
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(planetX, planetY, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Active/Hover Selection Ring
        if (isHovered || isActive) {
          ctx.strokeStyle = "#ffffff";
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(planetX, planetY, p.size + 3, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Save current screen coordinates on object for hit-testing
        (p as unknown as { currentX: number; currentY: number }).currentX =
          planetX;
        (p as unknown as { currentY: number }).currentY = planetY;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animationFrameId);
  }, [projects, activeProject, hoveredProject, primaryColor]);

  // Handle Planet Selection Click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // FIX: the canvas has a fixed internal resolution (500x500) but is
    // CSS-scaled down via `max-w-full h-auto` on narrow screens. Without
    // this scale correction, click hit-testing used raw CSS pixels against
    // drawing coordinates from the unscaled 500x500 space, so planet clicks
    // silently missed on any screen narrower than 500px.
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    projects.forEach((p) => {
      const coords = p as unknown as { currentX?: number; currentY?: number };
      if (coords.currentX !== undefined && coords.currentY !== undefined) {
        const dist = Math.hypot(
          clickX - coords.currentX,
          clickY - coords.currentY
        );
        if (dist <= p.size + 8) {
          onSelectProject(p);
        }
      }
    });
  };

  // Handle Planet Hovering
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Same scale correction as the click handler above.
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    let found: Project | null = null;
    projects.forEach((p) => {
      const coords = p as unknown as { currentX?: number; currentY?: number };
      if (coords.currentX !== undefined && coords.currentY !== undefined) {
        const dist = Math.hypot(
          mouseX - coords.currentX,
          mouseY - coords.currentY
        );
        if (dist <= p.size + 8) {
          found = p;
        }
      }
    });

    onHoverProject(found);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={500}
      onClick={handleCanvasClick}
      onMouseMove={handleCanvasMouseMove}
      onMouseLeave={() => onHoverProject(null)}
      className="cursor-pointer w-full max-w-[500px] h-auto"
    />
  );
}