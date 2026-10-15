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
}: PdfOrganizerWorkspaceProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Callback ref to guarantee wheel listener is cleanly attached and isolates scroll
  const setScrollContainerRef = React.useCallback((node: HTMLDivElement | null) => {
    if (scrollContainerRef.current) {
      const el = scrollContainerRef.current as HTMLElement & { _wheelHandler?: (e: WheelEvent) => void };
      if (el._wheelHandler) {
        el.removeEventListener("wheel", el._wheelHandler);
        delete el._wheelHandler;
      }
    }

    scrollContainerRef.current = node;

    if (node) {
      const onWheel = (e: WheelEvent) => {
        // Trap wheel event inside container to stop page scroll
        e.preventDefault();
        e.stopPropagation();
        node.scrollTop += e.deltaY;
      };

      (node as HTMLElement & { _wheelHandler?: (e: WheelEvent) => void })._wheelHandler = onWheel;
      node.addEventListener("wheel", onWheel, { passive: false });
    }
  }, []);

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

      {/* Interactive Pages Scroll Container with Mouse Wheel Isolation */}
      <div
        ref={setScrollContainerRef}
        tabIndex={0}
        className="w-full max-h-[560px] overflow-y-auto overscroll-contain focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/40 rounded-lg pr-1.5 p-1 border border-border/40 bg-muted/10 cursor-default"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {pages.map((p, idx) => (
            <PdfPageCard
              key={idx}
              page={p}
              index={idx}
              thumbnailUrl={thumbnails[p.pageNumber]}
              onToggleSelect={onToggleSelect}
              onRotatePage={onRotatePage}
              onOpenPreview={onOpenPreview}
            />
          ))}
        </div>
      </div>

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
