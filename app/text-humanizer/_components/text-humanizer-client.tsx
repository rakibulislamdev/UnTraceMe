"use client";

import React, { useState } from "react";
import { TextEditorPane } from "./text-editor-pane";
import { BypassControls, HumanizeMode } from "./bypass-controls";
import { TextToolbar } from "./text-toolbar";
import { PerplexityMeter } from "./perplexity-meter";
import { AlertCircleIcon } from "hugeicons-react";

export function TextHumanizerClient() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [mode, setMode] = useState<HumanizeMode>("natural");
  const [isProcessing, setIsProcessing] = useState(false);
  const [score, setScore] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleHumanize = async () => {
    setErrorMessage(null);
    const trimmed = inputText.trim();

    // Client-side quick validation
    if (trimmed.length < 10) {
      setErrorMessage("Please enter at least 10 characters of AI-generated text.");
      return;
    }
    if (trimmed.length > 15000) {
      setErrorMessage("Text limit exceeded: Maximum 15,000 characters allowed per submission.");
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch("/api/humanize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed, mode }),
      });

      const data = await response.json();

      if (response.ok) {
        setOutputText(data.result);
        setScore(data.score || 94);
      } else {
        setErrorMessage(data.error || "Failed to humanize text. Please try again.");
      }
    } catch (err) {
      console.error("Request failed:", err);
      setErrorMessage("Network error occurred while contacting humanizer engine.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    setScore(0);
    setErrorMessage(null);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const dateStr = new Date().toISOString().slice(0, 10);
    const filename = `untraceme-${mode}-${dateStr}.txt`;
    
    const blob = new Blob([outputText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = filename;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 flex-1">
      {/* Validation Error Toast Banner */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive text-xs flex items-center gap-2.5 animate-in fade-in">
          <AlertCircleIcon className="size-4 shrink-0" />
          <span className="font-medium">{errorMessage}</span>
        </div>
      )}

      <BypassControls
        mode={mode}
        setMode={setMode}
        disabled={isProcessing}
      />

      <TextToolbar
        onHumanize={handleHumanize}
        onClear={handleClear}
        onDownload={handleDownload}
        isProcessing={isProcessing}
        canHumanize={inputText.trim().length >= 10}
        hasOutput={outputText.length > 0}
      />

      <TextEditorPane
        inputText={inputText}
        setInputText={(txt) => {
          setInputText(txt);
          if (errorMessage) setErrorMessage(null);
        }}
        outputText={outputText}
        isProcessing={isProcessing}
        onDownload={handleDownload}
      />

      <PerplexityMeter
        score={score}
        burstinessGrade="High"
        hasText={outputText.length > 0}
      />
    </div>
  );
}
