"use client";

import React from "react";
import Cropper, { Area, Point } from "react-easy-crop";
import { ImageCompositionIcon, Download04Icon } from "hugeicons-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { SocialPreset } from "@/lib/image-engine/social-presets";

interface CropperPreviewPaneProps {
  imageSrc: string | null;
  crop: Point;
  zoom: number;
  selectedPreset: SocialPreset;
  onCropChange: (crop: Point) => void;
  onCropComplete: (_croppedArea: Area, croppedAreaPixels: Area) => void;
  onZoomChange: (zoom: number) => void;
  isProcessing: boolean;
  onDownload: () => void;
  formatLabel: string;
  className?: string;
}

export function CropperPreviewPane({
  imageSrc,
  crop,
  zoom,
  selectedPreset,
  onCropChange,
  onCropComplete,
  onZoomChange,
  isProcessing,
  onDownload,
  formatLabel,
  className,
}: CropperPreviewPaneProps) {
  const aspectRatio = selectedPreset.width / selectedPreset.height;

  return (
    <Card className={cn("p-6 rounded-xl border border-border bg-card flex flex-col justify-between min-h-[500px]", className)}>
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div>
            <span className="text-xs font-mono text-primary font-medium">INTERACTIVE CROP STUDIO</span>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              {selectedPreset.name} ({selectedPreset.width} × {selectedPreset.height} px)
            </h3>
          </div>
          <Badge variant="outline" className="text-xs border-border bg-secondary font-mono">
            {selectedPreset.aspectRatio}
          </Badge>
        </div>

        {/* Cropper Viewport */}
        <div className="relative w-full h-[400px] bg-[#010102] rounded-lg border border-border overflow-hidden select-none">
          {imageSrc ? (
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspectRatio}
              onCropChange={onCropChange}
              onCropComplete={onCropComplete}
              onZoomChange={onZoomChange}
              showGrid={true}
              style={{
                containerStyle: {
                  backgroundColor: "#010102",
                },
                cropAreaStyle: {
                  border: "2px solid #5e6ad2",
                  color: "rgba(1, 1, 2, 0.7)",
                },
              }}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-center text-muted-foreground text-xs p-8">
              <ImageCompositionIcon className="size-8 mx-auto mb-2 opacity-40 text-primary" />
              Upload an image to start cropping with precision guide lines.
            </div>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-mono">
          {isProcessing ? "Exporting high-res crop..." : `Original ${formatLabel} preserved • High-res`}
        </div>
        <Button
          disabled={!imageSrc || isProcessing}
          onClick={onDownload}
          className="bg-primary hover:bg-[#828fff] text-white rounded-md font-medium text-xs shadow-xs px-5 h-9 min-w-[190px] shrink-0 justify-center cursor-pointer"
        >
          <Download04Icon className="size-4 mr-1.5 shrink-0" />
          <span>{isProcessing ? "Processing..." : `Download ${selectedPreset.aspectRatio} ${formatLabel}`}</span>
        </Button>
      </div>
    </Card>
  );
}

