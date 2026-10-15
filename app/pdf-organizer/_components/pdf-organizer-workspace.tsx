"use client";

import React, { useRef } from "react";
import {
  Pdf01Icon,
  RotateRight01Icon,
  Delete02Icon,
  Loading03Icon,
  FileExportIcon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes } from "@/lib/image-engine/image-converter";
import { PageMeta } from "./types";
import { PdfPageCard } from "./pdf-page-card";

interface PdfOrganizerWorkspaceProps {
  file: File;
  pages: PageMeta[];
  thumbnails: Record<number, string>;
  isProcessing: boolean;
  isSplitting: boolean;
  onRotatePage: (index: number) => void;
  onRotateAll: () => void;
  onToggleSelect: (index: number) => void;
  onSelectAll: (select: boolean) => void;
  onClear: () => void;
  onExportSelected: () => void;
  onSplitAllToZip: () => void;
  onOpenPreview: (pageNumber: number) => void;
  onBatchChange?: (startPage: number, endPage: number) => void;
}

export function PdfOrganizerWorkspace({
  file,
  pages,
  thumbnails,
  isProcessing,
  isSplitting,
  onRotatePage,
  onRotateAll,
  onToggleSelect,
  onSelectAll,
  onClear,
  onExportSelected,
  onSplitAllToZip,
  onOpenPreview,
  onBatchChange,
}: PdfOrganizerWorkspaceProps) {
  const [currentPage, setCurrentPage] = React.useState(1);
  const PAGE_SIZE = 60; // Show 60 cards at a time so even 2000+ page PDFs run with 60 FPS!

  const totalBatches = Math.ceil(pages.length / PAGE_SIZE);
  const visiblePages = pages.length > PAGE_SIZE
    ? pages.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
    : pages;

  React.useEffect(() => {
    if (onBatchChange) {
      const start = (currentPage - 1) * PAGE_SIZE + 1;
      const end = Math.min(currentPage * PAGE_SIZE, pages.length);
      onBatchChange(start, end);
    }
  }, [currentPage, onBatchChange, pages.length]);

  const selectedCount = pages.filter((p) => p.isSelected).length;

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
      {/* Top Bar with File Details and Global Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-border gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <Pdf01Icon className="size-4 text-primary shrink-0" />
          <span className="text-xs font-semibold text-foreground truncate">
            {file.name}
          </span>
          <Badge variant="outline" className="text-[10px] font-mono">
            {pages.length} Pages • {formatBytes(file.size)}
          </Badge>
          {pages.length > 100 && (
            <Badge
              variant="secondary"
              className="text-[10px] font-medium bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
              title="Ultra-Fast mode enabled for large document: instant page splitting, selection, and rotation without memory freezing."
            >
              ⚡ Fast Mode
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onRotateAll}
            className="h-7 text-xs cursor-pointer gap-1"
            title="Rotate all pages 90° clockwise"
          >
            <RotateRight01Icon className="size-3.5 text-primary" />
            <span>Rotate All</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectAll(true)}
            className="h-7 text-xs cursor-pointer"
          >
            Select All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectAll(false)}
            className="h-7 text-xs cursor-pointer"
          >
            Deselect
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="h-7 text-xs text-muted-foreground hover:text-destructive cursor-pointer"
          >
            <Delete02Icon className="size-3.5 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      {/* Interactive Pages Scroll Container */}
      <div
        tabIndex={0}
        className="w-full max-h-[560px] overflow-y-auto overscroll-contain focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-lg pr-1.5 p-1 border border-border/40 bg-muted/10 cursor-default"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {visiblePages.map((p) => {
            const actualIndex = p.pageNumber - 1;
            return (
              <PdfPageCard
                key={p.pageNumber}
                page={p}
                index={actualIndex}
                thumbnailUrl={thumbnails[p.pageNumber]}
                onToggleSelect={onToggleSelect}
                onRotatePage={onRotatePage}
                onOpenPreview={onOpenPreview}
              />
            );
          })}
        </div>
      </div>

      {/* Pagination Bar for Large PDFs (>60 pages) */}
      {totalBatches > 1 && (
        <div className="flex items-center justify-between px-2 py-1.5 bg-muted/30 border border-border rounded-lg text-xs">
          <span className="text-muted-foreground font-mono">
            Showing pages {(currentPage - 1) * PAGE_SIZE + 1}–
            {Math.min(currentPage * PAGE_SIZE, pages.length)} of {pages.length}
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-6 px-2 text-[11px]"
            >
              Previous
            </Button>
            <span className="text-xs font-mono font-medium px-1">
              {currentPage} / {totalBatches}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalBatches}
              onClick={() => setCurrentPage((p) => Math.min(totalBatches, p + 1))}
              className="h-6 px-2 text-[11px]"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          {selectedCount} of {pages.length} pages selected
        </span>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isSplitting || isProcessing}
            onClick={onSplitAllToZip}
            className="cursor-pointer text-xs"
          >
            {isSplitting ? (
              <>
                <Loading03Icon className="size-3.5 mr-1.5 animate-spin" />
                Zipping individual pages...
              </>
            ) : (
              <>Split All to ZIP</>
            )}
          </Button>

          <Button
            size="sm"
            disabled={isProcessing || isSplitting}
            onClick={onExportSelected}
            className="cursor-pointer font-medium text-xs shadow-xs"
          >
            {isProcessing ? (
              <>
                <Loading03Icon className="size-3.5 mr-1.5 animate-spin" />
                Building PDF...
              </>
            ) : (
              <>
                <FileExportIcon className="size-3.5 mr-1.5" />
                Export Selected Pages
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
