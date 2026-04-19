"use client";

import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/class-merger";

interface RippleCardProps {
  children: ReactNode;
  className?: string;
}

export function RippleCard({ children, className }: RippleCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  function handlePointerDown(e: React.PointerEvent) {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const size = Math.max(rect.width, rect.height) * 2;

    const ripple = document.createElement("span");
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x - size / 2}px;
      top: ${y - size / 2}px;
      border-radius: 50%;
      background: rgba(255, 90, 31, 0.15);
      transform: scale(0);
      animation: ripple-burst 600ms ease-out forwards;
      pointer-events: none;
    `;

    container.appendChild(ripple);
    ripple.addEventListener("animationend", () => ripple.remove());
  }

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      className={cn("relative overflow-hidden", className)}
    >
      {children}
    </div>
  );
}
