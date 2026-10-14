"use client";

import React from "react";
import { 
  SecurityLockIcon, 
  CleanIcon, 
  Key01Icon, 
  BubbleChatIcon, 
  ParagraphSpacingIcon
} from "hugeicons-react";
import { cn } from "@/lib/utils";
import { ScrubberOptions } from "@/lib/text-engine/prompt-scrubber";

interface ScrubberControlsProps {
  options: ScrubberOptions;
  setOptions: React.Dispatch<React.SetStateAction<ScrubberOptions>>;
  disabled?: boolean;
}

export function ScrubberControls({
  options,
  setOptions,
  disabled = false,
}: ScrubberControlsProps) {
  const toggleOption = (key: keyof ScrubberOptions) => {
    if (disabled) return;
    setOptions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const controls = [
    {
      id: "stripJailbreaks" as const,
      label: "Strip Jailbreaks & Injections",
      description: "Removes DAN, Dev Mode toggles, and system override preambles",
      icon: SecurityLockIcon,
      active: options.stripJailbreaks,
    },
    {
      id: "stripWatermarks" as const,
      label: "Strip Watermarks & Tags",
      description: "Purges zero-width chars, OpenAI/Claude stamps, and [tool:...] tokens",
      icon: CleanIcon,
      active: options.stripWatermarks,
    },
    {
      id: "redactSecrets" as const,
      label: "Redact Sensitive Keys & IPs",
      description: "Masks exposed OpenAI API keys, internal IPs, and credentials",
      icon: Key01Icon,
      active: options.redactSecrets,
    },
    {
      id: "cleanMetaInstructions" as const,
      label: "Remove Meta & Preambles",
      description: "Eliminates 'Certainly! Here is...', XML tags, and bot sign-offs",
      icon: BubbleChatIcon,
      active: options.cleanMetaInstructions,
    },
    {
      id: "normalizeWhitespace" as const,
      label: "Normalize Formatting",
      description: "Trims ghost spacing, duplicate line breaks, and trailing spaces",
      icon: ParagraphSpacingIcon,
      active: options.normalizeWhitespace,
    },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 mb-3 border-b border-border gap-2">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Scrubbing Filters & Rules
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Configure sanitization layers applied to your prompt workspace
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {controls.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              disabled={disabled}
              onClick={() => toggleOption(item.id)}
              className={cn(
                "flex items-start gap-3 p-3 rounded-lg border text-left transition-all duration-150 select-none cursor-pointer",
                item.active
                  ? "border-primary/40 bg-primary/5 text-foreground shadow-xs"
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <div
                className={cn(
                  "size-8 rounded-md flex items-center justify-center shrink-0 mt-0.5 transition-colors",
                  item.active
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                <Icon className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-semibold tracking-tight flex items-center justify-between">
                  <span>{item.label}</span>
                  <span
                    className={cn(
                      "size-1.5 rounded-full shrink-0 ml-1.5",
                      item.active ? "bg-primary" : "bg-muted-foreground/30"
                    )}
                  />
                </div>
                <p className="text-[11px] text-muted-foreground mt-1 leading-snug line-clamp-2">
                  {item.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
