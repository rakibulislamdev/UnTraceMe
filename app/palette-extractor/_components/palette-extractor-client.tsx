"use client";

import React, { useState } from "react";
import { PaletteUploadPane } from "./palette-upload-pane";
import { PaletteSwatches } from "./palette-swatches";
import { TokenExportPane } from "./token-export-pane";
import {
  extractPaletteFromImage,
  PaletteAnalysisResult,
} from "@/lib/image-engine/palette-extractor";

export function PaletteExtractorClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colorCount, setColorCount] = useState<number>(6);
  const [paletteResult, setPaletteResult] = useState<PaletteAnalysisResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const processImage = async (url: string, count: number) => {
    setIsProcessing(true);
    try {
      const result = await extractPaletteFromImage(url, count);
      setPaletteResult(result);
    } catch {
      // Error handling
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    processImage(url, colorCount);
  };

  const handleColorCountChange = (count: number) => {
    setColorCount(count);
    if (imageSrc) {
      processImage(imageSrc, count);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Upload & Extracted Swatches */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <PaletteUploadPane
          imageSrc={imageSrc}
          selectedFileName={selectedFile?.name}
          onFileSelect={handleFileSelect}
          colorCount={colorCount}
          onColorCountChange={handleColorCountChange}
        />

        {paletteResult && (
          <PaletteSwatches colors={paletteResult.dominantColors} />
        )}
      </div>

      {/* Right Column: Code Token Export Studio */}
      <div className="lg:col-span-7 flex flex-col">
        <TokenExportPane
          paletteResult={paletteResult}
          imageSrc={imageSrc}
        />
      </div>
    </div>
  );
}

