"use client";

import { useRef, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial, AdaptiveDpr } from "@react-three/drei";
import type { Mesh } from "three";

export type OrbVariant = "icosahedron" | "octahedron" | "torus" | "sphere";

function OrbMesh({ variant }: { variant: OrbVariant }) {
  const meshRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += delta * 0.07;
    meshRef.current.rotation.y += delta * 0.11;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.2} floatIntensity={0.45}>
      <mesh ref={meshRef}>
        {variant === "icosahedron" && <icosahedronGeometry args={[1, 1]} />}
        {variant === "octahedron" && <octahedronGeometry args={[1, 0]} />}
        {variant === "torus" && <torusGeometry args={[0.8, 0.34, 16, 48]} />}
        {variant === "sphere" && <sphereGeometry args={[1, 32, 32]} />}
        <MeshDistortMaterial
          color="#ff5a1f"
          emissive="#ff5a1f"
          emissiveIntensity={0.13}
          roughness={0.14}
          metalness={0.65}
          distort={0.22}
          speed={1.1}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  );
}

class OrbBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function SectionOrb({ variant = "icosahedron" }: { variant?: OrbVariant }) {
  return (
    <OrbBoundary>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        performance={{ min: 0.5 }}
      >
        <AdaptiveDpr pixelated />
        <ambientLight intensity={0.12} />
        <directionalLight position={[3, 5, 3]} intensity={2.5} color="#ffffff" />
        <pointLight position={[-2, -2, 1]} intensity={0.25} color="#ff5a1f" />
        <OrbMesh variant={variant} />
      </Canvas>
    </OrbBoundary>
  );
}
