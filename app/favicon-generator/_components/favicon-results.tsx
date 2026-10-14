"use client";

import React, { useState } from "react";
import { 
  Download04Icon, 
  Copy01Icon, 
  CheckmarkCircle02Icon, 
  CodeCircleIcon,
  Layers01Icon,
  AppleIcon,
  SmartPhone01Icon,
  ComputerIcon,
  GlobeIcon
} from "hugeicons-react";
import { Button } from "@/components/ui/button";
import { GeneratedIconResult, generateHeadHtmlSnippet, generateSiteWebmanifest } from "@/lib/image-engine/favicon-generator";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FaviconResultsProps {
  icons: GeneratedIconResult[];
  appName: string;
  themeColor: string;
  onDownloadZip: () => void;
  isDownloadingZip: boolean;
}

export function FaviconResults({
  icons,
  appName,
  themeColor,
  onDownloadZip,
  isDownloadingZip,
}: FaviconResultsProps) {
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const [copiedManifest, setCopiedManifest] = useState(false);
  const [activeTab, setActiveTab] = useState<"grid" | "code">("grid");

  const headHtml = generateHeadHtmlSnippet(themeColor);
  const manifestJson = generateSiteWebmanifest(appName, themeColor);

  const handleCopy = (text: string, type: "snippet" | "manifest") => {
    navigator.clipboard.writeText(text);
    if (type === "snippet") {
      setCopiedSnippet(true);
      setTimeout(() => setCopiedSnippet(false), 2000);
    } else {
      setCopiedManifest(true);
      setTimeout(() => setCopiedManifest(false), 2000);
    }
  };

  const handleDownloadSingle = (icon: GeneratedIconResult) => {
    const link = document.createElement("a");
    link.href = icon.previewUrl;
    link.download = icon.preset.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const categories = [
    { id: "browser", label: "Browser & Desktop", icon: GlobeIcon },
    { id: "apple", label: "Apple iOS", icon: AppleIcon },
    { id: "android", label: "Android PWA", icon: SmartPhone01Icon },
    { id: "windows", label: "Windows Metro", icon: ComputerIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Top Action Bar with Segmented Switcher & Master ZIP Download */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-4">
        {/* Unified Apple-style Segmented Glass Tab Container */}
        <div className="relative inline-flex items-center p-1 rounded-full bg-secondary/80 border border-border/60 shadow-inner backdrop-blur-md select-none">
          <button
            type="button"
            onClick={() => setActiveTab("grid")}
            className={cn(
              "relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 select-none cursor-pointer",
              activeTab === "grid"
                ? "text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {activeTab === "grid" && (
              <motion.div
                layoutId="apple-favicon-results-tab"
                className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-xs"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 38,
                  mass: 0.8,
                }}
              />
            )}
            <Layers01Icon className={cn("size-3.5 -mt-px shrink-0", activeTab === "grid" ? "text-primary-foreground" : "text-muted-foreground")} />
            <span>Generated Assets</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={cn(
              "relative z-10 inline-flex items-center gap-1.5 px-3.5 py-1 text-xs font-medium rounded-full transition-colors duration-200 select-none cursor-pointer",
              activeTab === "code"
                ? "text-primary-foreground font-semibold"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {activeTab === "code" && (
              <motion.div
                layoutId="apple-favicon-results-tab"
                className="absolute inset-0 z-[-1] rounded-full bg-primary shadow-xs"
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 38,
                  mass: 0.8,
                }}
              />
            )}
            <CodeCircleIcon className={cn("size-3.5 -mt-px shrink-0", activeTab === "code" ? "text-primary-foreground" : "text-muted-foreground")} />
            <span>HTML & Manifest Code</span>
          </button>
        </div>

        <Button
          onClick={onDownloadZip}
          disabled={isDownloadingZip || icons.length === 0}
          className="w-full sm:w-auto h-9 text-xs px-5 shadow-sm"
        >
          <Download04Icon className="size-4 mr-1.5" />
          {isDownloadingZip ? "Packaging ZIP..." : "Download Complete Icon Pack (ZIP)"}
        </Button>
      </div>

      {activeTab === "grid" ? (
        <div className="space-y-6">
          {categories.map((cat) => {
            const catIcons = icons.filter((i) => i.preset.category === cat.id);
            if (catIcons.length === 0) return null;

            const CatIconComponent = cat.icon;

            return (
              <div key={cat.id} className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                  <CatIconComponent className="size-3.5 text-primary" />
                  <span>{cat.label}</span>
                  <span className="text-muted-foreground font-normal">({catIcons.length})</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {catIcons.map((icon) => (
                    <div
                      key={icon.preset.id}
                      className="border border-border rounded-xl p-3 bg-card/60 hover:bg-card/90 transition-all flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Checkerboard preview container */}
                        <div className="size-12 rounded-lg border border-border bg-[linear-gradient(45deg,#ccc_25%,transparent_25%),linear-gradient(-45deg,#ccc_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#ccc_75%),linear-gradient(-45deg,transparent_75%,#ccc_75%)] bg-[size:8px_8px] dark:bg-[linear-gradient(45deg,#222_25%,transparent_25%),linear-gradient(-45deg,#222_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#222_75%),linear-gradient(-45deg,transparent_75%,#222_75%)] flex items-center justify-center p-1 shrink-0 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={icon.previewUrl}
                            alt={icon.preset.filename}
                            className="max-w-full max-h-full object-contain"
                          />
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-semibold text-foreground truncate">
                            {icon.preset.filename}
                          </p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-muted-foreground">
                              {icon.preset.width}×{icon.preset.height} px
                            </span>
                            <span className="text-[10px] text-muted-foreground">•</span>
                            <span className="text-[10px] font-mono text-muted-foreground">
                              {(icon.sizeBytes / 1024).toFixed(1)} KB
                            </span>
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => handleDownloadSingle(icon)}
                        title={`Download ${icon.preset.filename}`}
                        className="opacity-80 group-hover:opacity-100 hover:bg-primary/10 hover:text-primary transition-opacity"
                      >
                        <Download04Icon className="size-3.5" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* HTML Meta Tag Block */}
          <div className="border border-border rounded-xl p-5 bg-card/60 backdrop-blur-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">HTML &lt;head&gt; Integration</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(headHtml, "snippet")}
                  className="h-7 text-[11px] px-2.5"
                >
                  {copiedSnippet ? (
                    <>
                      <CheckmarkCircle02Icon className="size-3 text-emerald-500 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy01Icon className="size-3 mr-1" />
                      Copy Code
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                Paste these tags inside the <code className="text-primary font-mono">&lt;head&gt;</code> element of your website or Next.js layout.
              </p>
              <pre className="bg-background/90 border border-border rounded-lg p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-60 leading-relaxed">
                {headHtml}
              </pre>
            </div>
          </div>

          {/* site.webmanifest Block */}
          <div className="border border-border rounded-xl p-5 bg-card/60 backdrop-blur-sm space-y-3 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-foreground">site.webmanifest (PWA)</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(manifestJson, "manifest")}
                  className="h-7 text-[11px] px-2.5"
                >
                  {copiedManifest ? (
                    <>
                      <CheckmarkCircle02Icon className="size-3 text-emerald-500 mr-1" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy01Icon className="size-3 mr-1" />
                      Copy JSON
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-muted-foreground mb-3">
                Save as <code className="text-primary font-mono">site.webmanifest</code> in your public root directory.
              </p>
              <pre className="bg-background/90 border border-border rounded-lg p-3 text-[11px] font-mono text-muted-foreground overflow-x-auto max-h-60 leading-relaxed">
                {manifestJson}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
