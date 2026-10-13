import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Shield01Icon, 
  Download04Icon, 
  Delete02Icon, 
  RefreshIcon,
  SparklesIcon
} from "hugeicons-react";

interface SanitizeActionsProps {
  onSanitize: () => void;
  onDownloadAll: () => void;
  onClear: () => void;
  isProcessing: boolean;
  canSanitize: boolean;
  sanitizedCount: number;
  totalCount: number;
  format: "image/png" | "image/jpeg" | "image/webp";
  setFormat: (f: "image/png" | "image/jpeg" | "image/webp") => void;
}

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
      <div className="flex flex-wrap items-center gap-3">
        <Button
          size="default"
          onClick={onSanitize}
          disabled={!canSanitize || isProcessing}
          className="shadow-sm font-medium"
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
          className="text-muted-foreground hover:text-foreground"
        >
          <Delete02Icon className="size-4 mr-2" />
          Clear Workspace
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        {/* Output Format Selector */}
        <div className="flex items-center gap-1.5 p-1 rounded-md bg-muted text-xs">
          <span className="px-2 text-muted-foreground font-medium">Export:</span>
          {(["image/png", "image/jpeg", "image/webp"] as const).map((fmt) => {
            const label = fmt === "image/png" ? "PNG" : fmt === "image/jpeg" ? "JPEG" : "WEBP";
            const isSelected = format === fmt;

            return (
              <button
                key={fmt}
                type="button"
                onClick={() => setFormat(fmt)}
                className={`px-2 py-1 rounded text-xs font-medium transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-card text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {sanitizedCount > 0 && (
          <Button
            variant="secondary"
            size="default"
            onClick={onDownloadAll}
            className="font-medium"
          >
            <Download04Icon className="size-4 mr-2" />
            Download All ({sanitizedCount})
          </Button>
        )}
      </div>
    </div>
  );
}
