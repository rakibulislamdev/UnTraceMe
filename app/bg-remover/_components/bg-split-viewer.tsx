"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface BgSplitViewerProps {
  originalUrl: string;
  processedUrl: string;
  viewMode: "split" | "result" | "original";
  currentBg: string;
  activeBackdrop: string;
}

export function BgSplitViewer({
  originalUrl,
  processedUrl,
  viewMode,
  currentBg,
  activeBackdrop,
}: BgSplitViewerProps) {
  const [sliderPosition, setSliderPosition] = useState(50);

  return (
    <div className="relative w-full h-[400px] sm:h-[480px] rounded-2xl border border-border overflow-hidden select-none shadow-sm">
      {/* Checkerboard Pattern Base for Transparency visualization */}
      <div
        className="absolute inset-0 z-0 bg-[linear-gradient(45deg,#00000008_25%,transparent_25%),linear-gradient(-45deg,#00000008_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#00000008_75%),linear-gradient(-45deg,transparent_75%,#00000008_75%)] dark:bg-[linear-gradient(45deg,#ffffff08_25%,transparent_25%),linear-gradient(-45deg,#ffffff08_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ffffff08_75%),linear-gradient(-45deg,transparent_75%,#ffffff08_75%)] bg-[size:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]"
        style={{
          backgroundColor: currentBg === "transparent" ? undefined : currentBg,
        }}
      />

      {/* Result Mode */}
      {viewMode === "result" && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={processedUrl}
            alt="Processed Background Removed"
            className="max-h-full max-w-full object-contain filter drop-shadow-md"
          />
        </div>
      )}

      {/* Original Mode */}
      {viewMode === "original" && (
        <div className="absolute inset-0 flex items-center justify-center p-4 z-10 bg-background">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={originalUrl}
            alt="Original"
            className="max-h-full max-w-full object-contain"
          />
        </div>
      )}

      {/* Interactive Split Mode Slider */}
      {viewMode === "split" && (
        <>
          {/* Background Cutout (Left Side or Base) */}
          <div className="absolute inset-0 flex items-center justify-center p-4 z-10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={processedUrl}
              alt="Processed"
              className="max-h-full max-w-full object-contain filter drop-shadow-md"
            />
          </div>

          {/* Original Image Layer Clipped */}
          <div
            className="absolute inset-0 flex items-center justify-center p-4 z-20 overflow-hidden bg-background"
            style={{
              clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={originalUrl}
              alt="Original"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          {/* Interactive Slider Divider Line */}
          <div
            className="absolute top-0 bottom-0 z-30 w-0.5 bg-primary pointer-events-none"
            style={{ left: `${sliderPosition}%` }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 size-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg border-2 border-background font-mono text-[10px]">
              ↔
            </div>
          </div>

          {/* Drag controller overlay */}
          <input
            type="range"
            min="0"
            max="100"
            value={sliderPosition}
            onChange={(e) => setSliderPosition(Number(e.target.value))}
            className="absolute inset-0 z-40 opacity-0 cursor-ew-resize w-full h-full"
          />

          {/* Split Labels */}
          <div className="absolute top-3 left-3 z-30 pointer-events-none">
            <Badge variant="secondary" className="text-[10px] bg-background/80 backdrop-blur-xs font-semibold shadow-xs">
              Cutout ({activeBackdrop === "transparent" ? "Alpha" : "Colored"})
            </Badge>
          </div>
          <div className="absolute top-3 right-3 z-30 pointer-events-none">
            <Badge variant="secondary" className="text-[10px] bg-background/80 backdrop-blur-xs font-semibold shadow-xs">
              Original
            </Badge>
          </div>
        </>
      )}
    </div>
  );
}
