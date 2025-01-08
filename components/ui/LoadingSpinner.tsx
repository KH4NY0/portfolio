"use client";

import { cn } from "@/lib/utils";

export const LoadingSpinner = ({ className }: { className?: string }) => {
  return (
    <div className={cn("flex items-center justify-center w-full h-full", className)}>
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple"></div>
    </div>
  );
}; 