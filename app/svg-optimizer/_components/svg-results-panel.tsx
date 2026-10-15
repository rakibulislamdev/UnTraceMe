"use client";

import React, { useState } from "react";
import {
  Download04Icon,
  CheckmarkCircle02Icon,
  Copy01Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { SvgOptimizeResult } from "@/lib/image-engine/svg-optimizer";
import { formatBytes } from "@/lib/image-engine/image-converter";

interface SvgResultsPanelProps {
  result: SvgOptimizeResult;
  previewBg: "checkered" | "light" | "dark";
  onDownload: () => void;
}

export function SvgResultsPanel({
  result,
  previewBg,
  onDownload,
}: SvgResultsPanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyMarkup = async () => {
    try {
      await navigator.clipboard.writeText(result.cleanedSvgText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4 animate-in fade-in duration-300">
      {/* Header Stat Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 items-center justify-center">
              <CheckmarkCircle02Icon className="size-3.5" />
            </span>
            <h3 className="text-sm font-semibold text-foreground">
              Optimization Complete ({result.savedPercentage}% Smaller)
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            Reduced from {formatBytes(result.originalSize)} to {formatBytes(result.optimizedSize)} • {result.removedElementsCount} nodes stripped
          </p>
        </div>

        <Button
          onClick={onDownload}
          size="sm"
          className="cursor-pointer font-medium shadow-xs"
        >
          <Download04Icon className="size-4 mr-1.5" />
          Download Clean SVG
        </Button>
      </div>

      {/* Side-by-side Visual Inspection & Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Visual Vector Rendering */}
        <div
          className={`rounded-xl border border-border p-4 flex flex-col items-center justify-center min-h-[220px] relative overflow-hidden transition-colors duration-200 ${
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
          <span className="absolute top-2.5 left-2.5 text-[10px] font-mono px-2 py-0.5 rounded-md bg-background/90 text-primary border border-primary/20 font-semibold z-20 shadow-xs">
            Cleaned Vector Output
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={result.previewUrl}
            alt="Optimized SVG vector"
            className="max-h-44 max-w-full object-contain p-2 relative z-10"
          />
        </div>

        {/* Minified Code Box with Copy */}
        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-foreground">Minified SVG Markup</span>
              <span className="text-[10px] text-muted-foreground font-mono">
                ({result.cleanedSvgText.length} chars)
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyMarkup}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border border-border bg-card hover:bg-muted text-foreground transition-all cursor-pointer shadow-xs active:scale-95"
            >
              {copied ? (
                <>
                  <CheckmarkCircle02Icon className="size-3.5 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">Copied!</span>
                </>
              ) : (
                <>
                  <Copy01Icon className="size-3.5 text-muted-foreground" />
                  <span>Copy SVG</span>
                </>
              )}
            </button>
          </div>
          <pre className="h-[220px] overflow-y-auto p-3.5 rounded-xl bg-muted/40 border border-border text-[11px] font-mono text-muted-foreground leading-relaxed select-all whitespace-pre-wrap break-all [scrollbar-width:thin]">
            {result.cleanedSvgText}
          </pre>
        </div>
      </div>
    </div>
  );
}
