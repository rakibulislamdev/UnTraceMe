"use client";

import React, { useRef, useState } from "react";
import { 
  PlayIcon, 
  PauseIcon, 
  Download04Icon, 
  CheckmarkCircle02Icon,
  VolumeHighIcon,
  Loading03Icon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { AudioProcessingResult } from "@/lib/audio-engine/audio-filter";

interface AudioPlayerPaneProps {
  originalFile: File;
  result: AudioProcessingResult | null;
  isProcessing: boolean;
  processingStep?: string | null;
  onProcess: () => void;
}

export function AudioPlayerPane({
  originalFile,
  result,
  isProcessing,
  processingStep,
  onProcess,
}: AudioPlayerPaneProps) {
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingProcessed, setIsPlayingProcessed] = useState(false);

  const originalAudioRef = useRef<HTMLAudioElement | null>(null);
  const processedAudioRef = useRef<HTMLAudioElement | null>(null);

  const originalUrl = React.useMemo(() => {
    return URL.createObjectURL(originalFile);
  }, [originalFile]);

  const togglePlayOriginal = () => {
    if (!originalAudioRef.current) return;
    if (isPlayingOriginal) {
      originalAudioRef.current.pause();
      setIsPlayingOriginal(false);
    } else {
      if (processedAudioRef.current) {
        processedAudioRef.current.pause();
        setIsPlayingProcessed(false);
      }
      originalAudioRef.current.play();
      setIsPlayingOriginal(true);
    }
  };

  const togglePlayProcessed = () => {
    if (!processedAudioRef.current) return;
    if (isPlayingProcessed) {
      processedAudioRef.current.pause();
      setIsPlayingProcessed(false);
    } else {
      if (originalAudioRef.current) {
        originalAudioRef.current.pause();
        setIsPlayingOriginal(false);
      }
      processedAudioRef.current.play();
      setIsPlayingProcessed(true);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.downloadUrl;
    const baseName = originalFile.name.replace(/\.[^/.]+$/, "");
    a.download = `${baseName}-harmonized.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-border gap-3">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-foreground">
            A/B Acoustic Comparison
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Preview the original synthetic recording against the harmonized analog master
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={onProcess}
            disabled={isProcessing}
            size="sm"
            className="cursor-pointer font-medium"
          >
            {isProcessing ? (
              <>
                <Loading03Icon className="size-4 mr-1.5 animate-spin" />
                <span>Processing DSP...</span>
              </>
            ) : (
              <span>Filter & Harmonize</span>
            )}
          </Button>

          {result && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="cursor-pointer"
            >
              <Download04Icon className="size-4 mr-1.5" />
              <span>Export WAV</span>
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Original Track Card */}
        <div className="p-4 rounded-lg border border-border/80 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground">Original Input Voice</span>
            <span className="text-muted-foreground">Raw Audio</span>
          </div>

          <audio
            ref={originalAudioRef}
            src={originalUrl}
            onEnded={() => setIsPlayingOriginal(false)}
            className="hidden"
          />

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlayOriginal}
              className="size-9 rounded-full p-0 cursor-pointer"
            >
              {isPlayingOriginal ? (
                <PauseIcon className="size-4 text-foreground" />
              ) : (
                <PlayIcon className="size-4 text-foreground ml-0.5" />
              )}
            </Button>
            <div className="text-xs text-muted-foreground">
              {isPlayingOriginal ? "Playing original track..." : "Click to preview original audio"}
            </div>
          </div>
        </div>

        {/* Processed Track Card */}
        <div className="p-4 rounded-lg border border-border/80 bg-muted/20 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-foreground flex items-center gap-1.5">
              <span>Harmonized Voice</span>
              {result && (
                <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
              )}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-medium">
              {result ? "Cleaned & Filtered" : "Pending Processing"}
            </span>
          </div>

          {isProcessing ? (
            <div className="flex items-center gap-2.5 py-1 text-xs text-primary font-medium animate-pulse">
              <Loading03Icon className="size-4 animate-spin text-primary shrink-0" />
              <span>{processingStep || "Applying DSP harmonization filters..."}</span>
            </div>
          ) : result ? (
            <>
              <audio
                ref={processedAudioRef}
                src={result.downloadUrl}
                onEnded={() => setIsPlayingProcessed(false)}
                className="hidden"
              />

              <div className="flex items-center gap-3">
                <Button
                  variant="default"
                  size="sm"
                  onClick={togglePlayProcessed}
                  className="size-9 rounded-full p-0 cursor-pointer"
                >
                  {isPlayingProcessed ? (
                    <PauseIcon className="size-4" />
                  ) : (
                    <PlayIcon className="size-4 ml-0.5" />
                  )}
                </Button>
                <div className="text-xs text-foreground font-medium">
                  {isPlayingProcessed ? "Playing harmonized track..." : "Click to listen to filtered result"}
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-muted-foreground flex items-center gap-2 py-2">
              <VolumeHighIcon className="size-4 opacity-50" />
              <span>Click &quot;Filter & Harmonize&quot; to apply active DSP filters</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
