"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/class-merger";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxAngle?: number;
}

export function TiltCard({ children, className, maxAngle = 10 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);

  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-maxAngle, maxAngle]), {
    stiffness: 200,
    damping: 22,
  });
  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [maxAngle, -maxAngle]), {
    stiffness: 200,
    damping: 22,
  });
  const glareX = useTransform(rawX, [-0.5, 0.5], [0, 100]);
  const glareY = useTransform(rawY, [-0.5, 0.5], [0, 100]);

  function onMouseMove(e: React.MouseEvent) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    rawX.set((e.clientX - rect.left) / rect.width - 0.5);
    rawY.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function onMouseLeave() {
    rawX.set(0);
    rawY.set(0);
  }

  return (
    <div style={{ perspective: "1200px" }} className={cn("relative", className)}>
      <motion.div
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full w-full"
      >
        {children}
        {/* glare overlay */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.07), transparent 60%)`,
            ),
          }}
        />
      </motion.div>
    </div>
  );
}
