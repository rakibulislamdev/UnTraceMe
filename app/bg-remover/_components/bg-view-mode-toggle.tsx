"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BgViewModeToggleProps {
  viewMode: "split" | "result" | "original";
  onViewModeChange: (mode: "split" | "result" | "original") => void;
  disabled?: boolean;
}

const VIEW_MODES: { id: "split" | "result" | "original"; label: string }[] = [
  { id: "split", label: "Split View" },
  { id: "result", label: "Cutout" },
  { id: "original", label: "Original" },
];

export function BgViewModeToggle({
  viewMode,
  onViewModeChange,
  disabled,
}: BgViewModeToggleProps) {
  return (
    <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
      <div className="relative inline-flex items-center p-1 rounded-full bg-secondary/80 border border-border/60 shadow-inner backdrop-blur-md min-w-max">
        {VIEW_MODES.map((tab) => {
          const isActive = viewMode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => !disabled && onViewModeChange(tab.id)}
              disabled={disabled}
              type="button"
              className={cn(
                "relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none cursor-pointer",
                isActive
                  ? "text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground",
                disabled && "opacity-50 pointer-events-none cursor-not-allowed"
              )}
            >
              {/* Apple Sliding Pill Spring Indicator */}
              {isActive && (
                <motion.div
                  layoutId="bg-view-mode-indicator"
                  className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-xs"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 38,
                    mass: 0.8,
                  }}
                />
              )}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
