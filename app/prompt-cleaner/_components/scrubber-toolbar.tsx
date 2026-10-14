"use client";

import React, { useState } from "react";
import { 
  CleanIcon, 
  Delete02Icon, 
  Download04Icon, 
  Copy01Icon, 
  CheckmarkCircle02Icon,
  SparklesIcon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScrubberToolbarProps {
  onScrub: () => void;
  onClear: () => void;
  onDownload: () => void;
  onLoadSample: () => void;
  onCopy: () => void;
  isProcessing: boolean;
  canScrub: boolean;
  hasOutput: boolean;
}

export function ScrubberToolbar({
  onScrub,
  onClear,
  onDownload,
  onLoadSample,
  onCopy,
  isProcessing,
  canScrub,
  hasOutput,
}: ScrubberToolbarProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card shadow-xs">
      {/* Left side actions */}
      <div className="flex items-center gap-2">
        <Button
          onClick={onScrub}
          disabled={!canScrub || isProcessing}
          size="sm"
          className="shadow-xs font-medium cursor-pointer"
        >
          <CleanIcon className="size-4 mr-1.5" />
          <span>{isProcessing ? "Scrubbing Prompt..." : "Scrub Prompt"}</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={onLoadSample}
          disabled={isProcessing}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          <SparklesIcon className="size-3.5 mr-1.5 text-primary" />
          <span>Load Dirty Sample</span>
        </Button>
      </div>

      {/* Right side actions */}
      <div className="flex items-center gap-2">
        <Button
          variant={copied ? "secondary" : "ghost"}
          size="sm"
          onClick={handleCopyClick}
          disabled={!hasOutput || isProcessing}
          className={cn(
            "text-xs transition-all duration-150 cursor-pointer",
            copied && "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 font-medium"
          )}
        >
          {copied ? (
            <CheckmarkCircle02Icon className="size-3.5 mr-1.5 text-emerald-500" />
          ) : (
            <Copy01Icon className="size-3.5 mr-1.5" />
          )}
          <span>{copied ? "Copied to Clipboard!" : "Copy Result"}</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onDownload}
          disabled={!hasOutput || isProcessing}
          className="text-xs"
        >
          <Download04Icon className="size-3.5 mr-1.5" />
          <span>Export .txt</span>
        </Button>

        <div className="h-4 w-px bg-border mx-1" />

        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={isProcessing}
          className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Delete02Icon className="size-3.5 mr-1.5" />
          <span>Clear</span>
        </Button>
      </div>
    </div>
  );
}
