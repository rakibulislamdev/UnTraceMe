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
    <section className="py-10 md:py-14 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-1">
      {/* Header and Bottom-Line Tab Bar */}
      <div className="mb-8 space-y-5 pb-5 border-b border-border">
        <div>
          <span className="text-xs uppercase tracking-wide text-primary font-semibold flex items-center gap-1.5">
            <span className="size-1.5 rounded-full bg-primary" />
            Available Modules ({tools.length})
          </span>
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground mt-1">
            Anti-Detection & Media Engines
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            All tools run with zero data storage or signups
          </p>
        </div>

        {/* Tab on its own single bottom line */}
        <div className="w-full overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="relative inline-flex items-center p-1 rounded-full bg-secondary/80 border border-border/60 shadow-inner backdrop-blur-md min-w-max">
            {categories.map((tab) => {
              const Icon = tab.icon;
              const isActive = selectedCategory === tab.id;

              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as CategoryFilter)}
                  type="button"
                  className={cn(
                    "relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none cursor-pointer",
                    isActive
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Apple Sliding Pill Spring Indicator with Brand Primary Color */}
                  {isActive && (
                    <motion.div
                      layoutId="apple-modules-tab-indicator"
                      className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-xs"
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 38,
                        mass: 0.8,
                      }}
                    />
                  )}
                  <Icon className={cn("size-3.5 -mt-px shrink-0", isActive ? "text-primary-foreground" : "text-muted-foreground")} />
                  <span>{tab.label}</span>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.2 rounded-full font-mono transition-colors",
                      isActive
                        ? "bg-primary-foreground/20 text-primary-foreground"
                        : "bg-background/50 text-muted-foreground"
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

      {/* Compact 3-Column Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredTools.map((tool) => (
          <ToolCard key={tool.id} tool={tool} />
        ))}
      </div>
    </section>
  );
}
