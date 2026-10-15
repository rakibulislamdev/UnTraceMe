"use client";

import React from "react";
import { Loading03Icon } from "hugeicons-react";

interface BgProcessingLoaderProps {
  displayProgress: number;
}

export function BgProcessingLoader({
  displayProgress,
}: BgProcessingLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 rounded-2xl border border-border bg-card shadow-sm space-y-5 text-center">
      <div className="size-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
        <Loading03Icon className="size-7 animate-spin" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">
          Removing background...
        </h3>
        <p className="text-xs text-muted-foreground">
          Please wait while your image is being processed
        </p>
      </div>

      <div className="w-full max-w-xs space-y-2">
        <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-all duration-150 ease-out"
            style={{ width: `${Math.max(6, displayProgress)}%` }}
          />
        </div>
        <p className="text-xs font-mono text-muted-foreground text-right">
          {displayProgress}%
        </p>
      </div>
    </div>
  );
}
