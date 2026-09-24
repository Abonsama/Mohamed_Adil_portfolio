"use client";

import React from "react";

export default function PostExpanseWireframe() {
  return (
    <div className="relative z-20 flex items-center justify-center p-4">
      {/* Outer Bordered Container */}
      <div className="w-full max-w-2xl bg-black/80 backdrop-blur-md border border-[var(--primary-color)] rounded-xl p-6 md:p-8 shadow-[0_0_30px_var(--primary-color)] flex flex-col md:flex-row gap-6 items-stretch justify-center">
        
        {/* Card 1: Web Stack */}
        <div className="flex-1 bg-black/60 border border-[var(--primary-color)]/60 rounded-lg p-5 flex flex-col justify-between hover:border-[var(--primary-color)] transition-colors">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide text-center">
              Web Stack
            </h3>
            <p className="text-xs text-[var(--primary-color)] mb-1 font-mono">
              Frontend: Next.js & React
            </p>
            <p className="text-xs text-[var(--primary-color)] mb-4 font-mono">
              Backend: FastAPI & Supabase
            </p>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Crafting fast, scalable web applications with modern frontend frameworks and robust API architectures.
          </p>
        </div>

        {/* Card 2: Robotics & Embedded */}
        <div className="flex-1 bg-black/60 border border-[var(--primary-color)]/60 rounded-lg p-5 flex flex-col justify-between hover:border-[var(--primary-color)] transition-colors">
          <div>
            <h3 className="text-lg font-bold text-white mb-2 tracking-wide text-center">
              Robotics & Embedded
            </h3>
            <p className="text-xs text-[var(--primary-color)] mb-1 font-mono">
              Frameworks: ROS 2
            </p>
            <p className="text-xs text-[var(--primary-color)] mb-4 font-mono">
              Hardware / MCU: ESP32 & Arduino
            </p>
          </div>
          <p className="text-xs text-gray-300 leading-relaxed font-sans">
            Engineering smart robotic platforms, complex sensor setups, and autonomous control systems.
          </p>
        </div>

      </div>
    </div>
  );
}