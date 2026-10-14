"use client";

import React, { useState, useEffect, useCallback, useTransition, useRef } from "react";
import { FaviconDropzone } from "./favicon-dropzone";
import { FaviconControls } from "./favicon-controls";
import { FaviconResults } from "./favicon-results";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RenderOptions, 
  GeneratedIconResult, 
  FAVICON_PRESETS, 
  renderSingleIconCanvas, 
  createIcoFromPngs,
  generateSiteWebmanifest,
  generateHeadHtmlSnippet
} from "@/lib/image-engine/favicon-generator";

export function FaviconGeneratorClient() {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourcePreviewUrl, setSourcePreviewUrl] = useState<string | null>(null);
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);

  const [options, setOptions] = useState<RenderOptions>({
    paddingPercent: 5,
    backgroundColor: "transparent",
    borderRadiusPercent: 0,
  });

  const [appName, setAppName] = useState("My Application");
  const [themeColor, setThemeColor] = useState("#0f172a");

  const [generatedIcons, setGeneratedIcons] = useState<GeneratedIconResult[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);
  const [, startTransition] = useTransition();

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load image element when sourceFile changes
  const handleFileSelect = (file: File) => {
    if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
    
    const url = URL.createObjectURL(file);
    setSourceFile(file);
    setSourcePreviewUrl(url);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      setSourceImage(img);
    };
    img.src = url;
  };

  const handleClear = () => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    if (sourcePreviewUrl) URL.revokeObjectURL(sourcePreviewUrl);
    generatedIcons.forEach((i) => URL.revokeObjectURL(i.previewUrl));

    setSourceFile(null);
    setSourcePreviewUrl(null);
    setSourceImage(null);
    setGeneratedIcons([]);
  };

  // Re-generate icons whenever image or options change (Debounced for smooth 60fps sliding)
  const renderIcons = useCallback(async () => {
    if (!sourceImage) return;

    setIsGenerating(true);

    try {
      const results: GeneratedIconResult[] = [];
      const pngEntriesForIco: { size: number; blob: Blob }[] = [];

      // 1. Generate PNGs for each preset
      for (const preset of FAVICON_PRESETS) {
        if (preset.format === "png") {
          const blob = await renderSingleIconCanvas(
            sourceImage,
            preset.width,
            preset.height,
            options
          );

          const previewUrl = URL.createObjectURL(blob);
          results.push({
            preset,
            blob,
            previewUrl,
            sizeBytes: blob.size,
          });

          // Save 16, 32, 48 for ICO packing
          if (preset.width === 16 || preset.width === 32 || preset.width === 48) {
            pngEntriesForIco.push({ size: preset.width, blob });
          }
        }
      }

      // 2. Generate multi-resolution favicon.ico
      const icoPreset = FAVICON_PRESETS.find((p) => p.format === "ico");
      if (icoPreset && pngEntriesForIco.length > 0) {
        const icoBlob = await createIcoFromPngs(pngEntriesForIco);
        const icoPreview = URL.createObjectURL(icoBlob);
        results.unshift({
          preset: icoPreset,
          blob: icoBlob,
          previewUrl: icoPreview,
          sizeBytes: icoBlob.size,
        });
      }

      startTransition(() => {
        setGeneratedIcons((prev) => {
          prev.forEach((icon) => URL.revokeObjectURL(icon.previewUrl));
          return results;
        });
        setIsGenerating(false);
      });
    } catch (err) {
      console.error("Error generating icons:", err);
      setIsGenerating(false);
    }
  }, [sourceImage, options]);

  useEffect(() => {
    if (!sourceImage) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      renderIcons();
    }, 150);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [sourceImage, options, renderIcons]);

  // Packaging all assets into a single ZIP bundle
  const handleDownloadZip = async () => {
    if (generatedIcons.length === 0) return;
    setIsDownloadingZip(true);

    try {
      const { default: JSZip } = await import("jszip");
      const zip = new JSZip();

      for (const item of generatedIcons) {
        zip.file(item.preset.filename, item.blob);
      }

      zip.file("site.webmanifest", generateSiteWebmanifest(appName, themeColor));
      zip.file("favicon-head-tags.html", generateHeadHtmlSnippet(themeColor));

      const content = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      const zipUrl = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = zipUrl;
      link.download = `untraceme-favicon-pack-${Date.now()}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(zipUrl);
    } catch (err) {
      console.error("Failed to generate ZIP pack:", err);
    } finally {
      setIsDownloadingZip(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <FaviconDropzone
        sourceFile={sourceFile}
        previewUrl={sourcePreviewUrl}
        onFileSelect={handleFileSelect}
        onClear={handleClear}
      />

      {/* When image is loaded, smoothly animate appearance/removal of controls and results */}
      <AnimatePresence>
        {sourceFile && (
          <motion.div
            key="workspace-sections"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="space-y-6"
          >
            <FaviconControls
              options={options}
              appName={appName}
              themeColor={themeColor}
              previewUrl={sourcePreviewUrl}
              onChangeOptions={(newOpts) => setOptions((prev) => ({ ...prev, ...newOpts }))}
              onChangeAppName={setAppName}
              onChangeThemeColor={setThemeColor}
              isGenerating={isGenerating}
            />

            <FaviconResults
              icons={generatedIcons}
              appName={appName}
              themeColor={themeColor}
              onDownloadZip={handleDownloadZip}
              isDownloadingZip={isDownloadingZip}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
