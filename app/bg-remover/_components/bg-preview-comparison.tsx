"use client";

import { useState } from "react";
import { Download04Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export type BgBackdropType = "transparent" | "white" | "black" | "custom";

interface BgPreviewComparisonProps {
  originalUrl: string;
  processedUrl: string;
  originalFileName: string;
  onDownload: (format: "image/png" | "image/webp" | "image/jpeg", bgColor?: string) => void;
  isDownloading?: boolean;
}

const PRESET_COLORS = [
  { name: "Transparent", value: "transparent" },
  { name: "Pure White", value: "#ffffff" },
  { name: "Studio Black", value: "#000000" },
  { name: "Light Gray", value: "#f3f4f6" },
  { name: "Sky Blue", value: "#38bdf8" },
  { name: "Emerald", value: "#10b981" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Rose", value: "#f43f5e" },
];

export function BgPreviewComparison({
  originalUrl,
  processedUrl,
  originalFileName,
  onDownload,
  isDownloading,
}: BgPreviewComparisonProps) {
  const [sliderPosition, setSliderPosition] = useState(50);
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
              AI Mask Ready
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            Select a solid studio backdrop or export as a transparent PNG.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-1 bg-secondary p-1 rounded-lg self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "split"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Split View
          </button>
          <button
            type="button"
            onClick={() => setViewMode("result")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "result"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Cutout Only
          </button>
          <button
            type="button"
            onClick={() => setViewMode("original")}
            className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
              viewMode === "original"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Original
          </button>
        </div>
      </div>

      {/* Preset Backdrops Pill Selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-muted-foreground mr-1">Backdrop:</span>
        {PRESET_COLORS.map((color) => {
          const isSelected = activeBackdrop === color.value;
          return (
            <button
              key={color.name}
              type="button"
              onClick={() => setActiveBackdrop(color.value)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border transition-all ${
                isSelected
                  ? "border-primary bg-primary/10 text-primary font-semibold shadow-xs"
                  : "border-border bg-card hover:bg-secondary text-foreground"
              }`}
            >
              {color.value === "transparent" ? (
                <span className="size-3 rounded-full border border-border bg-[conic-gradient(#cbd5e1_90deg,#ffffff_90deg_180deg,#cbd5e1_180deg_270deg,#ffffff_270deg)] dark:bg-[conic-gradient(#475569_90deg,#1e293b_90deg_180deg,#475569_180deg_270deg,#1e293b_270deg)]" />
              ) : (
                <span
                  className="size-3 rounded-full border border-border/60"
                  style={{ backgroundColor: color.value }}
                />
              )}
              <span>{color.name}</span>
            </button>
          );
        })}

        {/* Custom Color Picker */}
        <label className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full border cursor-pointer transition-all ${
          activeBackdrop === "custom"
            ? "border-primary bg-primary/10 text-primary font-semibold"
            : "border-border bg-card hover:bg-secondary text-foreground"
        }`}>
          <span
            className="size-3 rounded-full border border-border/60"
            style={{ backgroundColor: customColor }}
          />
          <span>Custom</span>
          <input
            type="color"
            value={customColor}
            onChange={(e) => {
              setCustomColor(e.target.value);
              setActiveBackdrop("custom");
            }}
            className="sr-only"
          />
        </label>
      </div>

      {/* Visual Canvas Area */}
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
