import React from "react";
import { Button } from "@/components/ui/button";
import { 
  Shield01Icon, 
  Download04Icon, 
  Delete02Icon, 
  RefreshIcon 
} from "hugeicons-react";

interface SanitizeActionsProps {
  onSanitize: () => void;
  onDownloadAll: () => void;
  onClear: () => void;
  isProcessing: boolean;
  canSanitize: boolean;
  sanitizedCount: number;
  totalCount: number;
}

export function SanitizeActions({
  onSanitize,
  onDownloadAll,
  onClear,
  isProcessing,
  canSanitize,
  sanitizedCount,
  totalCount,
}: SanitizeActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-3">
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

      {sanitizedCount > 0 && (
        <Button
          variant="secondary"
          size="default"
          onClick={onDownloadAll}
          className="font-medium"
        >
          <Download04Icon className="size-4 mr-2" />
          Download All Sanitized ({sanitizedCount})
        </Button>
      )}
    </div>
  );
}
