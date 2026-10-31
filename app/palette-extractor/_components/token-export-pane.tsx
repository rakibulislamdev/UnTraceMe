"use client";

import React, { useState } from "react";
import { Copy01Icon, CheckmarkCircle02Icon } from "hugeicons-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaletteAnalysisResult } from "@/lib/image-engine/palette-extractor";
import { cn } from "@/lib/utils";

interface TokenExportPaneProps {
  paletteResult: PaletteAnalysisResult | null;
  imageSrc: string | null;
}

type ExportTab = "css" | "tailwind" | "json";

export function TokenExportPane({ paletteResult, imageSrc }: TokenExportPaneProps) {
  const [activeTab, setActiveTab] = useState<ExportTab>("css");
  const [copied, setCopied] = useState<boolean>(false);

  const getCodeContent = () => {
    if (!paletteResult) return "";
    switch (activeTab) {
      case "css":
        return paletteResult.cssVariables;
      case "tailwind":
        return paletteResult.tailwindConfig;
      case "json":
        return paletteResult.jsonTokens;
    }
  };

  const handleCopyCode = () => {
    const code = getCodeContent();
    if (!code) return;
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <Card className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between h-full min-h-[500px]">
      <div>
        {/* Header Tabs */}
        <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
          <div>
            <span className="text-xs font-mono text-primary font-medium">DESIGN TOKEN EXPORT</span>
            <h3 className="text-sm font-semibold text-foreground tracking-tight">
              Ready-to-use Code Tokens
            </h3>
          </div>

          <div className="flex items-center gap-1 bg-secondary/80 p-1 rounded-md border border-border">
            {(["css", "tailwind", "json"] as ExportTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-2.5 py-1 text-xs font-mono rounded transition-colors uppercase cursor-pointer",
                  activeTab === tab
                    ? "bg-primary text-white font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Code Editor Frame with Linear Dark Styling */}
        <div 
          data-lenis-prevent
          className="relative rounded-lg border border-border bg-[#010102] p-4 font-mono text-xs text-foreground overflow-auto overscroll-contain min-h-[340px] max-h-[380px]"
        >
          {paletteResult ? (
            <pre className="text-xs leading-relaxed text-muted-foreground">
              <code>{getCodeContent()}</code>
            </pre>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground text-xs text-center py-24">
              Upload an image to generate CSS variables & design tokens.
            </div>
          )}
        </div>
      </div>

      {/* Action Row */}
      <div className="mt-6 pt-4 border-t border-border flex items-center justify-between">
        <div className="text-xs text-muted-foreground font-mono">
          {paletteResult ? `${paletteResult.dominantColors.length} tokens extracted` : "Waiting for artwork..."}
        </div>
        <Button
          disabled={!paletteResult}
          onClick={handleCopyCode}
          className="bg-primary hover:bg-[#828fff] text-white rounded-md font-medium text-xs shadow-xs px-5 h-9 min-w-[170px] shrink-0 justify-center cursor-pointer"
        >
          {copied ? (
            <>
              <CheckmarkCircle02Icon className="size-4 mr-1.5 text-emerald-400" />
              <span>Copied to Clipboard</span>
            </>
          ) : (
            <>
              <Copy01Icon className="size-4 mr-1.5" />
              <span>Copy {activeTab.toUpperCase()} Tokens</span>
            </>
          )}
        </Button>
      </div>
    </Card>
  );
}

