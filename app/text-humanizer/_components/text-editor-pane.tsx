"use client";

import React, { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  FileEditIcon, 
  Copy01Icon, 
  Delete02Icon, 
  CheckmarkCircle02Icon,
  Download04Icon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";

interface TextEditorPaneProps {
  inputText: string;
  setInputText: (text: string) => void;
  outputText: string;
  isProcessing: boolean;
  onDownload?: () => void;
}

export function TextEditorPane({
  inputText,
  setInputText,
  outputText,
  isProcessing,
  onDownload,
}: TextEditorPaneProps) {
  const [copied, setCopied] = useState(false);

  const inputWordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
  const inputCharCount = inputText.length;

  const outputWordCount = outputText.trim() ? outputText.trim().split(/\s+/).length : 0;

  const handleCopy = async () => {
    if (!outputText) return;
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-stretch">
      {/* Input AI Text Column */}
      <div className="flex flex-col h-[460px] rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Header Bar - Fixed height h-12 */}
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border bg-muted/40 text-xs">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <FileEditIcon className="size-4 text-muted-foreground" />
            <span>Original AI Content</span>
          </div>
          {inputText && (
            <Button
              variant="ghost"
              size="xs"
              onClick={() => setInputText("")}
              className="text-muted-foreground hover:text-destructive gap-1"
            >
              <Delete02Icon className="size-3.5" />
              Clear
            </Button>
          )}
        </div>

        {/* Content Body - Fill remaining space with scrolling */}
        <div className="flex-1 min-h-0 relative">
          <Textarea
            placeholder="Paste AI-generated text here (from ChatGPT, Claude, Gemini, etc.)..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="w-full h-full resize-none border-0 p-4 text-sm leading-relaxed focus-visible:ring-0 shadow-none rounded-none bg-transparent overflow-y-auto"
          />
        </div>

        {/* Footer Bar - Fixed height h-10 */}
        <div className="h-10 shrink-0 flex items-center justify-between px-4 border-t border-border bg-muted/20 text-xs text-muted-foreground tabular-nums">
          <span>Words: {inputWordCount}</span>
          <span>Characters: {inputCharCount}</span>
        </div>
      </div>

      {/* Output Humanized Column */}
      <div className="flex flex-col h-[460px] rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {/* Header Bar - Fixed height h-12 */}
        <div className="h-12 shrink-0 flex items-center justify-between px-4 border-b border-border bg-muted/40 text-xs">
          <div className="flex items-center gap-2 font-medium text-foreground">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Humanized Untraceable Result</span>
          </div>
          {outputText && (
            <div className="flex items-center gap-1.5">
              <Button
                variant="outline"
                size="xs"
                onClick={handleCopy}
                className="gap-1.5 text-xs font-medium"
              >
                {copied ? (
                  <>
                    <CheckmarkCircle02Icon className="size-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy01Icon className="size-3.5" />
                    Copy
                  </>
                )}
              </Button>

              {onDownload && (
                <Button
                  variant="outline"
                  size="xs"
                  onClick={onDownload}
                  className="gap-1.5 text-xs font-medium text-foreground hover:bg-muted"
                >
                  <Download04Icon className="size-3.5" />
                  Download
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Content Body - Fill remaining space with scrolling */}
        <div className="flex-1 min-h-0 p-4 text-sm leading-relaxed overflow-y-auto">
          {isProcessing ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4 py-8 text-muted-foreground">
              <div className="flex items-center gap-1.5 p-3 rounded-full bg-accent/40 border border-border">
                <span className="size-2 rounded-full bg-primary animate-claude-dot-1" />
                <span className="size-2 rounded-full bg-primary animate-claude-dot-2" />
                <span className="size-2 rounded-full bg-primary animate-claude-dot-3" />
              </div>
              <div className="flex flex-col items-center gap-1 text-center">
                <p className="text-xs font-medium text-foreground tracking-wide">
                  UnTraceMe Cadence Engine
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Restructuring syntactic tokens & expanding perplexity...
                </p>
              </div>
            </div>
          ) : outputText ? (
            <div className="whitespace-pre-wrap text-foreground select-text">
              {outputText}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-8 text-muted-foreground">
              <p className="text-xs max-w-xs leading-relaxed">
                Your restructured, human-sounding text will appear here with zero detectable AI artifacts.
              </p>
            </div>
          )}
        </div>

        {/* Footer Bar - Fixed height h-10 */}
        <div className="h-10 shrink-0 flex items-center justify-between px-4 border-t border-border bg-muted/20 text-xs text-muted-foreground tabular-nums">
          <span>Output Words: {outputWordCount}</span>
          {outputText && (
            <Badge variant="outline" className="text-[10px] text-emerald-600 dark:text-emerald-400 border-emerald-500/20 bg-emerald-500/5">
              96% Human Cadence
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
