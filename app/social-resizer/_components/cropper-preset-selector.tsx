"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SOCIAL_PRESETS, SocialPreset } from "@/lib/image-engine/social-presets";

interface CropperPresetSelectorProps {
  selectedPreset: SocialPreset;
  onSelectPreset: (preset: SocialPreset) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  hasImage: boolean;
  className?: string;
}

export function CropperPresetSelector({
  selectedPreset,
  onSelectPreset,
  zoom,
  onZoomChange,
  hasImage,
  className,
}: CropperPresetSelectorProps) {
  return (
    <Card className={cn("p-6 rounded-xl border border-border bg-card space-y-4", className)}>
      <div className="space-y-4 flex-1 flex flex-col min-h-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            PRESET FORMATS ({SOCIAL_PRESETS.length})
          </span>
          <span className="text-xs text-primary font-medium">
            {selectedPreset.platform}
          </span>
        </div>

        {/* Preset Buttons Grid */}
        <div 
          data-lenis-prevent
          className="grid grid-cols-1 sm:grid-cols-2 gap-2 flex-1 min-h-[220px] max-h-72 overflow-y-auto overscroll-contain pr-1"
        >
          {SOCIAL_PRESETS.map((preset) => {
            const isSelected = selectedPreset.id === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className={cn(
                  "p-3 rounded-lg text-left transition-colors duration-150 flex flex-col justify-between select-none cursor-pointer border-2",
                  isSelected
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-secondary/40 hover:bg-secondary hover:border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-tight text-primary">
                    {preset.platform}
                  </span>
                  <Badge variant="outline" className="text-[9px] px-1.5 py-0 border-border">
                    {preset.aspectRatio}
                  </Badge>
                </div>
                <div className="text-xs font-medium text-foreground truncate">
                  {preset.name}
                </div>
                <div className="text-[10px] text-muted-foreground mt-1 font-mono">
                  {preset.width} × {preset.height}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Interactive Zoom Controls */}
      {hasImage ? (
        <div className="pt-4 border-t border-border space-y-3 shrink-0">
          <div className="flex items-center justify-between text-xs h-6">
            <span className="text-muted-foreground font-medium">Zoom & Scale</span>
            <div className="flex items-center gap-2">
              <span className="font-mono text-foreground text-xs font-medium w-10 text-right">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => onZoomChange(1)}
                className={cn(
                  "text-[11px] text-muted-foreground hover:text-foreground transition-all cursor-pointer px-1.5 py-0.5 rounded bg-secondary hover:bg-secondary/80 border border-border",
                  zoom === 1 && "invisible pointer-events-none"
                )}
              >
                Reset
              </button>
            </div>
          </div>
          <input
            type="range"
            min={1}
            max={3}
            step={0.05}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
            className="w-full accent-primary h-1.5 bg-secondary rounded-lg appearance-none cursor-pointer"
          />
        </div>
      ) : null}
    </Card>
  );
}

