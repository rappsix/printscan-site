"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { AdaptiveDpr, Float, MeshDistortMaterial } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group, Mesh } from "three";

function RotatingCore() {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<Group>(null);
  const gyro = useRef({ x: 0, y: 0 });
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const isMobile = !window.matchMedia("(pointer: fine)").matches;
    if (!isMobile) return;

    function onOrientation(e: DeviceOrientationEvent) {
      const beta = e.beta ?? 0;   // -180..180 front-back tilt
      const gamma = e.gamma ?? 0; // -90..90 left-right tilt
      gyro.current.x = MathUtils.clamp(gamma / 30, -1, 1);
      gyro.current.y = MathUtils.clamp((beta - 45) / 40, -1, 1);
    }

    window.addEventListener("deviceorientation", onOrientation);

    // iOS 13+ requires permission
    if (
      typeof DeviceOrientationEvent !== "undefined" &&
      // @ts-expect-error – iOS-only API
      typeof DeviceOrientationEvent.requestPermission === "function"
    ) {
      const requestOnTap = () => {
        // @ts-expect-error – iOS-only API
        DeviceOrientationEvent.requestPermission().catch(() => {});
        canvas.removeEventListener("click", requestOnTap);
      };
      canvas.addEventListener("click", requestOnTap);
      return () => {
        window.removeEventListener("deviceorientation", onOrientation);
        canvas.removeEventListener("click", requestOnTap);
      };
    }

    return () => window.removeEventListener("deviceorientation", onOrientation);
  }, [gl]);

  useFrame((state, delta) => {
    if (!meshRef.current || !groupRef.current) return;

    meshRef.current.rotation.x += delta * 0.15;
    meshRef.current.rotation.y += delta * 0.25;

    const isMobile = !window.matchMedia("(pointer: fine)").matches;
    const targetY = isMobile ? gyro.current.x * 0.5 : state.pointer.x * 0.45;
    const targetX = isMobile ? gyro.current.y * 0.35 : -state.pointer.y * 0.3;

    groupRef.current.rotation.y = MathUtils.lerp(
      groupRef.current.rotation.y,
      targetY,
      delta * 2.5,
    );
    groupRef.current.rotation.x = MathUtils.lerp(
      groupRef.current.rotation.x,
      targetX,
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
