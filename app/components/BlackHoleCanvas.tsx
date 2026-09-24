"use client";

import React, { useEffect, useRef, useState } from "react";

type AnimationState = "idle" | "collapse" | "expanse";

interface BlackHoleCanvasProps {
  WireframeComponent?: React.ReactNode;
  onEnter?: () => void;
  onExit?: () => void;
  initialExpanded?: boolean; // New prop
}

export default function BlackHoleCanvas({
  WireframeComponent,
  onEnter,
  onExit,
  initialExpanded = false, // Default to false for home page
}: BlackHoleCanvasProps) {
  // Set initial state based on prop
  const [isExpanded, setIsExpanded] = useState(initialExpanded);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [animState, setAnimState] = useState<AnimationState>("idle");
  const [showWireframe, setShowWireframe] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let cw = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let ch = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    // Dynamic responsive orbit
    let maxorbit = Math.min(cw, ch) * 0.35;
    let centerx = cw / 2;
    let centery = ch / 2;

    const startTime = new Date().getTime();
    let currentTime = 0;
    const stars: Star[] = [];

    function rotate(cx: number, cy: number, x: number, y: number, angle: number): [number, number] {
      const radians = angle;
      const cos = Math.cos(radians);
      const sin = Math.sin(radians);
      const nx = cos * (x - cx) + sin * (y - cy) + cx;
      const ny = cos * (y - cy) - sin * (x - cx) + cy;
      return [nx, ny];
    }

    class Star {
      orbital: number;
      x: number;
      y: number;
      yOrigin: number;
      speed: number;
      rotation: number;
      startRotation: number;
      id: number;
      collapseBonus: number;
      color: string;
      hoverPos: number;
      expansePos: number;

      constructor(id: number) {
        this.id = id;

        const rands = [
          Math.random() * (maxorbit / 2) + 1,
          Math.random() * (maxorbit / 2) + maxorbit,
        ];
        this.orbital = rands.reduce((p, c) => p + c, 0) / rands.length;

        this.x = centerx;
        this.y = centery + this.orbital;
        this.yOrigin = centery + this.orbital;

        this.speed = (Math.floor(Math.random() * 2.5) + 1.5) * (Math.PI / 180);
        this.rotation = 0;
        this.startRotation = (Math.floor(Math.random() * 360) + 1) * (Math.PI / 180);

        this.collapseBonus = this.orbital - maxorbit * 0.7;
        if (this.collapseBonus < 0) this.collapseBonus = 0;

        this.color = `rgba(255, 255, 255, ${Math.max(0.15, 1 - this.orbital / maxorbit)})`;
        this.hoverPos = centery + maxorbit / 2 + this.collapseBonus;
        this.expansePos = centery + (this.id % 100) * -10 + (Math.floor(Math.random() * 20) + 1);
      }

      draw(context: CanvasRenderingContext2D, currentState: AnimationState) {
        if (currentState !== "expanse") {
          this.rotation = this.startRotation + currentTime * this.speed;

          if (currentState === "idle") {
            if (this.y > this.yOrigin) this.y -= 3.5;
            if (this.y < this.yOrigin - 4) this.y += (this.yOrigin - this.y) / 8;
          } else if (currentState === "collapse") {
            if (this.y > this.hoverPos) this.y -= (this.hoverPos - this.y) / -5;
            if (this.y < this.hoverPos - 4) this.y += 2.5;
          }
        } else {
          this.rotation = this.startRotation + currentTime * (this.speed / 2);
          if (this.y > this.expansePos) {
            this.y -= Math.floor(this.expansePos - this.y) / -140;
          }
        }

        const pos = rotate(centerx, centery, this.x, this.y, this.rotation);

        context.save();
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(pos[0], pos[1], 1.1, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    const handleResize = () => {
      cw = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      ch = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
      centerx = cw / 2;
      centery = ch / 2;
      maxorbit = Math.min(cw, ch) * 0.35;
    };
    window.addEventListener("resize", handleResize);

    for (let i = 0; i < 2000; i++) {
      stars.push(new Star(i));
    }

    let stateRef = animState;

    const loop = () => {
      const now = new Date().getTime();
      currentTime = (now - startTime) / 50;

      ctx.clearRect(0, 0, cw, ch);

      for (let i = 0; i < stars.length; i++) {
        stars[i].draw(ctx, stateRef);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    const updateStateRef = (e: CustomEvent<AnimationState>) => {
      stateRef = e.detail;
    };
    window.addEventListener("anim-state-change" as any, updateStateRef);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("anim-state-change" as any, updateStateRef);
    };
  }, []);

  const setGlobalState = (newState: AnimationState) => {
    setAnimState(newState);
    window.dispatchEvent(new CustomEvent("anim-state-change", { detail: newState }));
  };

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (animState !== "expanse") {
      setGlobalState("expanse");

      setTimeout(() => {
        setShowWireframe(true);
      }, 500);

      if (onEnter) onEnter();
    }
  };

  const handleBackgroundClick = () => {
    if (animState === "expanse") {
      setShowWireframe(false);
      setGlobalState("idle");

      if (onExit) onExit();
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleBackgroundClick}
      className={`relative w-full h-full min-h-screen flex items-center justify-center overflow-hidden bg-transparent ${
        animState === "expanse" ? "cursor-pointer" : ""
      }`}
    >
      {/* LOCKED CENTER AVATAR PORTRAIT */}
      {!showWireframe && (
        <div
          onClick={handleAvatarClick}
          onMouseEnter={() => animState !== "expanse" && setGlobalState("collapse")}
          onMouseLeave={() => animState !== "expanse" && setGlobalState("idle")}
          className={`group absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-500 ease-in-out ${
            animState === "expanse"
              ? "opacity-0 scale-50 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
          style={{ width: "290px", height: "290px" }}
        >
          {/* Strictly locked 290px x 290px circle */}
          <div
            className="rounded-full border-2 border-[var(--primary-color,#00ffff)] shadow-[0_0_20px_var(--primary-color)] group-hover:shadow-[0_0_40px_var(--primary-color)] transition-all duration-500 overflow-hidden bg-black flex items-center justify-center"
            style={{ width: "290px", height: "290px", minWidth: "290px", minHeight: "290px" }}
          >
            <img
              src="/hxhAbon.png"
              alt="Mechatronics & Software Engineer"
              className="rounded-full pointer-events-none"
              style={{
                width: "290px",
                height: "290px",
                maxWidth: "290px",
                maxHeight: "290px",
                objectFit: "cover",
              }}
            />
          </div>
        </div>
      )}

      {/* POST-EXPANSE OVERLAY (SKILLS CARD) */}
      {showWireframe && WireframeComponent && (
        <div className="absolute z-20 w-full h-full flex items-center justify-center animate-[fade-in_0.5s_ease-out]">
          {WireframeComponent}
        </div>
      )}

      {/* STAR FIELD CANVAS */}
      <canvas ref={canvasRef} className="relative z-0 block w-full h-full bg-transparent" />
    </div>
  );
}