"use client";

import React, { useState } from "react";
import { Copy01Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExtractedColor } from "@/lib/image-engine/palette-extractor";
import { cn } from "@/lib/utils";

interface PaletteSwatchesProps {
  colors: ExtractedColor[];
}

export function PaletteSwatches({ colors }: PaletteSwatchesProps) {
  const [copiedHex, setCopiedHex] = useState<string | null>(null);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 1600);
  };

  return (
    <Card className="p-6 rounded-xl border border-border bg-card space-y-4">
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
          HARMONIC PALETTE SWATCHES ({colors.length})
        </span>
        <span className="text-xs text-muted-foreground">Click hex to copy</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {colors.map((color, idx) => (
          <div
            key={idx}
            onClick={() => handleCopy(color.hex)}
            className="group rounded-lg border border-border/70 bg-[#0f1011] hover:bg-[#141516] hover:border-border transition-all duration-150 p-2.5 flex flex-col justify-between cursor-pointer select-none active:scale-[0.98]"
          >
            {/* Swatch Window */}
            <div
              className="w-full h-16 rounded-md border border-white/5 relative flex items-center justify-center overflow-hidden transition-transform group-hover:scale-[1.01]"
              style={{ backgroundColor: color.hex }}
            >
              {copiedHex === color.hex && (
                <div className="bg-[#010102]/90 backdrop-blur-md text-foreground text-[10px] font-mono font-medium px-2.5 py-1 rounded-full border border-border flex items-center gap-1.5 shadow-md">
                  <CheckmarkCircle02Icon className="size-3 text-[#27a644]" />
                  <span>COPIED</span>
                </div>
              )}
            </div>

            {/* Spec Row */}
            <div className="mt-3 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-semibold text-foreground tracking-tight">
                  {color.hex.toUpperCase()}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground bg-secondary px-1.5 py-0.5 rounded border border-border/50">
                  {color.population}%
                </span>
              </div>

              <div className="flex items-center justify-between gap-1 text-[10px] font-mono text-muted-foreground pt-1.5 border-t border-border/40">
                <span className="uppercase text-primary font-medium tracking-tight truncate">
                  {color.role}
                </span>
                <span className="text-[10px] text-muted-foreground shrink-0 whitespace-nowrap">
                  {color.isDark ? `${color.contrastOnWhite}:1` : `${color.contrastOnBlack}:1`}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

