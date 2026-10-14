"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Download04Icon, 
  CheckmarkCircle02Icon, 
  ArrowRight01Icon,
  SparklesIcon,
  Image01Icon,
  ViewIcon,
  Cancel01Icon,
  Loading03Icon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious,
  type CarouselApi
} from "@/components/ui/carousel";
import { CompressedImageResult, formatBytes } from "@/lib/image-engine/image-compressor";

interface CompressorResultsProps {
  results: CompressedImageResult[];
  onDownloadSingle: (item: CompressedImageResult) => void;
  onDownloadAll: () => void;
  isZipping?: boolean;
}

export function CompressorResults({
  results,
  onDownloadSingle,
  onDownloadAll,
  isZipping,
}: CompressorResultsProps) {
  // Carousel Modal state for Compare Quality
  const [activeModalIndex, setActiveModalIndex] = useState<number | null>(null);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  if (results.length === 0) return null;

  const totalOriginalSize = results.reduce((acc, curr) => acc + curr.originalSize, 0);
  const totalCompressedSize = results.reduce((acc, curr) => acc + curr.compressedSize, 0);
  const totalSavedBytes = Math.max(0, totalOriginalSize - totalCompressedSize);
  const overallPercentage = totalOriginalSize > 0 
    ? Math.round((totalSavedBytes / totalOriginalSize) * 100) 
    : 0;

  const handleOpenComparisonCarousel = (index: number) => {
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
              Optimization Complete ({results.length} {results.length === 1 ? "Image" : "Images"} Ready)
            </h2>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Total Saved: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{formatBytes(totalSavedBytes)} ({overallPercentage}%)</span> — Reduced from {formatBytes(totalOriginalSize)} to {formatBytes(totalCompressedSize)}
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
              <span>Generating ZIP Archive...</span>
            </>
          ) : results.length > 1 ? (
            <>
              <Download04Icon className="size-4 mr-1.5" />
              <span>Download All as ZIP ({results.length})</span>
            </>
          ) : (
            <>
              <Download04Icon className="size-4 mr-1.5" />
              <span>Download Image</span>
            </>
          )}
        </Button>
      </div>

      {/* Grid of Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((item, index) => {
          const isReduced = item.compressedSize < item.originalSize;

          return (
            <div
              key={item.id}
              className="p-3.5 rounded-lg border border-border/80 bg-muted/20 flex flex-col justify-between space-y-3 transition-colors hover:border-primary/40 group"
            >
              <div className="flex gap-3">
                {/* Thumbnail Clickable to Open Comparison Carousel */}
                <button
                  type="button"
                  onClick={() => handleOpenComparisonCarousel(index)}
                  className="size-16 rounded-md border border-border overflow-hidden bg-background shrink-0 relative flex items-center justify-center cursor-pointer group-hover:ring-2 group-hover:ring-primary/50 transition-all"
                  title="Click to compare quality in carousel"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.previewUrl}
                    alt={item.originalFile.name}
                    className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/35 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <ViewIcon className="size-4" />
                  </div>
                </button>

                {/* Details */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p 
                      onClick={() => handleOpenComparisonCarousel(index)}
                      className="truncate text-xs font-semibold text-foreground cursor-pointer hover:text-primary transition-colors"
                      title={item.originalFile.name}
                    >
                      {item.originalFile.name}
                    </p>
                    {isReduced ? (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 font-bold border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 shrink-0"
                      >
                        -{item.savedPercentage}%
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0 font-normal text-muted-foreground shrink-0"
                      >
                        Optimized
                      </Badge>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-xs">
                    <span className="text-muted-foreground line-through">
                      {formatBytes(item.originalSize)}
                    </span>
                    <ArrowRight01Icon className="size-3 text-muted-foreground" />
                    <span className="font-semibold text-foreground">
                      {formatBytes(item.compressedSize)}
                    </span>
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span>{item.width} × {item.height}px</span>
                    <span>•</span>
                    <span className="uppercase">{item.format.replace("image/", "")}</span>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="pt-2 border-t border-border/50 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenComparisonCarousel(index)}
                  className="inline-flex items-center gap-1.5 text-xs text-primary font-medium hover:underline transition-all cursor-pointer select-none"
                >
                  <ViewIcon className="size-3.5 text-primary" />
                  <span>Compare Quality</span>
                </button>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onDownloadSingle(item)}
                    className="h-7 text-xs cursor-pointer font-medium"
                  >
                    <Download04Icon className="size-3 mr-1" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Compare Quality in Carousel Lightbox Modal */}
      <AnimatePresence>
        {activeModalIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative w-full max-w-4xl bg-card border border-border rounded-2xl shadow-2xl p-4 sm:p-6 flex flex-col max-h-[92vh] overflow-hidden"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <Image01Icon className="size-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">
                    Compare Quality (Before vs After)
                  </h3>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveModalIndex(null)}
                  className="size-8 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <Cancel01Icon className="size-4" />
                </button>
              </div>

              {/* Carousel Content */}
              <div className="py-4 px-2 sm:px-12 flex-1 flex flex-col justify-center overflow-hidden">
                <Carousel 
                  setApi={setCarouselApi}
                  opts={{
                    startIndex: activeModalIndex,
                    loop: true,
                  }}
                  className="w-full relative"
                >
                  <CarouselContent>
                    {results.map((item, idx) => (
                      <CarouselItem key={item.id} className="flex flex-col items-center">
                        <div className="w-full flex flex-col items-center space-y-4">
                          {/* Side-by-Side Comparison Split Box inside Carousel Slide */}
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-h-[52vh] sm:max-h-[58vh]">
                            {/* Original (Before) Side */}
                            <div className="relative rounded-xl border border-border bg-muted/20 flex flex-col items-center justify-center p-2 overflow-hidden h-[240px] sm:h-[360px]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.originalUrl}
                                alt="Original"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-2 left-2 bg-background/90 backdrop-blur border border-border/80 px-2 py-0.5 rounded text-[11px] font-medium text-muted-foreground">
                                Before: {formatBytes(item.originalSize)}
                              </div>
                            </div>

                            {/* Compressed (After) Side */}
                            <div className="relative rounded-xl border border-emerald-500/40 bg-muted/20 flex flex-col items-center justify-center p-2 overflow-hidden h-[240px] sm:h-[360px]">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={item.previewUrl}
                                alt="Compressed"
                                className="w-full h-full object-contain"
                              />
                              <div className="absolute top-2 right-2 bg-emerald-600 text-white px-2 py-0.5 rounded text-[11px] font-semibold shadow-xs flex items-center gap-1">
                                <span>After: {formatBytes(item.compressedSize)}</span>
                                <span>(-{item.savedPercentage}%)</span>
                              </div>
                            </div>
                          </div>

                          {/* Slide Details Bar */}
                          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 p-3 rounded-lg border border-border bg-muted/30">
                            <div>
                              <p className="text-xs font-semibold text-foreground truncate max-w-sm">
                                {item.originalFile.name}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-0.5">
                                {item.width} × {item.height}px • Saved {formatBytes(item.originalSize - item.compressedSize)} ({item.savedPercentage}%)
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="text-xs text-muted-foreground mr-1">
                                Image {idx + 1} of {results.length}
                              </span>
                              <Button
                                onClick={() => onDownloadSingle(item)}
                                size="sm"
                                className="cursor-pointer text-xs h-8"
                              >
                                <Download04Icon className="size-3.5 mr-1" />
                                Download This Image
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {results.length > 1 && (
                    <>
                      <CarouselPrevious className="left-0 sm:-left-10 cursor-pointer bg-background/90" />
                      <CarouselNext className="right-0 sm:-right-10 cursor-pointer bg-background/90" />
                    </>
                  )}
                </Carousel>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
