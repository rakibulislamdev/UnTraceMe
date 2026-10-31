"use client";

import React, { useState, useCallback } from "react";
import { Area, Point } from "react-easy-crop";
import { SOCIAL_PRESETS, SocialPreset } from "@/lib/image-engine/social-presets";
import { CropperUploadPane } from "./cropper-upload-pane";
import { CropperPresetSelector } from "./cropper-preset-selector";
import { CropperPreviewPane } from "./cropper-preview-pane";

export function SocialCropperClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number } | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<SocialPreset>(SOCIAL_PRESETS[0]);
  
  // Cropper Controls State
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // File selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setImageSrc(url);

    const img = new Image();
    img.onload = () => {
      setNaturalDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      setCrop({ x: 0, y: 0 });
      setZoom(1);
    };
    img.src = url;
  };

  const handleSelectPreset = (preset: SocialPreset) => {
    setSelectedPreset(preset);
    setCrop({ x: 0, y: 0 });
  };

  const onCropComplete = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Format label for button
  const fileExt = selectedFile?.name.split(".").pop()?.toLowerCase();
  const formatLabel = fileExt === "jpg" || fileExt === "jpeg" ? "JPG" : fileExt === "webp" ? "WEBP" : "PNG";

  // Export engine
  const handleDownload = async () => {
    if (!imageSrc || !croppedAreaPixels || !selectedPreset) return;
    setIsProcessing(true);

    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = selectedPreset.width;
      canvas.height = selectedPreset.height;
      const ctx = canvas.getContext("2d");

      if (!ctx) {
        setIsProcessing(false);
        return;
      }

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = "high";

      ctx.drawImage(
        img,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        selectedPreset.width,
        selectedPreset.height
      );

      const originalType = selectedFile?.type || "image/jpeg";
      const isJpeg = originalType.includes("jpeg") || originalType.includes("jpg");
      const exportMime = isJpeg ? "image/jpeg" : originalType === "image/webp" ? "image/webp" : "image/png";
      const exportExt = isJpeg ? "jpg" : originalType === "image/webp" ? "webp" : "png";

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          const originalName = selectedFile ? selectedFile.name.replace(/\.[^/.]+$/, "") : "image";
          a.download = `untraceme-${originalName}-${selectedPreset.id}.${exportExt}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }
        setIsProcessing(false);
      }, exportMime, 0.95);
    } catch {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Upload & Presets */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <CropperUploadPane
          imageSrc={imageSrc}
          selectedFileName={selectedFile?.name}
          dimensions={naturalDimensions}
          onFileSelect={handleFileSelect}
        />

        <CropperPresetSelector
          selectedPreset={selectedPreset}
          onSelectPreset={handleSelectPreset}
          zoom={zoom}
          onZoomChange={setZoom}
          hasImage={Boolean(imageSrc)}
          className="flex-1 flex flex-col justify-between"
        />
      </div>

      {/* Right Column: Interactive Studio & Export */}
      <div className="lg:col-span-7 flex flex-col">
        <CropperPreviewPane
          imageSrc={imageSrc}
          crop={crop}
          zoom={zoom}
          selectedPreset={selectedPreset}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          isProcessing={isProcessing}
          onDownload={handleDownload}
          formatLabel={formatLabel}
          className="h-full"
        />
      </div>
    </div>
  );
}
