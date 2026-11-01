"use client";

import React, { useState } from "react";
import { VideoUploadPane } from "./video-upload-pane";
import { VideoPreviewPane } from "./video-preview-pane";
import { VideoAuditPane } from "./video-audit-pane";
import {
  inspectVideoMetadata,
  sanitizeVideoFile,
  VideoMetadataReport,
} from "@/lib/video-engine/video-sanitizer";

export function VideoSanitizerClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [sanitizedSrc, setSanitizedSrc] = useState<string | null>(null);
  const [report, setReport] = useState<VideoMetadataReport | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSanitized, setIsSanitized] = useState<boolean>(false);
  const [removedCount, setRemovedCount] = useState<number>(0);

  const handleFileSelect = async (file: File) => {
    setSelectedFile(file);
    setIsSanitized(false);
    setSanitizedSrc(null);
    setRemovedCount(0);

    const url = URL.createObjectURL(file);
    setVideoSrc(url);
    setIsProcessing(true);

    try {
      const rep = await inspectVideoMetadata(file);
      setReport(rep);
    } catch {
      setReport({
        format: "mp4",
        originalSizeBytes: file.size,
        detectedTags: [],
        hasGps: false,
        hasAiTraces: false,
        hasHardwareTraces: false,
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSanitize = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);

    try {
      const result = await sanitizeVideoFile(selectedFile, {
        stripGps: true,
        stripAiProvenance: true,
        stripEncoderHardware: true,
        stripXmp: true,
      });

      const scrubbedUrl = URL.createObjectURL(result.sanitizedBlob);
      setSanitizedSrc(scrubbedUrl);
      setRemovedCount(result.removedCount);
      setIsSanitized(true);
    } catch (err) {
      console.error("Video sanitization failed:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setVideoSrc(null);
    setSanitizedSrc(null);
    setReport(null);
    setIsSanitized(false);
    setRemovedCount(0);
  };

  const downloadFileName = selectedFile
    ? `untraceme-clean-${selectedFile.name}`
    : "untraceme-sanitized-video.mp4";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Left Column: Upload & Video Player */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <VideoUploadPane
          selectedFile={selectedFile}
          videoSrc={videoSrc}
          onFileSelect={handleFileSelect}
          onSanitize={handleSanitize}
          isProcessing={isProcessing}
          isSanitized={isSanitized}
          onReset={handleReset}
        />

        <VideoPreviewPane
          videoSrc={videoSrc}
          sanitizedSrc={sanitizedSrc}
          report={report}
          isProcessing={isProcessing}
          isSanitized={isSanitized}
          downloadFileName={downloadFileName}
        />
      </div>

      {/* Right Column: Forensic Container Audit & Security Telemetry */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <VideoAuditPane
          report={report}
          isSanitized={isSanitized}
          removedCount={removedCount}
        />
      </div>
    </div>
  );
}

