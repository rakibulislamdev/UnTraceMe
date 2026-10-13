import React from "react";
import { Button } from "@/components/ui/button";
import { 
  SparklesIcon, 
  Delete02Icon, 
  Download04Icon,
} from "hugeicons-react";

interface TextToolbarProps {
  onHumanize: () => void;
  onClear: () => void;
  onDownload: () => void;
  isProcessing: boolean;
  canHumanize: boolean;
  hasOutput: boolean;
}

export function TextToolbar({
  onHumanize,
  onClear,
  onDownload,
  isProcessing,
  canHumanize,
  hasOutput,
}: TextToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 py-2">
      <div className="flex items-center gap-3">
        <Button
          size="default"
          onClick={onHumanize}
          disabled={!canHumanize || isProcessing}
          className="shadow-sm font-medium relative overflow-hidden transition-all duration-300 min-w-[165px]"
        >
          {isProcessing ? (
            /* Claude Thinking Animation Effect: Shimmer text + 3-dot harmonic wave */
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium tracking-wide">
                Thinking
              </span>
              <div className="flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-primary-foreground animate-claude-dot-1" />
                <span className="size-1.5 rounded-full bg-primary-foreground animate-claude-dot-2" />
                <span className="size-1.5 rounded-full bg-primary-foreground animate-claude-dot-3" />
              </div>
            </div>
          ) : (
            <>
              <SparklesIcon className="size-4 mr-2" />
              Humanize Content
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="default"
          onClick={onClear}
          disabled={!canHumanize && !hasOutput}
          className="text-muted-foreground hover:text-foreground"
        >
          <Delete02Icon className="size-4 mr-2" />
          Reset All
        </Button>
      </div>

      {hasOutput && (
        <Button
          variant="secondary"
          size="default"
          onClick={onDownload}
          className="font-medium"
        >
          <Download04Icon className="size-4 mr-2" />
          Download .txt
        </Button>
      )}
    </div>
  );
}
