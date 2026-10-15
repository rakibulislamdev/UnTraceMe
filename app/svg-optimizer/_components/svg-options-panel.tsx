"use client";

import React, { useRef } from "react";
import {
  ImageCompositionIcon,
  Delete02Icon,
  SparklesIcon,
  Loading03Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SvgOptimizerOptions } from "@/lib/image-engine/svg-optimizer";
import { formatBytes } from "@/lib/image-engine/image-converter";

interface SvgOptionsPanelProps {
  file: File;
  options: SvgOptimizerOptions;
  setOptions: React.Dispatch<React.SetStateAction<SvgOptimizerOptions>>;
  previewBg: "checkered" | "light" | "dark";
  setPreviewBg: (bg: "checkered" | "light" | "dark") => void;
  onOptimize: () => void;
  onClear: () => void;
  onChangeFile: () => void;
  isProcessing: boolean;
}

export function SvgOptionsPanel({
  file,
  options,
  setOptions,
  previewBg,
  setPreviewBg,
  onOptimize,
  onClear,
  onChangeFile,
  isProcessing,
}: SvgOptionsPanelProps) {
  const previewUrl = URL.createObjectURL(file);

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2 min-w-0">
          <ImageCompositionIcon className="size-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground truncate">
            {file.name}
          </span>
          <Badge variant="outline" className="text-[10px] font-mono">
            {formatBytes(file.size)}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onChangeFile}
            disabled={isProcessing}
            className="h-7 text-xs cursor-pointer"
          >
            Change
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            disabled={isProcessing}
            className="h-7 text-xs text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
          >
            <Delete02Icon className="size-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Visual SVG Inspection & Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
        {/* Visual SVG Thumbnail / Canvas Box */}
        <div
          className={`rounded-xl border border-border/80 p-3 flex flex-col items-center justify-center relative min-h-[170px] overflow-hidden group transition-colors duration-200 ${
            previewBg === "light"
              ? "bg-slate-100 text-slate-900 border-slate-300"
              : previewBg === "dark"
              ? "bg-zinc-950 text-white border-zinc-800"
              : "bg-muted/40"
          }`}
          style={
            previewBg === "checkered"
              ? {
                  backgroundImage:
                    "linear-gradient(45deg, rgba(120,120,120,0.12) 25%, transparent 25%), linear-gradient(-45deg, rgba(120,120,120,0.12) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, rgba(120,120,120,0.12) 75%), linear-gradient(-45deg, transparent 75%, rgba(120,120,120,0.12) 75%)",
                  backgroundSize: "16px 16px",
                  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0px",
                }
              : undefined
          }
        >
          <div className="absolute top-2 left-2 flex items-center gap-1 z-20">
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-background/90 border border-border text-muted-foreground uppercase shadow-xs">
              Vector Preview
            </span>
          </div>

          {/* Background Theme Switcher */}
          <div className="absolute top-2 right-2 flex items-center gap-1 z-20 bg-background/85 backdrop-blur-xs p-0.5 rounded-md border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setPreviewBg("checkered")}
              className={`size-5 rounded flex items-center justify-center text-[9px] font-bold cursor-pointer transition-colors ${
                previewBg === "checkered"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Checkered transparency"
            >
              ▦
            </button>
            <button
              type="button"
              onClick={() => setPreviewBg("light")}
              className={`size-5 rounded flex items-center justify-center text-[9px] font-bold cursor-pointer transition-colors ${
                previewBg === "light"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Light canvas"
            >
              ☼
            </button>
            <button
              type="button"
              onClick={() => setPreviewBg("dark")}
              className={`size-5 rounded flex items-center justify-center text-[9px] font-bold cursor-pointer transition-colors ${
                previewBg === "dark"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="Dark canvas"
            >
              ☾
            </button>
          </div>

          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt="SVG Source Preview"
            className="max-h-36 max-w-full object-contain p-2 relative z-10 transition-transform group-hover:scale-105"
            onLoad={() => URL.revokeObjectURL(previewUrl)}
          />
        </div>

        {/* Options Toggles (2 Columns) */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <label className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 text-xs cursor-pointer hover:bg-muted/40">
            <input
              type="checkbox"
              checked={options.stripComments}
              disabled={isProcessing}
              onChange={(e) =>
                setOptions((p) => ({ ...p, stripComments: e.target.checked }))
              }
              className="rounded accent-primary size-4"
            />
            <span className="text-foreground font-medium">Strip XML Comments</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 text-xs cursor-pointer hover:bg-muted/40">
            <input
              type="checkbox"
              checked={options.stripMetadata}
              disabled={isProcessing}
              onChange={(e) =>
                setOptions((p) => ({ ...p, stripMetadata: e.target.checked }))
              }
              className="rounded accent-primary size-4"
            />
            <span className="text-foreground font-medium">Remove Metadata Tags</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 text-xs cursor-pointer hover:bg-muted/40">
            <input
              type="checkbox"
              checked={options.stripEditorNamespaces}
              disabled={isProcessing}
              onChange={(e) =>
                setOptions((p) => ({ ...p, stripEditorNamespaces: e.target.checked }))
              }
              className="rounded accent-primary size-4"
            />
            <span className="text-foreground font-medium">Remove Illustrator / Inkscape Data</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 text-xs cursor-pointer hover:bg-muted/40">
            <input
              type="checkbox"
              checked={options.removeHiddenElements}
              disabled={isProcessing}
              onChange={(e) =>
                setOptions((p) => ({ ...p, removeHiddenElements: e.target.checked }))
              }
              className="rounded accent-primary size-4"
            />
            <span className="text-foreground font-medium">Remove Hidden Nodes</span>
          </label>

          <label className="flex items-center gap-2 p-2 rounded-lg border border-border bg-muted/20 text-xs cursor-pointer hover:bg-muted/40">
            <input
              type="checkbox"
              checked={options.collapseWhitespace}
              disabled={isProcessing}
              onChange={(e) =>
                setOptions((p) => ({ ...p, collapseWhitespace: e.target.checked }))
              }
              className="rounded accent-primary size-4"
            />
            <span className="text-foreground font-medium">Minify Whitespace</span>
          </label>

          <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/20 text-xs">
            <span className="text-foreground font-medium">Coordinate Precision:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3].map((prec) => (
                <button
                  key={prec}
                  type="button"
                  disabled={isProcessing}
                  onClick={() => setOptions((p) => ({ ...p, precision: prec }))}
                  className={`px-2 py-0.5 rounded text-[11px] font-mono cursor-pointer ${
                    options.precision === prec
                      ? "bg-primary text-primary-foreground font-bold"
                      : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {prec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-2 flex justify-end">
        <Button
          onClick={onOptimize}
          disabled={isProcessing}
          className="cursor-pointer font-medium shadow-xs"
        >
          {isProcessing ? (
            <>
              <Loading03Icon className="size-4 mr-2 animate-spin" />
              Optimizing SVG...
            </>
          ) : (
            <>
              <SparklesIcon className="size-4 mr-2" />
              Optimize SVG Document
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
