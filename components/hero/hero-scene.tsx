"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr, Float, MeshDistortMaterial } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";

function RotatingCore() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.25;

    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.45,
      delta * 2.5,
    );
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.3,
      delta * 2.5,
    );
  });

  return (
    <group ref={groupRef}>
      <Float speed={1.2} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh ref={meshRef} scale={1.05}>
          <torusKnotGeometry args={[1, 0.32, 128, 24]} />
          <MeshDistortMaterial
            color="#ff5a1f"
            emissive="#ff5a1f"
            emissiveIntensity={0.15}
            roughness={0.12}
            metalness={0.6}
            distort={0.32}
            speed={1.4}
          />
        </mesh>
      </Float>
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
      <ambientLight intensity={0.15} color="#ffffff" />
      <directionalLight position={[4, 6, 4]} intensity={3.5} color="#ffffff" />
      <pointLight position={[-3, -3, 2]} intensity={0.3} color="#ff5a1f" />
      <RotatingCore />
    </Canvas>
  );
}
