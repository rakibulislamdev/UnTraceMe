"use client";

import React, { useRef, useState } from "react";
import { 
  AiVoiceIcon, 
  Upload01Icon, 
  Delete02Icon, 
  MusicNote01Icon,
  SparklesIcon 
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AudioDropzoneProps {
  selectedFile: File | null;
  onSelectFile: (file: File) => void;
  onClearFile: () => void;
  onLoadDemo?: () => void;
  onError?: (msg: string) => void;
  disabled?: boolean;
  isExiting?: boolean;
}

// Supported audio extensions and MIME types
const VALID_AUDIO_EXTENSIONS = /\.(mp3|wav|ogg|m4a|aac|flac|wma|aiff)$/i;

export function AudioDropzone({
  selectedFile,
  onSelectFile,
  onClearFile,
  onLoadDemo,
  onError,
  disabled = false,
  isExiting = false,
}: AudioDropzoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndSelect = (file: File) => {
    const isAudioMime = file.type.startsWith("audio/") || file.type === "application/ogg";
    const isAudioExt = VALID_AUDIO_EXTENSIONS.test(file.name);

    if (!isAudioMime && !isAudioExt) {
      onError?.(`Invalid file type: "${file.name}". Only audio files (.mp3, .wav, .m4a, .ogg, .aac) are permitted.`);
      return;
    }

    onSelectFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSelect(e.target.files[0]);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
        className="hidden"
        onChange={handleFileChange}
      />

      <AnimatePresence mode="wait">
        {!selectedFile ? (
          <motion.div
            key="empty-dropzone"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => !disabled && fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center p-8 sm:p-12 border border-dashed rounded-xl transition-colors duration-150 text-center select-none cursor-pointer",
              isDragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:bg-muted/30 hover:border-border/80",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className="size-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-3">
              <Upload01Icon className="size-6" />
            </div>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Drop an AI Voice Recording or Click to Browse
            </h3>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Supports MP3, WAV, AAC, M4A, and OGG formats up to 50MB. Processed completely in-browser.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
              <span className="text-[11px] px-2.5 py-1 rounded-md bg-muted text-muted-foreground font-mono">
                MP3 / WAV / M4A / AAC
              </span>
              {onLoadDemo && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onLoadDemo();
                  }}
                  className="text-xs border-primary/30 text-primary hover:bg-primary/10 cursor-pointer h-7 shadow-2xs"
                >
                  <SparklesIcon className="size-3.5 mr-1 text-primary" />
                  <span>Load Demo AI Voice</span>
                </Button>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="loaded-file-card"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-between p-4 rounded-xl border border-border bg-card shadow-xs"
          >
            <div className="flex items-center gap-3 min-w-0 pr-3">
              <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <MusicNote01Icon className="size-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">
                  {selectedFile.name}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {formatFileSize(selectedFile.size)} • Ready for frequency filtering
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="text-xs cursor-pointer"
              >
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClearFile}
                disabled={disabled}
                className="text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer"
              >
                <Delete02Icon className="size-3.5 mr-1" />
                Remove
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
