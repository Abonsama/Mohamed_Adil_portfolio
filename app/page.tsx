"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import PostExpanseWireframe from "./components/PostExpanseWireframe";

const BlackHoleCanvas = dynamic(() => import("./components/BlackHoleCanvas"), {
  ssr: false,
});

export default function Home() {
  // controls the cursor entrance to the orbit 
  const [hasEntered, setHasEntered] = useState(false);

  return (
    <>
      <section className="absolute w-full">
        <div className="relative z-10 flex flex-col h-screen w-full items-center">
          
          {/* 1. Main Titles Overlay (Hides smoothly when avatar is entered) */}
          {!hasEntered && (
            <div className="absolute z-20 top-6 text-center pointer-events-none px-4 animate-[fade-in-down_0.8s_ease-out]">
              <h1 className="tracking-[10px] text-3xl md:text-4xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                Mechatronics & Software Engineer
              </h1>
              <p className="pt-6 tracking-[4px] text-lg md:text-lg font-normal text-gray-300 mx-auto drop-shadow-md">
                Building modern web interfaces, full-stack systems, and autonomous robotics
              </p>
            </div>
          )}

          {/* 2. Canvas stays mounted so PostExpanseWireframe can show up */}
          <BlackHoleCanvas 
            WireframeComponent={<PostExpanseWireframe />}
            onEnter={() => setHasEntered(true)}
            onExit={() => setHasEntered(false)}
          />
        </div>
      </section>
    </>
  );
}