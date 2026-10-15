"use client";

import { useState } from "react";
import { Download04Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BgViewModeToggle } from "./bg-view-mode-toggle";
import { BgBackdropPicker } from "./bg-backdrop-picker";
import { BgSplitViewer } from "./bg-split-viewer";

export type BgBackdropType = "transparent" | "white" | "black" | "custom";

interface BgPreviewComparisonProps {
  originalUrl: string;
  processedUrl: string;
  originalFileName: string;
  onDownload: (format: "image/png" | "image/webp" | "image/jpeg", bgColor?: string) => void;
  isDownloading?: boolean;
}

export function BgPreviewComparison({
  originalUrl,
  processedUrl,
  originalFileName,
  onDownload,
  isDownloading,
}: BgPreviewComparisonProps) {
  const [activeBackdrop, setActiveBackdrop] = useState<string>("transparent");
  const [customColor, setCustomColor] = useState<string>("#3b82f6");
  const [viewMode, setViewMode] = useState<"split" | "result" | "original">("split");

  const currentBg = activeBackdrop === "custom" ? customColor : activeBackdrop;

  return (
    <div className="space-y-6">
      {/* Control Header & Backdrop Picker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">
              Background Replacement & Controls
            </h4>
            <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
              <CheckmarkCircle02Icon className="size-3 mr-1" />
              Ready
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Select a solid studio backdrop or export as a transparent PNG.
          </p>
        </div>

        {/* View Mode Toggle */}
        <BgViewModeToggle viewMode={viewMode} onViewModeChange={setViewMode} />
      </div>

      {/* Preset Backdrops Pill Selector */}
      <BgBackdropPicker
        activeBackdrop={activeBackdrop}
        customColor={customColor}
        onBackdropChange={setActiveBackdrop}
        onCustomColorChange={setCustomColor}
      />

      {/* Visual Canvas Area */}
      <BgSplitViewer
        originalUrl={originalUrl}
        processedUrl={processedUrl}
        viewMode={viewMode}
        currentBg={currentBg}
        activeBackdrop={activeBackdrop}
      />

      {/* Action Download Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-xl border border-border bg-card">
        <div className="text-xs text-muted-foreground">
          Filename: <span className="font-mono text-foreground font-medium">{originalFileName}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <Button
            onClick={() => onDownload("image/png", currentBg)}
            disabled={isDownloading}
            className="w-full sm:w-auto gap-2"
          >
            <Download04Icon className="size-4" />
            Download {currentBg === "transparent" ? "Transparent PNG" : "Custom Backdrop Image"}
          </Button>

          {currentBg === "transparent" && (
            <Button
              variant="outline"
              onClick={() => onDownload("image/webp", "transparent")}
              disabled={isDownloading}
              className="w-full sm:w-auto text-xs"
            >
              Export WebP (Alpha)
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
