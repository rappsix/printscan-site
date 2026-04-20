"use client";

import dynamic from "next/dynamic";
export type { OrbVariant } from "./section-orb";

export const SectionOrb = dynamic(
  () => import("./section-orb").then((m) => m.SectionOrb),
  { ssr: false, loading: () => null },
);
