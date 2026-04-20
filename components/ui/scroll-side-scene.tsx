"use client";

import { useRef, Component, type ReactNode } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, AdaptiveDpr } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";

type ObjConfig = {
  side: "left" | "right";
  baseY: number;
  scrollFactor: number;
  geometry: "icosahedron" | "octahedron" | "torus" | "sphere";
  scale: number;
  speed: [number, number];
};

const OBJECTS: ObjConfig[] = [
  { side: "left",  baseY: -1.0, scrollFactor: 10,  geometry: "icosahedron", scale: 1.3, speed: [0.05, 0.08] },
  { side: "left",  baseY:  2.5, scrollFactor: 16,  geometry: "torus",       scale: 1.1, speed: [0.07, 0.04] },
  { side: "right", baseY:  1.0, scrollFactor: 13,  geometry: "octahedron",  scale: 1.2, speed: [0.06, 0.09] },
  { side: "right", baseY: -2.5, scrollFactor: 7,   geometry: "sphere",      scale: 1.0, speed: [0.04, 0.07] },
];

function SideObject({ cfg }: { cfg: ObjConfig }) {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);
  const { viewport } = useThree();

  useFrame((_, delta) => {
    if (!groupRef.current || !meshRef.current) return;

    meshRef.current.rotation.x += delta * cfg.speed[0];
    meshRef.current.rotation.y += delta * cfg.speed[1];

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;

    const targetY = cfg.baseY + progress * cfg.scrollFactor;
    groupRef.current.position.y = MathUtils.lerp(
      groupRef.current.position.y,
      targetY,
      delta * 5,
    );

    groupRef.current.position.x =
      (viewport.width / 2 + 0.9) * (cfg.side === "left" ? -1 : 1);
  });

  return (
    <group ref={groupRef}>
      <Float speed={0.8} rotationIntensity={0.18} floatIntensity={0.35}>
        <mesh ref={meshRef} scale={cfg.scale}>
          {cfg.geometry === "icosahedron" && <icosahedronGeometry args={[1, 1]} />}
          {cfg.geometry === "octahedron"  && <octahedronGeometry  args={[1, 0]} />}
          {cfg.geometry === "torus"       && <torusGeometry       args={[0.8, 0.34, 16, 48]} />}
          {cfg.geometry === "sphere"      && <sphereGeometry      args={[1, 32, 32]} />}
          <MeshDistortMaterial
            color="#ff5a1f"
            emissive="#ff5a1f"
            emissiveIntensity={0.15}
            roughness={0.13}
            metalness={0.65}
            distort={0.22}
            speed={1.1}
            transparent
            opacity={0.88}
          />
        </mesh>
      </Float>
    </group>
  );
}

class SceneBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() {
    if (this.state.failed) return null;
    return this.props.children;
  }
}

export function ScrollSideScene() {
  return (
    <SceneBoundary>
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 hidden xl:block"
        style={{ zIndex: 1 }}
      >
        <Canvas
          camera={{ position: [0, 0, 10], fov: 50 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          performance={{ min: 0.5 }}
          style={{ width: "100%", height: "100%" }}
        >
          <AdaptiveDpr pixelated />
          <ambientLight intensity={0.1} />
          <directionalLight position={[3, 5, 3]} intensity={2.5} color="#ffffff" />
          <pointLight position={[-2, -2, 1]} intensity={0.2} color="#ff5a1f" />
          {OBJECTS.map((cfg, i) => (
            <SideObject key={i} cfg={cfg} />
          ))}
        </Canvas>
      </div>
    </SceneBoundary>
  );
}
