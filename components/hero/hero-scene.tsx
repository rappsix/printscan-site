"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Float, MeshDistortMaterial } from "@react-three/drei";
import type { Mesh } from "three";

function RotatingCore() {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.25;
  });

  return (
    <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={meshRef} scale={1.05}>
        <torusKnotGeometry args={[1, 0.32, 128, 24]} />
        <MeshDistortMaterial
          color="#ff5a1f"
          roughness={0.2}
          metalness={0.65}
          distort={0.32}
          speed={1.4}
        />
      </mesh>
    </Float>
  );
}

function AmbientParticles() {
  const positions = Array.from({ length: 18 }, (_, index) => {
    const angle = (index / 18) * Math.PI * 2;
    return [Math.cos(angle) * 2.2, Math.sin(angle * 1.3) * 1.2, Math.sin(angle) * 2.2] as const;
  });

  return (
    <group>
      {positions.map((pos, index) => (
        <Float key={index} speed={0.6 + (index % 3) * 0.2} rotationIntensity={0.2} floatIntensity={0.8}>
          <mesh position={pos}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#3fb0ff" />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 42 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      performance={{ min: 0.5 }}
    >
      <AdaptiveDpr pixelated />
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1.4} />
      <directionalLight position={[-4, -3, -4]} intensity={0.3} color="#1a2a4a" />
      <pointLight position={[-5, -2, 2]} intensity={0.8} color="#3fb0ff" />
      <pointLight position={[3, 4, 2]} intensity={0.5} color="#ff7944" />
      <RotatingCore />
      <AmbientParticles />
    </Canvas>
  );
}
