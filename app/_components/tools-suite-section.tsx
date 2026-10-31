"use client";

import React, { useState } from "react";
import { ToolItem } from "@/config/tools-registry";
import { ToolCard } from "./tool-card";
import { 
  SparklesIcon, 
  Image01Icon, 
  AiVoiceIcon, 
  Shield01Icon,
  Layers01Icon 
} from "hugeicons-react";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ToolsSuiteSectionProps {
  tools: ToolItem[];
}

type CategoryFilter = "all" | "image" | "text" | "audio" | "security";

export function ToolsSuiteSection({ tools }: ToolsSuiteSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>("all");

  const categories = [
    { id: "all", label: "All Modules", icon: Layers01Icon, count: tools.length },
    { id: "image", label: "Image & Media", icon: Image01Icon, count: tools.filter((t) => t.category === "image").length },
    { id: "text", label: "Text & Prompts", icon: SparklesIcon, count: tools.filter((t) => t.category === "text").length },
    { id: "audio", label: "Voice AI", icon: AiVoiceIcon, count: tools.filter((t) => t.category === "audio").length },
    { id: "security", label: "Security & PDF", icon: Shield01Icon, count: tools.filter((t) => t.category === "security").length },
  ];

  const filteredTools = selectedCategory === "all" 
    ? tools 
    : tools.filter((tool) => tool.category === selectedCategory);

  return (
    <section className="py-12 md:py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* Header and Bottom-Line Tab Bar */}
      <div className="mb-10 space-y-6 pb-6 border-b border-border">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-wider text-primary flex items-center gap-2 font-medium">
              <span className="size-1.5 rounded-full bg-primary" />
              SYSTEM MODULES — {tools.length} AVAILABLE
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-[-0.03em] text-foreground mt-2">
              Media Sanitization & AI Rewrite Engines
            </h2>
            <p className="text-sm text-muted-foreground mt-1 tracking-tight">
              Client-executed processing with zero server logs, telemetry, or storage.
            </p>
          </div>
        </div>

        {/* Linear Filter Pills */}
        <div className="w-full overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative inline-flex items-center gap-1.5 p-1 rounded-full bg-secondary border border-border min-w-max">
            {categories.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                  type="button"
                  className={cn(
                    "relative z-10 inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all duration-150 select-none cursor-pointer",
                    isActive
                      ? "text-white"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="linear-modules-tab-indicator"
                      className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                  <Icon className={cn("size-3.5 shrink-0", isActive ? "text-white" : "text-muted-foreground")} />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded-full font-mono transition-colors",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-card text-muted-foreground border border-border"
                    )}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Linear 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
