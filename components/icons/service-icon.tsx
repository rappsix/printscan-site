import {
  Box,
  Home,
  Printer,
  ScanLine,
  Sparkles,
  Wrench,
} from "lucide-react";
import type { ComponentType } from "react";
import type { ServiceEntry } from "@/content/services-catalog";

const iconMap: Record<ServiceEntry["icon"], ComponentType<{ size?: number; className?: string }>> = {
  printer: Printer,
  scan: ScanLine,
  wrench: Wrench,
  cube: Box,
  home: Home,
  sparkles: Sparkles,
};

interface ServiceIconProps {
  name: ServiceEntry["icon"];
  size?: number;
  className?: string;
}

export function ServiceIcon({ name, size = 22, className }: ServiceIconProps) {
  const Icon = iconMap[name];
  return <Icon size={size} className={className} />;
}
