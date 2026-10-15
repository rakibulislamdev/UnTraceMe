"use client";

import React from "react";
import {
  RotateRight01Icon,
  Maximize01Icon,
  Pdf01Icon,
} from "hugeicons-react";
import { PageMeta } from "./types";

interface PdfPageCardProps {
  page: PageMeta;
  index: number;
  thumbnailUrl?: string;
  onToggleSelect: (index: number) => void;
  onRotatePage: (index: number) => void;
  onOpenPreview: (pageNumber: number) => void;
}

export function PdfPageCard({
  page,
  index,
  thumbnailUrl,
  onToggleSelect,
  onRotatePage,
  onOpenPreview,
}: PdfPageCardProps) {
  return (
    <div
      onClick={() => onToggleSelect(index)}
      className={`group relative rounded-xl border p-3 flex flex-col items-center justify-between transition-all cursor-pointer ${
        page.isSelected
          ? "border-primary bg-primary/5 shadow-xs ring-1 ring-primary/40"
          : "border-border/60 bg-muted/20 opacity-60 hover:opacity-85"
      }`}
    >
      {/* Header: Page Badge & Checkbox */}
      <div className="w-full flex items-center justify-between text-[11px] mb-2 font-mono">
        <span className="font-bold text-foreground">Page {page.pageNumber}</span>
        <input
          type="checkbox"
          checked={page.isSelected}
          onChange={() => {}}
          className="size-4 rounded accent-primary pointer-events-none cursor-pointer"
        />
      </div>

      {/* Main Large Visual Document Preview Card */}
      <div className="relative w-full aspect-[3/4] max-w-[150px] bg-white rounded-md border border-border/80 shadow-xs flex items-center justify-center overflow-hidden my-1">
        <div
          className="w-full h-full flex items-center justify-center transition-transform duration-200"
          style={{ transform: `rotate(${page.rotation}deg)` }}
        >
          {thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={thumbnailUrl}
              alt={`Page ${page.pageNumber}`}
              className="w-full h-full object-contain pointer-events-none select-none bg-white"
              loading="lazy"
            />
          ) : (
            <div className="size-full flex flex-col justify-between p-2.5 bg-white select-none">
              <div className="flex items-center justify-between opacity-50">
                <Pdf01Icon className="size-3.5 text-primary" />
                <span className="text-[9px] font-mono font-bold text-slate-700">
                  p.{page.pageNumber}
                </span>
              </div>
              <div className="space-y-1.5 my-auto px-1 opacity-25">
                <div className="h-1 bg-slate-800 rounded-full w-full" />
                <div className="h-1 bg-slate-800 rounded-full w-4/5" />
                <div className="h-1 bg-slate-800 rounded-full w-full" />
                <div className="h-1 bg-slate-800 rounded-full w-2/3" />
                <div className="h-1 bg-slate-800 rounded-full w-3/4" />
              </div>
              <div className="text-[8px] text-center font-mono font-medium text-slate-600 bg-slate-100 py-0.5 rounded">
                Sheet {page.pageNumber}
              </div>
            </div>
          )}
        </div>

        {/* Quick Zoom Trigger on Hover */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPreview(page.pageNumber);
          }}
          className="absolute top-1.5 right-1.5 size-7 rounded-md bg-background/90 backdrop-blur-xs border border-border shadow-xs text-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground cursor-pointer"
          title="Enlarge Page Preview"
        >
          <Maximize01Icon className="size-3.5" />
        </button>

        {/* Active Rotation Indicator Badge if rotated */}
        {page.rotation > 0 && (
          <div className="absolute bottom-1 left-1 bg-primary text-primary-foreground text-[9px] font-mono px-1.5 py-0.5 rounded shadow-xs">
            {page.rotation}°
          </div>
        )}
      </div>

      {/* Explicit Rotate Action Button with Clear Text */}
      <div className="w-full flex items-center gap-1.5 mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRotatePage(index);
          }}
          className="flex-1 text-[11px] font-medium flex items-center justify-center gap-1 text-foreground border border-border/80 hover:border-primary/50 hover:bg-primary/10 rounded-md py-1 px-2 bg-background transition-colors cursor-pointer shadow-2xs"
          title="Click to rotate page 90 degrees"
        >
          <RotateRight01Icon className="size-3.5 text-primary" />
          <span>Rotate</span>
          <span className="text-[9px] text-muted-foreground font-mono">({page.rotation}°)</span>
        </button>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenPreview(page.pageNumber);
          }}
          className="size-7 flex items-center justify-center text-muted-foreground hover:text-foreground border border-border/80 rounded-md bg-background hover:bg-muted/50 cursor-pointer shadow-2xs sm:hidden"
          title="Zoom Page"
        >
          <Maximize01Icon className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
