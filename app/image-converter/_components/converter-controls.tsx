"use client";

import React from "react";
import {
  SlidersHorizontalIcon,
  Exchange01Icon,
  SparklesIcon,
  InformationCircleIcon,
} from "hugeicons-react";
import {
  ConversionOptions,
  SUPPORTED_TARGET_FORMATS,
  TargetImageFormat,
} from "@/lib/image-engine/image-converter";
import { Badge } from "@/components/ui/badge";

interface ConverterControlsProps {
  options: ConversionOptions;
  setOptions: React.Dispatch<React.SetStateAction<ConversionOptions>>;
  disabled?: boolean;
}

export function ConverterControls({
  options,
  setOptions,
  disabled,
}: ConverterControlsProps) {
  const currentFormatDef =
    SUPPORTED_TARGET_FORMATS.find((f) => f.id === options.targetFormat) ||
    SUPPORTED_TARGET_FORMATS[0];

  const qualityPercentage = Math.round(options.quality * 100);

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-border gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontalIcon className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            Target Format & Encoding Settings
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className="text-[11px] font-normal border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
          >
            High-Fidelity Canvas 2D
          </Badge>
        </div>
      </div>

      {/* Target Format Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
            <Exchange01Icon className="size-3.5 text-primary" />
            <span>Select Target Format</span>
          </label>
          <span className="text-[11px] text-muted-foreground">
            All images will be converted to this format
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
          {SUPPORTED_TARGET_FORMATS.map((fmt) => {
            const isSelected = options.targetFormat === fmt.id;
            return (
              <button
                key={fmt.id}
                type="button"
                disabled={disabled}
                onClick={() =>
                  setOptions((prev) => ({
                    ...prev,
                    targetFormat: fmt.id as TargetImageFormat,
                  }))
                }
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer relative flex flex-col justify-between min-h-[92px] ${
                  isSelected
                    ? "border-primary bg-primary/10 shadow-xs ring-1 ring-primary"
                    : "border-border/60 bg-muted/20 hover:border-primary/40 hover:bg-muted/40"
                } ${disabled ? "opacity-50 pointer-events-none" : ""}`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-foreground">
                      {fmt.label}
                    </span>
                    <Badge
                      variant={isSelected ? "default" : "outline"}
                      className={`text-[9px] px-1.5 py-0 font-medium ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground border-border/80"
                      }`}
                    >
                      {fmt.badge}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 leading-snug">
                    {fmt.description}
                  </p>
                </div>

                <div className="text-[9px] font-mono text-muted-foreground/80 mt-1">
                  .{fmt.extension}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 border-t border-border/50">
        {/* Quality Controls (if format supports lossy/variable quality) */}
        {currentFormatDef.supportsQuality ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-xs font-semibold text-foreground">
                  Encoding Quality ({currentFormatDef.label})
                </label>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Fine-tune output sharpness vs compression
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                {qualityPercentage}%
              </span>
            </div>

            <input
              type="range"
              min="15"
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
              <span>Compressed (60%)</span>
              <span>Recommended (85%)</span>
              <span>Near Lossless (98%)</span>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border/60 bg-muted/20 p-3.5 flex flex-col justify-center space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-foreground">
                Lossless Compression Active
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-primary/10 text-primary border border-primary/20">
                Pixel-Exact
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              {currentFormatDef.label} operates with bit-exact lossless compression. Every pixel is preserved identically without visual artifacts.
            </p>
            {options.targetFormat === "image/png" && (
              <div className="mt-1 pt-1.5 border-t border-border/40 text-[10px] text-muted-foreground flex items-center gap-1.5">
                <span className="text-amber-500 font-semibold">Standard Practice:</span>
                <span>Converting high-res photos to PNG increases file size because PNG is uncompressed for raster graphics. For smaller photo file sizes with zero quality loss, select <strong>WebP</strong>.</span>
              </div>
            )}
          </div>
        )}

        {/* Dimension & Background Options */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground">
            Optional Canvas Tuning
          </label>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Max Width (px)
              </label>
              <input
                type="number"
                placeholder="e.g. 1920 (optional)"
                disabled={disabled}
                value={options.maxWidth || ""}
                onChange={(e) => {
                  const val = e.target.value ? parseInt(e.target.value, 10) : undefined;
                  setOptions((prev) => ({ ...prev, maxWidth: val }));
                }}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-border bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary font-mono placeholder:text-muted-foreground/60"
              />
            </div>

            <div>
              <label className="text-[11px] text-muted-foreground block mb-1">
                Background for Non-Alpha
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={options.backgroundColor}
                  disabled={disabled || currentFormatDef.supportsTransparency}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, backgroundColor: e.target.value }))
                  }
                  className="size-8 rounded border border-border bg-transparent cursor-pointer disabled:opacity-40"
                />
                <span className="text-xs font-mono text-muted-foreground uppercase">
                  {options.backgroundColor}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 text-[11px] text-muted-foreground">
            <InformationCircleIcon className="size-3.5 text-primary shrink-0" />
            <span>
              {currentFormatDef.supportsTransparency
                ? `${currentFormatDef.label} supports full transparent backgrounds.`
                : `Transparency will be filled with ${options.backgroundColor} on ${currentFormatDef.label}.`}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
