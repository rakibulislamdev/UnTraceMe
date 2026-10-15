"use client";

import React from "react";
import {
  RotateRight01Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ViewIcon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageMeta } from "./types";

interface PdfPreviewModalProps {
  activePreviewPage: number | null;
  pages: PageMeta[];
  thumbnails: Record<number, string>;
  onClose: () => void;
  onPageChange: (newPage: number) => void;
  onRotatePage: (pageIndex: number) => void;
}

export function PdfPreviewModal({
  activePreviewPage,
  pages,
  thumbnails,
  onClose,
  onPageChange,
  onRotatePage,
}: PdfPreviewModalProps) {
  if (activePreviewPage === null) return null;

  const currentPage = pages[activePreviewPage - 1];

  return (
    <div
      className="fixed inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" && activePreviewPage > 1) {
          onPageChange(activePreviewPage - 1);
        } else if (e.key === "ArrowRight" && activePreviewPage < pages.length) {
          onPageChange(activePreviewPage + 1);
        } else if (e.key === "Escape") {
          onClose();
        }
      }}
      tabIndex={0}
    >
      <div
        className="relative bg-card border border-border rounded-xl shadow-2xl max-w-3xl w-full p-4 flex flex-col items-center gap-3.5 h-[90vh] max-h-[820px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="w-full flex items-center justify-between border-b border-border pb-2.5 shrink-0">
          <div className="flex items-center gap-2">
            <ViewIcon className="size-4 text-primary" />
            <span className="text-sm font-semibold text-foreground">
              Page {activePreviewPage} of {pages.length}
            </span>
            {currentPage && (
              <Badge variant="outline" className="text-[10px] font-mono">
                {currentPage.rotation}°
              </Badge>
            )}
          </div>

          {/* Header Actions: Prev / Next / Rotate / Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Previous Page Button */}
            <Button
              variant="outline"
              size="sm"
              disabled={activePreviewPage <= 1}
              onClick={() => onPageChange(activePreviewPage - 1)}
              className="h-7 px-2 text-xs cursor-pointer gap-1"
              title="Previous Page (or Left Arrow key)"
            >
              <ArrowLeft01Icon className="size-3.5" />
              <span className="hidden sm:inline">Prev</span>
            </Button>

            {/* Next Page Button */}
            <Button
              variant="outline"
              size="sm"
              disabled={activePreviewPage >= pages.length}
              onClick={() => onPageChange(activePreviewPage + 1)}
              className="h-7 px-2 text-xs cursor-pointer gap-1"
              title="Next Page (or Right Arrow key)"
            >
              <span className="hidden sm:inline">Next</span>
              <ArrowRight01Icon className="size-3.5" />
            </Button>

            {/* Rotate Page Button */}
            <button
              type="button"
              onClick={() => onRotatePage(activePreviewPage - 1)}
              className="flex items-center gap-1 text-xs border border-border rounded-md px-2.5 py-1 hover:bg-muted hover:border-primary/50 cursor-pointer transition-colors shadow-2xs"
              title="Rotate page 90° clockwise"
            >
              <RotateRight01Icon className="size-3.5 text-primary" />
              <span className="font-medium">Rotate</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="size-7 rounded-md border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted cursor-pointer transition-colors"
              title="Close preview (Esc)"
            >
              <Cancel01Icon className="size-4" />
            </button>
          </div>
        </div>

        {/* Modal Image Body with Fixed Viewport and Hardware Accelerated Rotation */}
        <div className="relative w-full flex-1 flex items-center justify-center overflow-hidden p-4 bg-muted/20 rounded-lg group">
          {/* Floating Side Left Arrow */}
          {activePreviewPage > 1 && (
            <button
              type="button"
              onClick={() => onPageChange(activePreviewPage - 1)}
              className="absolute left-3 z-10 size-9 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
              title="Previous Page"
            >
              <ArrowLeft01Icon className="size-4" />
            </button>
          )}

          {/* Floating Side Right Arrow */}
          {activePreviewPage < pages.length && (
            <button
              type="button"
              onClick={() => onPageChange(activePreviewPage + 1)}
              className="absolute right-3 z-10 size-9 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
              title="Next Page"
            >
              <ArrowRight01Icon className="size-4" />
            </button>
          )}

          {thumbnails[activePreviewPage] ? (
            <div className="relative size-full max-w-[580px] max-h-[640px] flex items-center justify-center pointer-events-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbnails[activePreviewPage]}
                alt={`Enlarged preview of Page ${activePreviewPage}`}
                className="max-h-full max-w-full object-contain rounded shadow-md border border-border/60 bg-white transition-transform duration-300 ease-out select-none will-change-transform"
                style={{
                  transform: `rotate(${currentPage?.rotation || 0}deg)`,
                }}
              />
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-muted-foreground">
              Loading high resolution preview...
            </div>
          )}
        </div>

        {/* Footer Quick Pagination Bar */}
        <div className="w-full flex items-center justify-between text-xs text-muted-foreground px-1 shrink-0">
          <span className="text-[11px]">
            Tip: Use <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">←</kbd> and <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">→</kbd> keys to flip pages
          </span>
          <span className="font-mono text-[11px] font-medium text-foreground">
            {activePreviewPage} / {pages.length}
          </span>
        </div>
      </div>
    </div>
  );
}
