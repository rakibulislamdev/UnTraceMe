"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download04Icon, CheckmarkCircle02Icon } from "hugeicons-react";

export interface SanitizedImageItem {
  id: string;
  name: string;
  originalUrl: string;
  sanitizedUrl: string;
  blob: Blob;
  size: number;
}

interface ImageComparisonProps {
  items: SanitizedImageItem[];
  onDownloadSingle: (item: SanitizedImageItem) => void;
}

export function ImageComparison({ items, onDownloadSingle }: ImageComparisonProps) {
  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-foreground tracking-tight">
          Sanitized Gallery & Before/After Comparison
        </h4>
        <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
          <CheckmarkCircle02Icon className="size-3 mr-1" />
          {items.length} Images Cleaned
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col p-4 rounded-lg border border-border bg-card shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-foreground truncate max-w-[200px]">
                {item.name}
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => onDownloadSingle(item)}
                className="gap-1 text-[11px]"
              >
                <Download04Icon className="size-3" />
                Download
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2 h-44 rounded-md overflow-hidden bg-muted/20 border border-border p-2">
              <div className="flex flex-col items-center justify-center h-full relative overflow-hidden rounded bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.originalUrl}
                  alt="Original"
                  className="h-full w-full object-contain"
                />
                <span className="absolute bottom-1 left-1 text-[9px] bg-background/80 px-1 rounded text-muted-foreground">
                  Original
                </span>
              </div>

              <div className="flex flex-col items-center justify-center h-full relative overflow-hidden rounded bg-background">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.sanitizedUrl}
                  alt="Sanitized"
                  className="h-full w-full object-contain"
                />
                <span className="absolute bottom-1 left-1 text-[9px] bg-emerald-500/90 text-white px-1 rounded font-medium">
                  100% Clean
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
