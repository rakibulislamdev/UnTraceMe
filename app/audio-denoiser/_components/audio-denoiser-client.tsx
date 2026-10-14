"use client";

import React, { useState } from "react";
import { AudioDropzone } from "./audio-dropzone";
import { AudioFilterControls } from "./audio-filter-controls";
import { AudioPlayerPane } from "./audio-player-pane";
import { 
  AudioFilterOptions, 
  AudioProcessingResult, 
  processAudioArtifacts,
  generateSyntheticSampleAudio 
} from "@/lib/audio-engine/audio-filter";
import { AlertCircleIcon } from "hugeicons-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export function AudioDenoiserClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<AudioProcessingResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [options, setOptions] = useState<AudioFilterOptions>({
    metallicNotch: true,
    ultrasonicCutoff: true,
    subBassRumble: true,
    analogWarmth: true,
    intensity: 75,
  });

  const handleSelectFile = (file: File) => {
    setSelectedFile(file);
    setResult(null);
    setErrorMessage(null);
  };

  const handleLoadDemo = async () => {
    try {
      const res = await fetch("/samples/demo-ai-voice.wav");
      if (!res.ok) throw new Error("Sample file not found");
      const blob = await res.blob();
      const demoFile = new File([blob], "demo-ai-voiceover.wav", { type: "audio/wav" });
      setSelectedFile(demoFile);
      setResult(null);
      setErrorMessage(null);
    } catch {
      // Fallback in-memory generator
      const demoFile = generateSyntheticSampleAudio();
      setSelectedFile(demoFile);
      setResult(null);
      setErrorMessage(null);
    }
  };

  const handleClearFile = () => {
    setSelectedFile(null);
    setResult(null);
    setErrorMessage(null);
  };

  const [processingStep, setProcessingStep] = useState<string | null>(null);

  const handleProcess = async () => {
    if (!selectedFile) return;
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      setProcessingStep("Analyzing frequency spectrum...");
      await new Promise((r) => setTimeout(r, 450));

      setProcessingStep("Suppressing metallic peaks & 3.4kHz notch...");
      await new Promise((r) => setTimeout(r, 550));

      setProcessingStep("Truncating ultrasonic watermarks & applying analog warmth...");
      const res = await processAudioArtifacts(selectedFile, options);
      await new Promise((r) => setTimeout(r, 400));

      setResult(res);
    } catch (err) {
      console.error("DSP processing error:", err);
      setErrorMessage("Failed to process audio file. Please check file format and try again.");
    } finally {
      setIsProcessing(false);
      setProcessingStep(null);
    }
  };

  return (
    <div className="space-y-6 flex-1">
      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      {/* File Dropzone */}
      <AudioDropzone
        selectedFile={selectedFile}
        onSelectFile={handleSelectFile}
        onClearFile={handleClearFile}
        onLoadDemo={handleLoadDemo}
        onError={(msg) => setErrorMessage(msg)}
        disabled={isProcessing}
      />

      {/* When a file is loaded, reveal the DSP controls and comparative player */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            key="dsp-controls-panel"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <AudioFilterControls
              options={options}
              setOptions={setOptions}
              disabled={isProcessing}
            />

            <AudioPlayerPane
              originalFile={selectedFile}
              result={result}
              isProcessing={isProcessing}
              processingStep={processingStep}
              onProcess={handleProcess}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
