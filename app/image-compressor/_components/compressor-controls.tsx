"use client";

import React from "react";
import {
  SlidersHorizontalIcon,
} from "hugeicons-react";
import { CompressionOptions } from "@/lib/image-engine/image-compressor";
import { Badge } from "@/components/ui/badge";

interface CompressorControlsProps {
  options: CompressionOptions;
  setOptions: React.Dispatch<React.SetStateAction<CompressionOptions>>;
  disabled?: boolean;
}

export function CompressorControls({
  options,
  setOptions,
  disabled,
}: CompressorControlsProps) {
  const qualityPercentage = Math.round(options.quality * 100);

  const presets = [
    { label: "High Compression", quality: 0.65, desc: "Great for fast web (70-80% smaller)" },
    { label: "Balanced (Recommended)", quality: 0.82, desc: "Visually identical (top-notch)" },
    { label: "Ultra Crisp / Near Lossless", quality: 0.95, desc: "Professional grade clarity" },
  ];

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Compression & Output Settings
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-[11px] font-normal border-primary/20 text-primary bg-primary/5">
            Bicubic Interpolation
          </Badge>
          <Badge variant="outline" className="text-[11px] font-normal border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
            Zero Quality Loss
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Quality Slider Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-semibold text-foreground">
                Output Image Quality
              </label>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Set exactly how crisp you want your image (1% precision)
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
              {qualityPercentage}%
            </span>
          </div>

          <input
            type="range"
            min="10"
            max="100"
            step="1"
            value={qualityPercentage}
            disabled={disabled}
            onChange={(e) => {
              const val = Number(e.target.value) / 100;
              setOptions((prev) => ({ ...prev, quality: val }));
            }}
            className="w-full accent-primary h-2 bg-muted rounded-lg appearance-none cursor-pointer disabled:opacity-50"
          />

          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span>Aggressive (10%)</span>
            <span>Recommended (80-85%)</span>
            <span>100% (Original Clarity)</span>
          </div>

          {/* Quick presets */}
          <div className="grid grid-cols-3 gap-1.5 pt-1">
            {presets.map((preset) => {
              const isSelected = Math.abs(options.quality - preset.quality) < 0.02;
              return (
                <button
                  key={preset.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => setOptions((prev) => ({ ...prev, quality: preset.quality }))}
                  className={`p-2 rounded-lg text-left border text-xs transition-all cursor-pointer ${isSelected
                      ? "border-primary bg-primary/10 text-foreground font-semibold"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                    }`}
                >
                  <div className="truncate text-[11px] font-medium">{preset.label}</div>
                  <div className="text-[10px] text-muted-foreground opacity-80">{Math.round(preset.quality * 100)}%</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Output Format & Resize Options */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Output Format
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "original", label: "Auto / Keep Original" },
                { value: "image/webp", label: "Convert to WebP" },
                { value: "image/jpeg", label: "Convert to JPG" },
              ].map((fmt) => (
                <button
                  key={fmt.value}
                  type="button"
                  disabled={disabled}
                  onClick={() =>
                    setOptions((prev) => ({
                      ...prev,
                      format: fmt.value as CompressionOptions["format"],
                    }))
                  }
                  className={`p-2 rounded-lg text-center border text-xs transition-all cursor-pointer ${options.format === fmt.value
                      ? "border-primary bg-primary/10 text-foreground font-semibold"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                    }`}
                >
                  {fmt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-2">
              Max Width Constraint
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: undefined, label: "Original" },
                { value: 2560, label: "2K (2560)" },
                { value: 1920, label: "FHD (1920)" },
                { value: 1280, label: "HD (1280)" },
              ].map((res) => (
                <button
                  key={res.label}
                  type="button"
                  disabled={disabled}
                  onClick={() => setOptions((prev) => ({ ...prev, maxWidth: res.value }))}
                  className={`py-1.5 px-2 rounded-lg text-center border text-xs transition-all cursor-pointer ${options.maxWidth === res.value
                      ? "border-primary bg-primary/10 text-foreground font-semibold"
                      : "border-border/60 bg-muted/20 text-muted-foreground hover:bg-muted/50"
                    }`}
                >
                  {res.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
