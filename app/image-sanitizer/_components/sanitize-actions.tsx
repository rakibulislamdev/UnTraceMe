"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Shield01Icon, 
  Download04Icon, 
  Delete02Icon, 
  RefreshIcon
} from "hugeicons-react";
import { cn } from "@/lib/utils";

export type ImageExportFormat = "image/png" | "image/jpeg" | "image/webp";

interface SanitizeActionsProps {
  onSanitize: () => void;
  onDownloadAll: () => void;
  onClear: () => void;
  isProcessing: boolean;
  canSanitize: boolean;
  sanitizedCount: number;
  totalCount: number;
  format: ImageExportFormat;
  setFormat: (f: ImageExportFormat) => void;
}

const EXPORT_FORMATS: { id: ImageExportFormat; label: string; ext: string }[] = [
  { id: "image/png", label: "PNG", ext: "png" },
  { id: "image/jpeg", label: "JPEG", ext: "jpg" },
  { id: "image/webp", label: "WEBP", ext: "webp" },
];

export function SanitizeActions({
  onSanitize,
  onDownloadAll,
  onClear,
  isProcessing,
  canSanitize,
  sanitizedCount,
  totalCount,
  format,
  setFormat,
}: SanitizeActionsProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg border border-border bg-card shadow-sm">
      {/* Primary Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="default"
          onClick={onSanitize}
          disabled={!canSanitize || isProcessing}
          className="shadow-sm font-medium cursor-pointer"
        >
          {isProcessing ? (
            <>
              <RefreshIcon className="size-4 animate-spin mr-2" />
              Scrubbing Image Traces...
            </>
          ) : (
            <>
              <Shield01Icon className="size-4 mr-2" />
              Sanitize Batch ({totalCount} {totalCount === 1 ? "Image" : "Images"})
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="default"
          onClick={onClear}
          disabled={totalCount === 0 && sanitizedCount === 0}
          className="text-muted-foreground hover:text-foreground cursor-pointer"
        >
          <Delete02Icon className="size-4 mr-2" />
          Clear Workspace
        </Button>
      </div>

      {/* Export Format Selector & Batch Download */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Compact Segmented Tab Container for Export Formats with Smooth Animation */}
        <div className="flex items-center gap-1.5 p-1 rounded-md bg-muted text-xs">
          <span className="px-2 text-muted-foreground font-medium select-none">
            Export:
          </span>
          <div className="relative inline-flex items-center gap-1">
            {EXPORT_FORMATS.map((tab) => {
              const isActive = format === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFormat(tab.id)}
                  className={cn(
                    "relative z-10 inline-flex items-center justify-center px-2.5 py-1 text-xs font-medium rounded-md transition-colors duration-200 select-none cursor-pointer",
                    isActive
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {/* Sliding Spring Indicator with matched rounded-md border radius */}
                  {isActive && (
                    <motion.div
                      layoutId="apple-export-tab-indicator"
                      className="absolute inset-0 z-[-1] rounded-md bg-card shadow-xs border border-border"
                      transition={{
                        type: "spring",
                        stiffness: 450,
                        damping: 35,
                      }}
                    />
                  )}
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {sanitizedCount > 0 && (
          <Button
            variant="secondary"
            size="default"
            onClick={onDownloadAll}
            className="font-medium cursor-pointer"
          >
            <Download04Icon className="size-4 mr-2" />
            Download All ({sanitizedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
