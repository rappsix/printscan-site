"use client";

import { trackGoal } from "@/lib/analytics";

interface TrackedLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  goal: string;
}

export function TrackedLink({ goal, onClick, ...props }: TrackedLinkProps) {
  return (
    <a
      {...props}
      onClick={(e) => {
        trackGoal(goal);
        onClick?.(e);
      }}
    />
  );
}
