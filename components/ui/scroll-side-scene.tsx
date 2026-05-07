"use client";

import { useRef, useMemo, Component, type ReactNode } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { AdaptiveDpr } from "@react-three/drei";
import { MathUtils } from "three";
import type { Points } from "three";

type LayerProps = {
  count: number;
  spread: [number, number];
  size: number;
  opacity: number;
  scrollFactor: number;
  rotationSpeed: number;
};

function ParticleLayer({ count, spread, size, opacity, scrollFactor, rotationSpeed }: LayerProps) {
  const ref = useRef<Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3]     = (Math.random() - 0.5) * spread[0];
      arr[i * 3 + 1] = (Math.random() - 0.5) * spread[1];
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, [count, spread]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
    const targetY = progress * scrollFactor;
    ref.current.position.y = MathUtils.lerp(ref.current.position.y, targetY, delta * 4);
    ref.current.rotation.y += delta * rotationSpeed;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        color="#ff5a1f"
        size={size}
        sizeAttenuation
        transparent
        opacity={opacity}
      />
    </points>
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
        className="pointer-events-none fixed inset-0"
        style={{ zIndex: 1 }}
      >
        <Canvas
          camera={{ position: [0, 0, 8], fov: 60 }}
          dpr={[1, 1.5]}
          gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
          performance={{ min: 0.5 }}
          style={{ width: "100%", height: "100%", pointerEvents: "none" }}
        >
          <AdaptiveDpr pixelated />
          {/* far layer — slow, tiny */}
          <ParticleLayer
            count={70}
            spread={[22, 16]}
            size={0.055}
            opacity={0.35}
            scrollFactor={3}
            rotationSpeed={0.015}
          />
          {/* mid layer */}
          <ParticleLayer
            count={45}
            spread={[20, 14]}
            size={0.09}
            opacity={0.45}
            scrollFactor={6}
            rotationSpeed={0.022}
          />
          {/* near layer — fast, bright */}
          <ParticleLayer
            count={25}
            spread={[18, 12]}
            size={0.14}
            opacity={0.55}
            scrollFactor={11}
            rotationSpeed={0.03}
          />
        </Canvas>
      </div>
    </SceneBoundary>
  );
}
