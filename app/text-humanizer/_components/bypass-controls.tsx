"use client";

import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon, Shield01Icon, BookOpen01Icon } from "hugeicons-react";
import { cn } from "@/lib/utils";

export type HumanizeMode = "academic" | "natural" | "stealth";

interface BypassControlsProps {
  mode: HumanizeMode;
  setMode: (mode: HumanizeMode) => void;
  disabled?: boolean;
}

const TABS: { id: HumanizeMode; label: string; icon: React.ElementType }[] = [
  { id: "natural", label: "Natural", icon: SparklesIcon },
  { id: "academic", label: "Academic", icon: BookOpen01Icon },
  { id: "stealth", label: "Turnitin Stealth", icon: Shield01Icon },
];

export function BypassControls({ mode, setMode, disabled }: BypassControlsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card shadow-sm">
      <div>
        <h4 className="text-sm font-semibold text-foreground tracking-tight">
          Humanization Profile
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Select target cadence algorithm for optimal bypass rate.
        </p>
      </div>

      {/* Apple-style Segmented Glass Tab Container - Responsive Scrolling on Mobile */}
      <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
        <div className="relative inline-flex items-center p-1 rounded-full bg-secondary/80 border border-border/60 shadow-inner backdrop-blur-md min-w-max">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = mode === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => !disabled && setMode(tab.id)}
              disabled={disabled}
              type="button"
              className={cn(
                "relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none cursor-pointer",
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
                disabled && "opacity-50 pointer-events-none cursor-not-allowed"
              )}
            >
              {/* Apple Sliding Pill Spring Indicator */}
              {isActive && (
                <motion.div
                  layoutId="apple-active-tab-indicator"
                  className="absolute inset-0 z-[-1] rounded-full bg-card shadow-sm border border-border/80"
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 38,
                    mass: 0.8,
                  }}
                />
              )}
              <Icon className="size-3.5 -mt-px shrink-0" />
              <span>{tab.label}</span>
            </button>
          );
        })}
        </div>
      </div>
    </div>
  );
}
