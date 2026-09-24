"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Shader for Crisp, Tiny Circular Stars
const SharpStarShaderMaterial = {
  uniforms: {
    uTime: { value: 0 },
  },
  vertexShader: `
    attribute vec3 color;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // Smaller size calculation (reduced from 180.0 to 45.0)
      gl_PointSize = (20.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    varying vec3 vColor;
    
    void main() {
      // Calculate distance from point center (0.0 to 0.5)
      vec2 coord = gl_PointCoord - vec2(0.5);
      float dist = length(coord);
      
      // Hard cutoff outside circle boundary
      if (dist > 0.5) discard;
      
      // Very tight anti-aliased edge smoothing (0.4 to 0.5) for sharp circle
      float alpha = 1.0 - smoothstep(0.4, 0.5, dist);
      
      gl_FragColor = vec4(vColor, alpha * 0.9);
    }
  `,
};

function Stars({ count }: { count: number }) {
  const pointsRef = useRef<THREE.Points>(null!);
  const shaderRef = useRef<THREE.ShaderMaterial>(null!);

  // Higher count (3,000) of smaller particles for proper star field density
  // on desktop; a lighter count is passed in on mobile (see StarBackground).
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const radius = 4 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      // Star color tones (white to crisp subtle cyan/blue)
      const brightness = 0.5 + Math.random() * 0.5;
      col[i * 3] = brightness;
      col[i * 3 + 1] = brightness * 0.98;
      col[i * 3 + 2] = brightness;
    }

    return [pos, col];
  }, [count]);

  // Subtle rotation
  useFrame((state, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x -= delta * 0.01;
      pointsRef.current.rotation.y -= delta * 0.015;
    }
    if (shaderRef.current) {
      shaderRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[colors, 3]}
          />
        </bufferGeometry>
        <shaderMaterial
          ref={shaderRef}
          args={[SharpStarShaderMaterial]}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

export default function StarBackground() {
  // CHANGED (perf only, no visual/style change on desktop): on phones,
  // rendering 3,000 additive-blended points at full device pixel ratio
  // (often 2-3x on modern screens) is the single heaviest thing on this
  // page. Below md we cap DPR, drop antialiasing, and thin the star count.
  // This component is dynamically imported with ssr:false, so window is
  // always available by the time this runs client-side — no hydration
  // mismatch or flash of the wrong state.
  const [isMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768
  );

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 12], fov: 60 }}
        gl={{ antialias: !isMobile, alpha: true }}
        dpr={isMobile ? [1, 1.5] : undefined}
      >
        <ambientLight intensity={0.5} />
        <Stars count={isMobile ? 1200 : 3000} />
      </Canvas>
    </div>
  );
}