"use client";

import React from "react";
import { 
  Settings01Icon, 
  PaintBrush01Icon, 
  CropIcon,
  ColorsIcon,
  ViewIcon
} from "hugeicons-react";
import { RenderOptions } from "@/lib/image-engine/favicon-generator";

interface FaviconControlsProps {
  options: RenderOptions;
  appName: string;
  themeColor: string;
  previewUrl: string | null;
  onChangeOptions: (newOptions: Partial<RenderOptions>) => void;
  onChangeAppName: (name: string) => void;
  onChangeThemeColor: (color: string) => void;
  isGenerating: boolean;
}

export function FaviconControls({
  options,
  appName,
  themeColor,
  previewUrl,
  onChangeOptions,
  onChangeAppName,
  onChangeThemeColor,
  isGenerating,
}: FaviconControlsProps) {
  const bgPresetColors = [
    { label: "Transparent", value: "transparent" },
    { label: "White", value: "#ffffff" },
    { label: "Dark", value: "#0a0a0a" },
    { label: "Blue", value: "#0284c7" },
    { label: "Indigo", value: "#6366f1" },
    { label: "Emerald", value: "#10b981" },
  ];

  const radiusPresets = [
    { label: "Square", value: 0 },
    { label: "Subtle", value: 12 },
    { label: "Squircle", value: 24 },
    { label: "Smooth", value: 36 },
    { label: "Circle", value: 50 },
  ];

  return (
    <div className="border border-border rounded-xl p-5 bg-card/60 backdrop-blur-sm space-y-6">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Settings01Icon className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">Icon Customization & Layout</h3>
        </div>
        <div className="flex items-center gap-2">
          {isGenerating && (
            <span className="text-[11px] text-primary flex items-center gap-1 animate-pulse">
              <span className="size-1.5 rounded-full bg-primary" />
              Rendering...
            </span>
          )}
          <span className="text-[11px] text-muted-foreground">Live Canvas Processing</span>
        </div>
      </div>

      {/* Main Grid: Controls + Live Interactive Shape Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Side: Sliders & Color Picker (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Corner Radius Customizer with 1% Precision + Quick Presets */}
            <div className="space-y-3 sm:col-span-2">
              <div className="flex items-center justify-between">
                <label htmlFor="radius-range" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <PaintBrush01Icon className="size-3.5 text-primary" />
                  <span>Custom Corner Radius</span>
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={2}
                      value={options.borderRadiusPercent}
                      onKeyDown={(e) => {
                        // Allow navigation, delete, backspace, tab
                        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "Tab"];
                        if (allowedKeys.includes(e.key)) return;
                        // Reject anything that is not a digit 0-9
                        if (!/^[0-9]$/.test(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onPaste={(e) => {
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
                        if (pasted) {
                          const val = Math.min(50, Math.max(0, parseInt(pasted, 10)));
                          onChangeOptions({ borderRadiusPercent: val });
                        }
                      }}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/\D/g, "");
                        if (raw === "") {
                          onChangeOptions({ borderRadiusPercent: 0 });
                          return;
                        }
                        const num = parseInt(raw, 10);
                        const clamped = Math.min(50, Math.max(0, isNaN(num) ? 0 : num));
                        onChangeOptions({ borderRadiusPercent: clamped });
                      }}
                      className="w-12 h-6 text-xs font-mono text-center rounded border border-border bg-background focus:ring-1 focus:ring-primary focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-xs font-mono text-muted-foreground">%</span>
                  </div>
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                    {options.borderRadiusPercent === 0
                      ? "Square"
                      : options.borderRadiusPercent >= 50
                      ? "Full Circle"
                      : "Rounded Rect"}
                  </span>
                </div>
              </div>

              {/* Native Fluid 60fps Range Slider */}
              <input
                id="radius-range"
                type="range"
                min={0}
                max={50}
                step={1}
                value={options.borderRadiusPercent}
                onChange={(e) => {
                  onChangeOptions({ borderRadiusPercent: Number(e.target.value) });
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />

              {/* Quick Preset Buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-muted-foreground mr-1">Presets:</span>
                {radiusPresets.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => onChangeOptions({ borderRadiusPercent: preset.value })}
                    className={`px-2.5 py-0.5 text-[11px] rounded-md border transition-all cursor-pointer ${
                      options.borderRadiusPercent === preset.value
                        ? "bg-primary text-primary-foreground border-primary font-medium shadow-xs"
                        : "bg-secondary/60 border-border text-muted-foreground hover:text-foreground hover:bg-secondary"
                    }`}
                  >
                    {preset.label} ({preset.value}%)
                  </button>
                ))}
              </div>
            </div>

            {/* Inset Padding / Safe Area Slider */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label htmlFor="padding-range" className="text-xs font-medium text-foreground flex items-center gap-1.5">
                  <CropIcon className="size-3.5 text-muted-foreground" />
                  <span>Inner Safe Padding</span>
                </label>
                <span className="text-xs font-mono font-medium text-primary">
                  {options.paddingPercent}%
                </span>
              </div>
              <input
                id="padding-range"
                type="range"
                min={0}
                max={35}
                step={1}
                value={options.paddingPercent}
                onChange={(e) => {
                  onChangeOptions({ paddingPercent: Number(e.target.value) });
                }}
                className="w-full h-1.5 bg-muted rounded-lg appearance-none cursor-pointer accent-primary focus:outline-none"
              />
              <p className="text-[11px] text-muted-foreground">
                Prevents icons from touching circular borders.
              </p>
            </div>

            {/* Background Color Fill */}
            <div className="space-y-3">
              <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                <ColorsIcon className="size-3.5 text-muted-foreground" />
                <span>Background Fill</span>
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {bgPresetColors.map((color) => {
                  const isSelected = options.backgroundColor === color.value;
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => onChangeOptions({ backgroundColor: color.value })}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs rounded-md border transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/10 text-primary font-semibold ring-1 ring-primary/40"
                          : "border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className="inline-block w-3 h-3 min-w-[12px] min-h-[12px] shrink-0 rounded-full border border-border/80 shadow-xs"
                        style={
                          color.value === "transparent"
                            ? {
                                background:
                                  "repeating-conic-gradient(#888 0% 25%, #222 0% 50%) 50% / 6px 6px",
                              }
                            : { backgroundColor: color.value }
                        }
                      />
                      <span className="leading-none">{color.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Live Interactive Radius Preview Box (4 cols) */}
        <div className="lg:col-span-4 border border-border rounded-xl p-4 bg-secondary/30 flex flex-col items-center justify-center text-center">
          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground mb-3 self-start">
            <ViewIcon className="size-3.5 text-primary" />
            <span>Real-Time Shape Preview</span>
          </div>

          {/* Masked Preview Canvas Simulation */}
          <div className="relative size-32 rounded-lg border border-border bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:10px_10px] dark:bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] flex items-center justify-center shadow-inner overflow-hidden p-2">
            <div
              className="w-full h-full flex items-center justify-center transition-[border-radius,background-color] duration-75 overflow-hidden shadow-sm"
              style={{
                borderRadius: `${options.borderRadiusPercent}%`,
                backgroundColor: options.backgroundColor !== "transparent" ? options.backgroundColor : "transparent",
                padding: `${options.paddingPercent}%`,
              }}
            >
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Radius Preview"
                  className="w-full h-full object-contain pointer-events-none select-none"
                />
              )}
            </div>
          </div>

          <div className="mt-3 flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">
              Radius: {options.borderRadiusPercent}% ({Math.round((options.borderRadiusPercent / 50) * 100)}% of circle)
            </span>
          </div>
        </div>
      </div>

      {/* Web Manifest and PWA Meta Parameters */}
      <div className="border-t border-border pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">
            Application Title (site.webmanifest)
          </label>
          <input
            type="text"
            value={appName}
            onChange={(e) => onChangeAppName(e.target.value)}
            placeholder="My Web App"
            className="w-full h-8 text-xs px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1">
            Theme & Tile Hex Color
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={themeColor}
              onChange={(e) => onChangeThemeColor(e.target.value)}
              className="size-8 rounded border border-border cursor-pointer bg-background p-0.5"
            />
            <input
              type="text"
              value={themeColor}
              onChange={(e) => onChangeThemeColor(e.target.value)}
              className="flex-1 h-8 text-xs font-mono px-3 rounded-md border border-border bg-background focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
