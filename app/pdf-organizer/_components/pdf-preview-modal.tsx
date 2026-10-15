"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  RotateRight01Icon,
  Cancel01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ViewIcon,
  Pdf01Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageMeta } from "./types";
import { renderSinglePdfPageThumbnail } from "@/lib/pdf-engine/pdf-thumbnail";

interface PdfPreviewModalProps {
  file: File | null;
  activePreviewPage: number | null;
  pages: PageMeta[];
  thumbnails: Record<number, string>;
  onClose: () => void;
  onPageChange: (newPage: number) => void;
  onRotatePage: (pageIndex: number) => void;
  onThumbnailGenerated?: (pageNum: number, url: string) => void;
}

export function PdfPreviewModal({
  file,
  activePreviewPage,
  pages,
  thumbnails,
  onClose,
  onPageChange,
  onRotatePage,
  onThumbnailGenerated,
}: PdfPreviewModalProps) {
  const [isHighResLoading, setIsHighResLoading] = useState(false);
  const [highResCache, setHighResCache] = useState<Record<number, string>>({});
  const [zoom, setZoom] = useState<number>(1);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, startPanX: 0, startPanY: 0 });

  // Lock background window scroll while modal is open so scrollbar doesn't jump
  useEffect(() => {
    if (activePreviewPage !== null) {
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevOverflow;
      };
    }
  }, [activePreviewPage]);

  // Reset zoom and pan when navigating to another page
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [activePreviewPage]);

  // Always fetch high-definition (2.0x scale) WebP preview for the active page
  useEffect(() => {
    if (activePreviewPage === null || !file) return;

    if (highResCache[activePreviewPage]) {
      setIsHighResLoading(false);
      return;
    }

    let isMounted = true;
    setIsHighResLoading(true);

    renderSinglePdfPageThumbnail(file, activePreviewPage, 2.0)
      .then(async (url) => {
        if (url && isMounted) {
          // Pre-decode the image before mounting into state so there is zero flicker or layout pop
          try {
            const preloader = new Image();
            preloader.src = url;
            if ("decode" in preloader) {
              await preloader.decode();
            }
          } catch {
            // Ignore decode fallback
          }

          if (isMounted) {
            setHighResCache((prev) => ({ ...prev, [activePreviewPage]: url }));
            if (onThumbnailGenerated) {
              onThumbnailGenerated(activePreviewPage, url);
            }
          }
        }
      })
      .finally(() => {
        if (isMounted) setIsHighResLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [activePreviewPage, file, highResCache, onThumbnailGenerated]);

  const handleResetZoomPan = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // Only primary left-click
    e.preventDefault();
    dragStartRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      startPanX: pan.x,
      startPanY: pan.y,
    };
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.startX;
    const dy = e.clientY - dragStartRef.current.startY;
    setPan({
      x: dragStartRef.current.startPanX + dx,
      y: dragStartRef.current.startPanY + dy,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleDoubleClick = () => {
    if (zoom > 1 || pan.x !== 0 || pan.y !== 0) {
      handleResetZoomPan();
    } else {
      setZoom(1.5);
    }
  };

  // Zoom via Ctrl + Mouse wheel
  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      if (e.deltaY < 0) {
        setZoom((z) => Math.min(3.0, +(z + 0.2).toFixed(2)));
      } else {
        setZoom((z) => Math.max(1.0, +(z - 0.2).toFixed(2)));
      }
    }
  };

  if (activePreviewPage === null) return null;

  const currentPage = pages[activePreviewPage - 1];
  const displayImage = highResCache[activePreviewPage] || thumbnails[activePreviewPage];

  return (
    <div
      className="fixed inset-0 z-50 bg-background/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft" && activePreviewPage > 1) {
          onPageChange(activePreviewPage - 1);
        } else if (e.key === "ArrowRight" && activePreviewPage < pages.length) {
          onPageChange(activePreviewPage + 1);
        } else if (e.key === "+" || e.key === "=") {
          setZoom((z) => Math.min(3.0, +(z + 0.25).toFixed(2)));
        } else if (e.key === "-" || e.key === "_") {
          setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)));
        } else if (e.key === "0") {
          handleResetZoomPan();
        } else if (e.key === "Escape") {
          onClose();
        }
      }}
      tabIndex={0}
    >
      <div
        className="relative bg-card border border-border rounded-xl shadow-2xl max-w-6xl w-full p-3 sm:p-4 flex flex-col items-center gap-2.5 h-[94vh] max-h-[920px] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="w-full flex items-center justify-between border-b border-border pb-2.5 shrink-0 gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <ViewIcon className="size-4 text-primary shrink-0" />
            <span className="text-xs sm:text-sm font-semibold text-foreground truncate">
              Page {activePreviewPage} of {pages.length}
            </span>
            {currentPage && (
              <Badge variant="outline" className="text-[10px] font-mono shrink-0">
                {currentPage.rotation}°
              </Badge>
            )}
            {isHighResLoading && (
              <Badge
                variant="secondary"
                className="text-[9px] font-medium bg-primary/10 text-primary border border-primary/20 animate-pulse hidden sm:inline-flex"
              >
                Sharpening...
              </Badge>
            )}
          </div>

          {/* Header Controls: Zoom, Prev, Next, Rotate, Close */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom In / Out Controls */}
            <div className="flex items-center border border-border rounded-md px-1.5 py-0.5 text-xs bg-muted/40 shadow-2xs">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(1, +(z - 0.25).toFixed(2)))}
                disabled={zoom <= 1}
                className="size-6 flex items-center justify-center rounded hover:bg-background disabled:opacity-30 cursor-pointer font-bold text-sm"
                title="Zoom Out (- key)"
              >
                −
              </button>
              <span className="font-mono text-[11px] px-1 text-center min-w-[38px] select-none font-medium">
                {Math.round(zoom * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(3.0, +(z + 0.25).toFixed(2)))}
                disabled={zoom >= 3.0}
                className="size-6 flex items-center justify-center rounded hover:bg-background disabled:opacity-30 cursor-pointer font-bold text-sm"
                title="Zoom In (+ key)"
              >
                +
              </button>
              {(zoom > 1 || pan.x !== 0 || pan.y !== 0) && (
                <button
                  type="button"
                  onClick={handleResetZoomPan}
                  className="text-[10px] text-primary font-medium hover:underline px-1.5 py-0.5 rounded bg-primary/10 ml-1 cursor-pointer"
                  title="Fit to Screen & Reset Pan (0 key)"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Previous Page Button */}
            <Button
              variant="outline"
              size="sm"
              disabled={activePreviewPage <= 1}
              onClick={() => onPageChange(activePreviewPage - 1)}
              className="h-7 px-2 text-xs cursor-pointer gap-1"
              title="Previous Page (or Left Arrow)"
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
              title="Next Page (or Right Arrow)"
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
              <span className="font-medium hidden sm:inline">Rotate</span>
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

        {/* Modal Image Body with Interactive Click-and-Drag Pan Canvas */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onWheel={handleWheel}
          className={`relative w-full flex-1 overflow-hidden p-2 sm:p-4 bg-muted/20 rounded-lg overscroll-contain flex items-center justify-center select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          title="Click and drag mouse in any direction to move page • Double-click to toggle 150%"
        >
          {/* Floating Side Left Arrow */}
          {activePreviewPage > 1 && (
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onPageChange(activePreviewPage - 1)}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
              title="Previous Page (Left Arrow)"
            >
              <ArrowLeft01Icon className="size-5" />
            </button>
          )}

          {/* Floating Side Right Arrow */}
          {activePreviewPage < pages.length && (
            <button
              type="button"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={() => onPageChange(activePreviewPage + 1)}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 size-10 rounded-full bg-background/90 border border-border shadow-md flex items-center justify-center text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
              title="Next Page (Right Arrow)"
            >
              <ArrowRight01Icon className="size-5" />
            </button>
          )}

          {/* Locked Document Sheet Container (Large, clear, zero size jumping) */}
          <div
            onDoubleClick={handleDoubleClick}
            className="relative shadow-2xl rounded-md bg-white border border-border/80 flex items-center justify-center shrink-0 select-none overflow-hidden"
            style={{
              height: "82vh",
              maxHeight: "calc(100% - 16px)",
              aspectRatio: "612 / 792",
              maxWidth: "94%",
              transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom}) rotate(${currentPage?.rotation || 0}deg)`,
              transformOrigin: "center center",
              transition: isDragging ? "none" : "transform 0.15s cubic-bezier(0.2, 0, 0, 1)",
            }}
          >
            {displayImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={displayImage}
                alt={`Page ${activePreviewPage}`}
                draggable={false}
                onDragStart={(e) => e.preventDefault()}
                className="w-full h-full object-contain rounded-md select-none pointer-events-none will-change-transform"
              />
            ) : (
              /* Full Document Sheet Wireframe Placeholder (Zero size jump while loading) */
              <div className="w-full h-full flex flex-col justify-between p-8 bg-white select-none">
                <div className="flex items-center justify-between opacity-50 border-b pb-4">
                  <div className="flex items-center gap-2">
                    <Pdf01Icon className="size-5 text-primary" />
                    <span className="text-xs font-mono font-bold text-slate-700">
                      Page {activePreviewPage} of {pages.length}
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">Document Sheet</span>
                </div>

                <div className="flex flex-col items-center gap-3 my-auto py-12">
                  <div className="size-7 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-medium text-slate-600">
                    Rendering crystal-clear preview...
                  </span>
                </div>

                <div className="space-y-3 opacity-20 px-2">
                  <div className="h-2 bg-slate-800 rounded-full w-full" />
                  <div className="h-2 bg-slate-800 rounded-full w-4/5" />
                  <div className="h-2 bg-slate-800 rounded-full w-full" />
                  <div className="h-2 bg-slate-800 rounded-full w-3/4" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Quick Pagination Bar */}
        <div className="w-full flex items-center justify-between text-xs text-muted-foreground px-1 shrink-0">
          <span className="text-[11px] text-muted-foreground">
            Tip: Drag to pan • Ctrl + Wheel or <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">+</kbd> <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">−</kbd> to zoom • Double-click for 150% • <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">←</kbd> <kbd className="px-1 py-0.5 rounded border border-border bg-muted text-[10px]">→</kbd> to flip
          </span>
          <span className="font-mono text-[11px] font-medium text-foreground">
            {activePreviewPage} / {pages.length}
          </span>
        </div>
      </div>
    </div>
  );
}
