"use client";

import React from "react";
import { 
  Shield01Icon, 
  Settings01Icon, 
  FileEditIcon, 
  Layers01Icon, 
  Tag01Icon,
  InformationCircleIcon,
  CheckmarkCircle02Icon,
  SlidersHorizontalIcon
} from "hugeicons-react";
import { PdfSanitizeOptions, PdfMetadataInfo, CompressionPreset } from "@/lib/pdf-engine/pdf-sanitizer";

interface PdfControlsProps {
  options: PdfSanitizeOptions;
  metadataInfo: PdfMetadataInfo | null;
  onChangeOptions: (newOptions: Partial<PdfSanitizeOptions>) => void;
  isProcessing: boolean;
}

export function PdfControls({
  options,
  metadataInfo,
  onChangeOptions,
  isProcessing,
}: PdfControlsProps) {
  const compressionPresets: { id: CompressionPreset; label: string; desc: string; badge: string }[] = [
    {
      id: "extreme",
      label: "Extreme Compression",
      desc: "Strip redundant outlines, page caches, and compress all object streams for maximum size reduction.",
      badge: "Max Savings",
    },
    {
      id: "recommended",
      label: "Recommended",
      desc: "Optimal balance between document structure preservation and file size reduction.",
      badge: "Balanced",
    },
    {
      id: "lossless",
      label: "Lossless Privacy",
      desc: "Scrub metadata and tracking traces without altering any visual elements.",
      badge: "Privacy Only",
    },
  ];

  const toggleItems = [
    {
      key: "stripMetadata" as const,
      label: "Document Info & Author Scrubbing",
      desc: "Remove Author name, Software Creator, Producer, Revision timestamps, and Subject tags.",
      icon: Tag01Icon,
    },
    {
      key: "cleanXmpStream" as const,
      label: "Adobe XMP & C2PA Metadata Stream",
      desc: "Scrub invisible XML schemas, Photoshop tracing, and C2PA synthetic provenance fingerprints.",
      icon: Shield01Icon,
    },
    {
      key: "cleanStructureTree" as const,
      label: "Structure Tree & Tagged Document Roots",
      desc: "Strip accessibility StructTreeRoot and Adobe PieceInfo session caches to minimize footprint.",
      icon: Layers01Icon,
    },
    {
      key: "removeAnnotations" as const,
      label: "Comments & Sticky Note Annotations",
      desc: "Wipe user annotations, highlights, and popup form comments from all pages.",
      icon: FileEditIcon,
    },
  ];

  return (
    <div className="border border-border rounded-xl p-5 bg-card/60 backdrop-blur-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-3.5 gap-2">
        <div className="flex items-center gap-2">
          <Settings01Icon className="size-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground">
            Compression & Privacy Configuration
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-primary flex items-center gap-1 font-medium bg-primary/10 px-2.5 py-0.5 rounded-full border border-primary/20">
            <CheckmarkCircle02Icon className="size-3" />
            Object Stream Cross-Ref Packing
          </span>
        </div>
      </div>

      {/* Compression Level Selector */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <SlidersHorizontalIcon className="size-3.5 text-primary" />
          <span>Compression Profile</span>
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {compressionPresets.map((preset) => {
            const isSelected = options.compressionPreset === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => !isProcessing && onChangeOptions({ compressionPreset: preset.id })}
                className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col justify-between gap-2 select-none ${
                  isSelected
                    ? "bg-primary/10 border-primary ring-1 ring-primary/40"
                    : "bg-secondary/30 border-border hover:bg-secondary/60 hover:border-primary/40"
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className={`text-xs font-semibold ${isSelected ? "text-primary" : "text-foreground"}`}>
                    {preset.label}
                  </span>
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                    isSelected ? "bg-primary text-primary-foreground font-bold" : "bg-secondary text-muted-foreground"
                  }`}>
                    {preset.badge}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {preset.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Metadata Inspector Card if detected */}
      {metadataInfo && (
        <div className="rounded-lg bg-secondary/50 border border-border p-3.5 space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <InformationCircleIcon className="size-3.5 text-primary" />
            <span>Detected Document Traces ({metadataInfo.pageCount} Pages)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 text-[11px]">
            <div>
              <span className="text-muted-foreground block">Author:</span>
              <span className="font-mono text-foreground truncate block">
                {metadataInfo.author || "Not specified (Clean)"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Software Engine / Producer:</span>
              <span className="font-mono text-foreground truncate block">
                {metadataInfo.producer || metadataInfo.creator || "Not specified (Clean)"}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground block">Created Date:</span>
              <span className="font-mono text-foreground truncate block">
                {metadataInfo.creationDate || "Not stamped"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Switches */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        {toggleItems.map((item) => {
          const isChecked = options[item.key];
          const ItemIcon = item.icon;

          return (
            <div
              key={item.key}
              onClick={() => {
                if (!isProcessing) {
                  onChangeOptions({ [item.key]: !isChecked });
                }
              }}
              className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                isChecked
                  ? "bg-primary/5 border-primary/40 ring-1 ring-primary/20"
                  : "bg-background/40 border-border hover:bg-muted/40 hover:border-border/80"
              }`}
            >
              <div
                className={`size-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                  isChecked
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-secondary text-muted-foreground border-border"
                }`}
              >
                <ItemIcon className="size-4" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">
                    {item.label}
                  </span>
                  <div
                    className={`w-8 h-4 rounded-full transition-colors relative flex items-center p-0.5 ${
                      isChecked ? "bg-primary" : "bg-muted border border-border"
                    }`}
                  >
                    <div
                      className={`size-3 rounded-full bg-white transition-transform ${
                        isChecked ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
