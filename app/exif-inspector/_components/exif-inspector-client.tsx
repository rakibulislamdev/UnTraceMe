"use client";

import React, { useState } from "react";
import { ExifUploadPane } from "./exif-upload-pane";
import { ExifDetailsPane } from "./exif-details-pane";
import { parseImageExif, ExifParsedData } from "@/lib/image-engine/exif-parser";
import { Card } from "@/components/ui/card";

export function ExifInspectorClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [exifData, setExifData] = useState<ExifParsedData | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    setIsProcessing(true);

    try {
      const parsed = await parseImageExif(file);
      setExifData(parsed);
    } catch {
      setExifData({
        hasExif: false,
        hasGps: false,
        rawMetadata: {},
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Upload */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <ExifUploadPane
          imageSrc={imageSrc}
          selectedFileName={selectedFile?.name}
          onFileSelect={handleFileSelect}
          isProcessing={isProcessing}
        />

        {/* Quick Image Preview */}
        {imageSrc && (
          <Card className="p-6 rounded-xl border border-border bg-card flex-1 flex flex-col justify-between">
            <div>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-tight block mb-4">
                PREVIEW SUBJECT
              </span>
              <div className="w-full aspect-video rounded-lg overflow-hidden bg-[#010102] border border-border flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageSrc}
                  alt="Inspected photo"
                  className="max-h-full max-w-full object-contain rounded shadow-md"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border/50 text-[11px] font-mono text-muted-foreground flex items-center justify-between">
              <span>Status: {exifData?.hasExif ? "Header decoded" : "Analyzing"}</span>
              <span>100% Client-side</span>
            </div>
          </Card>
        )}
      </div>

      {/* Right Column: Geolocation Map & Details */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <ExifDetailsPane data={exifData} imageSrc={imageSrc} />
      </div>
    </div>
  );
}

