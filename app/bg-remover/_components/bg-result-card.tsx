"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Download04Icon, 
  Upload04Icon, 
  Image01Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";

interface BgResultCardProps {
  originalUrl: string;
  processedUrl: string;
  originalFileName: string;
  onDownload: (bgColor: string) => void;
  onReset: () => void;
}

const PRESET_COLORS = [
  { label: "Transparent", value: "transparent" },
  { label: "White", value: "#ffffff" },
  { label: "Light Gray", value: "#f3f4f6" },
  { label: "Black", value: "#000000" },
  { label: "Blue", value: "#3b82f6" },
  { label: "Green", value: "#10b981" },
  { label: "Rose", value: "#f43f5e" },
  { label: "Amber", value: "#f59e0b" },
];

export function BgResultCard({
  originalUrl,
  processedUrl,
  originalFileName,
  onDownload,
  onReset,
}: BgResultCardProps) {
  const [selectedColor, setSelectedColor] = useState<string>("transparent");
  const [customColor, setCustomColor] = useState<string>("#3b82f6");
  const [viewTab, setViewTab] = useState<"result" | "original">("result");

  const activeColor = selectedColor === "custom" ? customColor : selectedColor;

  return (
    <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-xs space-y-6">
      {/* 1. Clean Natural Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
              <Image01Icon className="size-4" />
            </div>
            <div>
              <h2 className="text-sm font-medium text-foreground truncate max-w-sm sm:max-w-md">
                {originalFileName}
              </h2>
              <p className="text-xs text-muted-foreground">
                Cutout ready • PNG
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={onReset}
            className="cursor-pointer font-medium text-xs gap-1.5 h-9 px-3"
          >
            <Upload04Icon className="size-3.5" />
            Upload Another
          </Button>

          <Button
            size="sm"
            onClick={() => onDownload(activeColor)}
            className="cursor-pointer font-medium text-xs gap-1.5 h-9 px-4 shadow-xs"
          >
            <Download04Icon className="size-3.5" />
            Download
          </Button>
        </div>
      </div>

      {/* 2. Main Studio Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Left / Center: Interactive Preview Canvas */}
        <div className="lg:col-span-3 space-y-3">
          {/* View Tab Toggle */}
          <div className="flex items-center justify-between">
            <div className="inline-flex items-center p-1 rounded-full bg-secondary/80 border border-border/60 shadow-inner backdrop-blur-md">
              {(
                [
                  { id: "result", label: "Cutout" },
                  { id: "original", label: "Original" },
                ] as const
              ).map((tab) => {
                const isActive = viewTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewTab(tab.id)}
                    className={`relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-colors duration-200 select-none cursor-pointer ${
                      isActive
                        ? "text-primary-foreground font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="bg-result-view-tab-indicator"
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

            <span className="text-xs text-muted-foreground">
              {viewTab === "result" ? "Background Removed" : "Original Photo"}
            </span>
          </div>

          {/* Canvas Box */}
          <div className="relative w-full h-[420px] sm:h-[480px] rounded-xl border border-border overflow-hidden select-none bg-muted/30 flex items-center justify-center p-3 sm:p-5">
            {/* Image Frame: Fits the exact size of the photo, eliminating any floating gap */}
            <div className="relative max-h-full max-w-full rounded-lg overflow-hidden shadow-sm flex items-center justify-center">
              {/* Checkerboard transparency grid strictly inside the photo's bounds */}
              <div
                className="absolute inset-0 pointer-events-none opacity-25"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #888 25%, transparent 25%),
                    linear-gradient(-45deg, #888 25%, transparent 25%),
                    linear-gradient(45deg, transparent 75%, #888 75%),
                    linear-gradient(-45deg, transparent 75%, #888 75%)
                  `,
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                }}
              />

              {/* Solid background fill strictly inside the photo's bounds */}
              {viewTab === "result" && activeColor !== "transparent" && (
                <div
                  className="absolute inset-0 transition-colors duration-150"
                  style={{ backgroundColor: activeColor }}
                />
              )}

              {/* Displayed Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={viewTab === "result" ? processedUrl : originalUrl}
                alt={viewTab === "result" ? "Cutout Preview" : "Original Image"}
                className="relative max-h-[380px] sm:max-h-[440px] w-auto max-w-full object-contain select-none block"
              />
            </div>
          </div>
        </div>

        {/* Right Sidebar: Simple Color Controls */}
        <div className="lg:col-span-1 rounded-xl border border-border bg-card p-4 space-y-4">
          <div className="space-y-0.5">
            <h3 className="text-xs font-medium text-foreground">
              Background
            </h3>
            <p className="text-[11px] text-muted-foreground">
              {selectedColor === "transparent" ? "Transparent" : activeColor}
            </p>
          </div>

          {/* Preset Swatches Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1">
            {PRESET_COLORS.map((c) => {
              const isTransparent = c.value === "transparent";
              const isSelected = selectedColor === c.value;

              return (
                <button
                  key={c.label}
                  type="button"
                  onClick={() => setSelectedColor(c.value)}
                  title={c.label}
                  className={`cursor-pointer relative aspect-square rounded-lg border transition-all flex items-center justify-center overflow-hidden ${
                    isSelected
                      ? "ring-2 ring-primary ring-offset-2 ring-offset-background border-primary"
                      : "border-border hover:border-foreground/40 hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: isTransparent ? "transparent" : c.value,
                  }}
                >
                  {isTransparent && (
                    <div
                      className="size-full opacity-60 pointer-events-none"
                      style={{
                        backgroundImage: `
                          linear-gradient(45deg, #888 25%, transparent 25%),
                          linear-gradient(-45deg, #888 25%, transparent 25%),
                          linear-gradient(45deg, transparent 75%, #888 75%),
                          linear-gradient(-45deg, transparent 75%, #888 75%)
                        `,
                        backgroundSize: "6px 6px",
                        backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                      }}
                    />
                  )}
                  {isSelected && (
                    <span
                      className={`size-1.5 rounded-full pointer-events-none ${
                        c.value === "#ffffff" || isTransparent ? "bg-black" : "bg-white"
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Custom Color Input */}
          <div className="space-y-1.5 pt-2 border-t border-border">
            <label className="text-[11px] font-medium text-muted-foreground">
              Custom color
            </label>
            <div className="flex items-center gap-2">
              <label
                title="Pick color"
                className="cursor-pointer size-8 rounded-lg border border-border relative overflow-hidden shrink-0 shadow-xs hover:border-foreground/40"
                style={{ backgroundColor: customColor }}
              >
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => {
                    setCustomColor(e.target.value);
                    setSelectedColor("custom");
                  }}
                  className="cursor-pointer opacity-0 absolute inset-0 size-full"
                />
              </label>
              <input
                type="text"
                value={selectedColor === "custom" ? customColor : activeColor}
                onChange={(e) => {
                  setCustomColor(e.target.value);
                  setSelectedColor("custom");
                }}
                placeholder="#000000"
                className="flex-1 h-8 rounded-lg border border-border bg-background px-2.5 text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Download button in sidebar */}
          <div className="pt-2 border-t border-border">
            <Button
              onClick={() => onDownload(activeColor)}
              className="cursor-pointer w-full text-xs font-medium gap-1.5 h-9 shadow-xs"
            >
              <Download04Icon className="size-3.5" />
              Download Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
