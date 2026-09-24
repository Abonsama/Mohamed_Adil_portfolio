"use client";

import React, { useState, useEffect, useRef } from "react";
import { Circle, Palette } from "lucide-react";
import { HexColorPicker } from "react-colorful";

export default function ThemeSelection() {
  const themes = [
    { name: "Cyan (Default)", color: "#00ffff" },
    { name: "Red", color: "#FF0000" },
    { name: "Green", color: "#00FF00" },
    { name: "Blue", color: "#0000FF" },
    { name: "Yellow", color: "#FFFF00" },
  ];

  const [activeColor, setActiveColor] = useState<string>(themes[0].color);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [showTheme, setShowTheme] = useState<boolean>(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleColorChange = (color: string) => {
    setActiveColor(color);
    document.documentElement.style.setProperty("--primary-color", color);
    localStorage.setItem("portfolio-primary-color", color);
  };

  // Improved outside-click listener that doesn't close on drag
  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    if (showPicker) {
      document.addEventListener("pointerdown", handleClickOutside);
    }
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, [showPicker]);

  // Load initial theme from localStorage
  useEffect(() => {
    const savedColor = localStorage.getItem("portfolio-primary-color");
    if (savedColor) {
      setActiveColor(savedColor);
      document.documentElement.style.setProperty("--primary-color", savedColor);
    }
  }, []);

  return (
    <div  className="relative inline-flex items-center gap-3 px-4 py-2 bg-black/80 backdrop-blur-md rounded-full border border-[var(--primary-color)] shadow-lg z-50 animate-[fade-in-down_0.8s_ease-out]">
      <span onClick={()=>setShowTheme(!showTheme)} className="text-lg font-semibold tracking-wider text-[var(--text-color-secondary)]">
        Theme
      </span>

      {/* Palette Trigger & Custom Popover */}
      <div className="relative" ref={popoverRef}>
        <button
          type="button"
          onClick={() => setShowPicker(!showPicker)}
          className="relative w-6 h-6 flex items-center justify-center rounded-full transition-transform hover:scale-110 text-[var(--primary-color)]"
          title="Custom Color Spectrum"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Custom Wheel / Spectrum Popover */}
        {showPicker && (
          <div 
            onPointerDown={(e) => e.stopPropagation()} // Keeps color picker drag events inside the popover
            className="absolute top-10 right-0 z-50 p-3 bg-black/95 backdrop-blur-xl border border-[var(--primary-color)] rounded-2xl shadow-2xl flex flex-col items-center gap-2"
          >
            <HexColorPicker color={activeColor} onChange={handleColorChange} />
            <div className="flex items-center gap-2 w-full pt-1">
              <span className="text-[11px] font-mono text-gray-300 uppercase">HEX:</span>
              <input
                type="text"
                value={activeColor}
                onChange={(e) => handleColorChange(e.target.value)}
                className="w-full bg-black/50 text-white font-mono text-xs px-2 py-1 rounded border border-white/20 text-center uppercase focus:outline-none focus:border-[var(--primary-color)]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Preset Swatches */}
      {themes.map((t, index) => {
        const isActive = activeColor.toLowerCase() === t.color.toLowerCase();
        return (
            <button
            key={index}
            onClick={() => handleColorChange(t.color)}
            className={`relative w-6 h-6 flex items-center justify-center rounded-full transition-transform hover:scale-110 animate-[fade-in-down_0.8s_ease-out] ${
              isActive ? "scale-110 ring-2 ring-white" : "opacity-80 hover:opacity-100"
            }
            ${!showTheme? "hidden":""}`}
            title={t.name}
            type="button"
          >
            <Circle
              className="w-full h-full border-none"
              style={{ color: t.color }}
              fill={t.color}
            />
          </button>
        );
      })}
    </div>
  );
}