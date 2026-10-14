"use client";

import React from "react";
import { 
  FileEditIcon, 
  SparklesIcon, 
  Delete02Icon, 
  Copy01Icon, 
  ArrowRight01Icon,
  CheckmarkCircle02Icon 
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PromptEditorPaneProps {
  inputPrompt: string;
  setInputPrompt: (val: string) => void;
  outputPrompt: string;
  isProcessing: boolean;
  onClearInput: () => void;
}

export function PromptEditorPane({
  inputPrompt,
  setInputPrompt,
  outputPrompt,
  isProcessing,
  onClearInput,
}: PromptEditorPaneProps) {
  const inputCharCount = inputPrompt.length;
  const inputWordCount = inputPrompt.trim() ? inputPrompt.trim().split(/\s+/).length : 0;

  const outputCharCount = outputPrompt.length;
  const outputWordCount = outputPrompt.trim() ? outputPrompt.trim().split(/\s+/).length : 0;

  const [paneCopied, setPaneCopied] = React.useState(false);

  const copyCleaned = () => {
    if (!outputPrompt) return;
    navigator.clipboard.writeText(outputPrompt);
    setPaneCopied(true);
    setTimeout(() => setPaneCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-1">
      {/* Left Pane: Raw / Dirty Prompt Input */}
      <div className="flex flex-col h-[480px] rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <FileEditIcon className="size-4 text-muted-foreground" />
            <span className="text-xs font-semibold text-foreground tracking-tight">
              Original / Contaminated Prompt
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{inputWordCount} words</span>
            <span className="text-border">|</span>
            <span>{inputCharCount} chars</span>
            {inputPrompt.length > 0 && (
              <button
                type="button"
                onClick={onClearInput}
                className="text-muted-foreground hover:text-destructive transition-colors ml-1 cursor-pointer"
                title="Clear input"
              >
                <Delete02Icon className="size-3.5" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 relative">
          <textarea
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            placeholder="Paste your raw prompt here... (e.g., prompts containing jailbreak preambles, watermark tokens, API keys, or Midjourney tags)"
            className="w-full h-full p-4 bg-transparent text-sm text-foreground resize-none focus:outline-none placeholder:text-muted-foreground/60 leading-relaxed font-mono overflow-y-auto"
            disabled={isProcessing}
            data-lenis-prevent
          />
        </div>
      </div>

      {/* Right Pane: Scrubbed / Sanitized Prompt Output */}
      <div className="flex flex-col h-[480px] rounded-xl border border-border bg-card shadow-xs overflow-hidden">
        <div className="h-11 shrink-0 flex items-center justify-between px-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-2">
            <SparklesIcon className="size-4 text-primary" />
            <span className="text-xs font-semibold text-foreground tracking-tight">
              Scrubbed & Sanitized Output
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span>{outputWordCount} words</span>
            <span className="text-border">|</span>
            <span>{outputCharCount} chars</span>
            {outputPrompt.length > 0 && (
              <button
                type="button"
                onClick={copyCleaned}
                className={cn(
                  "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all duration-150 cursor-pointer border shadow-2xs select-none",
                  paneCopied
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 scale-102"
                    : "bg-background hover:bg-muted text-foreground border-border hover:border-border/80 active:scale-97"
                )}
                title="Copy sanitized prompt"
              >
                {paneCopied ? (
                  <>
                    <CheckmarkCircle02Icon className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy01Icon className="size-3.5 text-muted-foreground" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 min-h-0 relative bg-muted/10">
          {outputPrompt ? (
            <textarea
              readOnly
              value={outputPrompt}
              className="w-full h-full p-4 bg-transparent text-sm text-foreground resize-none focus:outline-none placeholder:text-muted-foreground/50 leading-relaxed font-mono overflow-y-auto"
              data-lenis-prevent
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-muted-foreground">
              <div className="size-10 rounded-full bg-muted flex items-center justify-center mb-3">
                <ArrowRight01Icon className="size-5 text-muted-foreground/70" />
              </div>
              <p className="text-xs font-medium text-foreground">Awaiting Scrubbing</p>
              <p className="text-[11px] text-muted-foreground max-w-xs mt-1">
                Enter your prompt on the left and click &quot;Scrub Prompt&quot; to strip injection attacks, watermarks, and leaks.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
