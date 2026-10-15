"use client";

import { useRef, useState } from "react";
import { SvgDropzone } from "./svg-dropzone";
import { SvgOptionsPanel } from "./svg-options-panel";
import { SvgResultsPanel } from "./svg-results-panel";
import {
  optimizeSvgFile,
  SvgOptimizerOptions,
  SvgOptimizeResult,
} from "@/lib/image-engine/svg-optimizer";

export function SvgOptimizerClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<SvgOptimizeResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewBg, setPreviewBg] = useState<"checkered" | "light" | "dark">("checkered");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [options, setOptions] = useState<SvgOptimizerOptions>({
    stripComments: true,
    stripMetadata: true,
    stripEditorNamespaces: true,
    stripUselessDefs: true,
    removeHiddenElements: true,
    collapseWhitespace: true,
    precision: 2,
    multipass: true,
  });

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    setResult(null);
  };

  const handleOptimize = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      await new Promise((r) => setTimeout(r, 150));
      const res = await optimizeSvgFile(selectedFile, options);
      setResult(res);
    } catch (err: unknown) {
      console.error("SVG optimization failed:", err);
      alert("Failed to parse and optimize SVG.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.previewUrl;
    a.download = `untraceme-optimized-${result.originalName}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setResult(null);
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Hidden input for change action */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".svg,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.[0]) handleFileSelected(e.target.files[0]);
          e.target.value = "";
        }}
      />

      {/* 1. Dropzone Component */}
      {!selectedFile ? (
        <SvgDropzone
          onFileSelected={handleFileSelected}
          disabled={isProcessing}
        />
      ) : (
        /* 2. Options and Vector Inspection Component */
        <SvgOptionsPanel
          file={selectedFile}
          options={options}
          setOptions={setOptions}
          previewBg={previewBg}
          setPreviewBg={setPreviewBg}
          onOptimize={handleOptimize}
          onClear={handleClear}
          onChangeFile={() => fileInputRef.current?.click()}
          isProcessing={isProcessing}
        />
      )}

      {/* 3. Results Preview, Download & Copy Markup Component */}
      {result && (
        <SvgResultsPanel
          result={result}
          previewBg={previewBg}
          onDownload={handleDownload}
        />
      )}
    </div>
  );
}
