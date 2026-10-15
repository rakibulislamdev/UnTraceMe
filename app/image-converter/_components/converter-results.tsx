"use client";

import React, { useState } from "react";
import {
  Download04Icon,
  CheckmarkCircle02Icon,
  ArrowRight01Icon,
  SparklesIcon,
  Image01Icon,
  ViewIcon,
  Cancel01Icon,
  Loading03Icon,
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import {
  ConvertedImageResult,
  formatBytes,
} from "@/lib/image-engine/image-converter";

interface ConverterResultsProps {
  results: ConvertedImageResult[];
  onDownloadSingle: (item: ConvertedImageResult) => void;
  onDownloadAll: () => void;
  isZipping?: boolean;
}

export function ConverterResults({
  results,
  onDownloadSingle,
  onDownloadAll,
  isZipping,
}: ConverterResultsProps) {
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  if (results.length === 0) return null;

  const totalOriginalSize = results.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalConvertedSize = results.reduce((acc, curr) => acc + curr.convertedSize, 0);
  const totalDiffBytes = totalConvertedSize - totalOriginalSize;
  const isSmaller = totalDiffBytes < 0;
  const totalChangePct =
    totalOriginalSize > 0
      ? Math.round((Math.abs(totalDiffBytes) / totalOriginalSize) * 100)
      : 0;

  const handleOpenComparisonModal = (index: number) => {
    setActiveModalIndex(index);
    setTimeout(() => {
      carouselApi?.scrollTo(index, true);
    }, 50);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-5 animate-in fade-in duration-300">
      {/* Top Hero Stats Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-border gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex size-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 items-center justify-center">
              <CheckmarkCircle02Icon className="size-3.5" />
            </span>
            <h2 className="text-sm font-semibold tracking-tight text-foreground">
              Conversion Completed ({results.length} {results.length === 1 ? "File" : "Files"} Ready)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total Output Size:{" "}
            <span className="font-semibold text-foreground font-mono">
              {formatBytes(totalConvertedSize)}
            </span>{" "}
            (from {formatBytes(totalOriginalSize)}{" "}
            {isSmaller ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                • {totalChangePct}% smaller
              </span>
            ) : totalDiffBytes > 0 ? (
              <span className="text-amber-600 dark:text-amber-400 font-medium">
                • +{totalChangePct}%
              </span>
            ) : null}
            )
          </p>
        </div>

        <Button
          onClick={onDownloadAll}
          disabled={isZipping}
          size="sm"
          className="cursor-pointer font-medium shadow-xs"
        >
          {isZipping ? (
            <>
              <Loading03Icon className="size-4 mr-1.5 animate-spin" />
              <span>Building ZIP Archive...</span>
            </>
          ) : results.length > 1 ? (
            <>
              <Download04Icon className="size-4 mr-1.5" />
              <span>Download All as ZIP ({results.length})</span>
            </>
          ) : (
            <>
              <Download04Icon className="size-4 mr-1.5" />
              <span>Download Converted Image</span>
            </>
          )}
        </Button>
      </div>

      {/* Results List */}
      <div className="space-y-3">
        {results.map((item, index) => {
          const itemSmaller = item.sizeDiffBytes < 0;
          const diffPct = Math.abs(item.sizeChangePercentage);
          const origExt = item.originalFile.name.split(".").pop()?.toUpperCase() || "ORIGINAL";

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-3.5 rounded-lg border border-border/70 bg-muted/15 hover:bg-muted/30 transition-colors gap-3"
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  onClick={() => handleOpenComparisonModal(index)}
                  className="relative size-14 shrink-0 rounded-md overflow-hidden bg-muted border border-border/80 cursor-pointer group"
                  title="Click to preview & compare"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.convertedFileName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-background/50 backdrop-blur-2xs opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <ViewIcon className="size-4 text-foreground" />
                  </div>
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-xs font-semibold text-foreground truncate" title={item.convertedFileName}>
                      {item.convertedFileName}
                    </p>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-1.5 py-0 font-mono uppercase bg-primary/5 text-primary border-primary/20 shrink-0"
                    >
                      {item.targetExtension}
                    </Badge>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground mt-1">
                    <span className="font-mono text-muted-foreground/80">
                      {item.width} × {item.height}px
                    </span>
                    <span>•</span>
                    <span className="font-mono line-through opacity-70">
                      {formatBytes(item.originalSize)}
                    </span>
                    <ArrowRight01Icon className="size-3 text-muted-foreground/60" />
                    <span className="font-mono font-medium text-foreground">
                      {formatBytes(item.convertedSize)}
                    </span>
                    {itemSmaller ? (
                      <span className="text-emerald-600 dark:text-emerald-400 font-semibold text-[10px] bg-emerald-500/10 px-1.5 py-0.2 rounded">
                        -{diffPct}%
                      </span>
                    ) : item.sizeDiffBytes > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-medium text-[10px] bg-amber-500/10 px-1.5 py-0.2 rounded">
                        +{diffPct}%
                      </span>
                    ) : (
                      <span className="text-muted-foreground text-[10px]">Identical</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenComparisonModal(index)}
                  className="h-8 text-xs cursor-pointer"
                >
                  <ViewIcon className="size-3.5 mr-1 text-muted-foreground" />
                  <span>Inspect</span>
                </Button>
                <Button
                  size="sm"
                  onClick={() => onDownloadSingle(item)}
                  className="h-8 text-xs cursor-pointer font-medium"
                >
                  <Download04Icon className="size-3.5 mr-1" />
                  <span>Download</span>
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Modal / Carousel */}
      {activeModalIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Image01Icon className="size-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">
                  Side-by-Side Quality Inspection ({activeModalIndex + 1} of {results.length})
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModalIndex(null)}
                className="size-8 rounded-lg hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
              >
                <Cancel01Icon className="size-4" />
              </button>
            </div>

            {/* Carousel Container */}
            <div className="p-4 sm:p-6 overflow-y-auto">
              <Carousel setApi={setCarouselApi} className="w-full">
                <CarouselContent>
                  {results.map((item, idx) => {
                    const origExt = item.originalFile.name.split(".").pop()?.toUpperCase() || "ORIG";
                    return (
                      <CarouselItem key={item.id}>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Original */}
                            <div className="rounded-xl border border-border bg-muted/20 p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-muted-foreground">
                                  Original Source ({origExt})
                                </span>
                                <span className="text-xs font-mono text-muted-foreground">
                                  {formatBytes(item.originalSize)}
                                </span>
                              </div>
                              <div className="aspect-4/3 rounded-lg overflow-hidden bg-background/50 flex items-center justify-center border border-border/50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.originalUrl}
                                  alt="Original preview"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>

                            {/* Converted */}
                            <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-primary">
                                  Converted Output ({item.targetExtension.toUpperCase()})
                                </span>
                                <span className="text-xs font-mono font-bold text-foreground">
                                  {formatBytes(item.convertedSize)}
                                </span>
                              </div>
                              <div className="aspect-4/3 rounded-lg overflow-hidden bg-background/50 flex items-center justify-center border border-primary/20">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={item.previewUrl}
                                  alt="Converted preview"
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <span className="text-xs font-medium text-foreground">
                              {item.convertedFileName}
                            </span>
                            <Button
                              size="sm"
                              onClick={() => onDownloadSingle(item)}
                              className="h-8 text-xs cursor-pointer font-medium"
                            >
                              <Download04Icon className="size-3.5 mr-1" />
                              <span>Download .{item.targetExtension}</span>
                            </Button>
                          </div>
                        </div>
                      </CarouselItem>
                    );
                  })}
                </CarouselContent>
                <div className="flex items-center justify-end gap-2 pt-4">
                  <CarouselPrevious className="static translate-y-0" />
                  <CarouselNext className="static translate-y-0" />
                </div>
              </Carousel>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
