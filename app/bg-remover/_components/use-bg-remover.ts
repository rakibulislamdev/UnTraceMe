"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface UseBgRemoverReturn {
  selectedFile: File | null;
  originalUrl: string | null;
  processedBlob: Blob | null;
  processedUrl: string | null;
  isLoading: boolean;
  displayProgress: number;
  errorMessage: string | null;
  handleImageSelected: (file: File) => void;
  handleClear: () => void;
  handleDownload: (bgColor?: string) => Promise<void>;
}

export function useBgRemover(): UseBgRemoverReturn {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [originalUrl, setOriginalUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [progressPercent, setProgressPercent] = useState<number>(0);
  const [displayProgress, setDisplayProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Smooth incremental progress interpolation to avoid jumping
  useEffect(() => {
    if (!isLoading) {
      setDisplayProgress(0);
      return;
    }

    const interval = setInterval(() => {
      setDisplayProgress((prev) => {
        const target = Math.max(progressPercent, 10);
        if (prev < target) {
          const step = Math.max(1, Math.ceil((target - prev) * 0.15));
          return Math.min(prev + step, target);
        } else if (prev < 92 && target >= prev) {
          // Slowly crawl forward so user always sees natural continuous motion
          return prev + 1;
        }
        return prev;
      });
    }, 60);

    return () => clearInterval(interval);
  }, [isLoading, progressPercent]);

  const handleImageSelected = async (file: File) => {
    // Revoke previous URLs
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);

    const orig = URL.createObjectURL(file);
    setSelectedFile(file);
    setOriginalUrl(orig);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setErrorMessage(null);
    setIsLoading(true);
    setProgressPercent(0);

    try {
      // Dynamic import of background removal
      const { removeBackground } = await import("@imgly/background-removal");

      const outputBlob = await removeBackground(file, {
        proxyToWorker: true,
        device: "gpu",
        progress: (_key: string, current: number, total: number) => {
          if (total > 0) {
            const pct = Math.round((current / total) * 100);
            // Cap raw progress reporting to 95% until outputBlob is actually created
            setProgressPercent(Math.min(95, pct));
          }
        },
        model: "isnet_quint8",
      });

      // Jump to 100% only when the blob has arrived
      setProgressPercent(100);
      setDisplayProgress(100);

      // Brief pause to let user see 100% completion before switching screen
      await new Promise((r) => setTimeout(r, 200));

      const resultUrl = URL.createObjectURL(outputBlob);
      setProcessedBlob(outputBlob);
      setProcessedUrl(resultUrl);
      setIsLoading(false);
      setProgressPercent(0);
      toast.success("Background removed successfully!");
    } catch (err: unknown) {
      console.error("Background removal failed:", err);
      const msg = err instanceof Error ? err.message : "Failed to process image locally.";
      setErrorMessage(`Error: ${msg}. Please try with another image.`);
      toast.error("Background removal failed.");
      setIsLoading(false);
      setProgressPercent(0);
    }
  };

  const handleClear = () => {
    if (originalUrl) URL.revokeObjectURL(originalUrl);
    if (processedUrl) URL.revokeObjectURL(processedUrl);
    setSelectedFile(null);
    setOriginalUrl(null);
    setProcessedBlob(null);
    setProcessedUrl(null);
    setErrorMessage(null);
  };

  const handleDownload = async (bgColor: string = "transparent") => {
    if (!processedBlob || !selectedFile) return;

    try {
      const isTransparent = !bgColor || bgColor === "transparent";

      if (isTransparent) {
        const link = document.createElement("a");
        link.href = URL.createObjectURL(processedBlob);
        link.download = `untraceme-${selectedFile.name.replace(/\.[^/.]+$/, "")}-no-bg.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        toast.success("Image downloaded successfully!");
        return;
      }

      // Draw onto canvas to composite with custom background color
      const img = new Image();
      const blobUrl = URL.createObjectURL(processedBlob);
      img.src = blobUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
      });

      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext("2d");

      if (!ctx) throw new Error("Could not create canvas context");

      // Fill selected background color
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw cutout image on top
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = `untraceme-${selectedFile.name.replace(/\.[^/.]+$/, "")}-colored.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(link.href);
        URL.revokeObjectURL(blobUrl);
        toast.success("Image downloaded successfully!");
      }, "image/png");
    } catch (e) {
      console.error("Export error:", e);
      toast.error("Failed to export image.");
    }
  };

  return {
    selectedFile,
    originalUrl,
    processedBlob,
    processedUrl,
    isLoading,
    displayProgress,
    errorMessage,
    handleImageSelected,
    handleClear,
    handleDownload,
  };
}
