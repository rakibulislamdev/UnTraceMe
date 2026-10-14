"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield01Icon, 
  SparklesIcon, 
  Image01Icon,
  SecurityLockIcon,
  AiVoiceIcon,
  Menu01Icon,
  Cancel01Icon,
  ArrowDown01Icon,
  Github01Icon
} from "hugeicons-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Primary highlighted tools on desktop
  const primaryLinks = [
    {
      href: "/text-humanizer",
      label: "Text Humanizer",
      icon: SparklesIcon,
      active: pathname.startsWith("/text-humanizer"),
    },
    {
      href: "/image-sanitizer",
      label: "Image Sanitizer",
      icon: Image01Icon,
      active: pathname.startsWith("/image-sanitizer"),
    },
    {
      href: "/image-compressor",
      label: "Image Compressor",
      icon: Image01Icon,
      active: pathname.startsWith("/image-compressor"),
    },
  ];

  // More tools grouped in sleek dropdown
  const moreTools = [
    {
      href: "/prompt-cleaner",
      label: "Prompt Scrubber",
      desc: "Scrub AI tokens & jailbreaks",
      icon: SecurityLockIcon,
      active: pathname.startsWith("/prompt-cleaner"),
    },
    {
      href: "/audio-denoiser",
      label: "Voice AI Filter",
      desc: "Harmonize metallic audio artifacts",
      icon: AiVoiceIcon,
      active: pathname.startsWith("/audio-denoiser"),
    },
  ];

  const allNavLinks = [...primaryLinks, ...moreTools];
  const isMoreActive = moreTools.some((t) => t.active);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none shrink-0">
          <div className="size-9 rounded-md bg-primary text-primary-foreground flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 active:scale-[0.98]">
            <Shield01Icon className="size-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-base leading-tight tracking-tight text-foreground flex items-center gap-1">
              UnTrace<span className="text-primary">Me</span>
            </span>
            <span className="text-[10px] text-muted-foreground tracking-wide uppercase font-medium">
              Detection & Privacy Suite
            </span>
          </div>
        </Link>

        {/* Clean, Non-Crowded Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1 text-sm font-medium">
          {primaryLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-150 text-xs",
                  link.active
                    ? "text-foreground bg-muted font-semibold"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <IconComponent className="size-3.5 -mt-px text-primary" />
                <span>{link.label}</span>
              </Link>
            );
          })}

          {/* More Tools Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                "px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all duration-150 text-xs cursor-pointer select-none outline-none",
                isMoreActive
                  ? "text-foreground bg-muted font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <span>More Tools</span>
              <ArrowDown01Icon className="size-3 opacity-70" />
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              align="start" 
              sideOffset={8}
              className="w-64 p-1.5 rounded-lg border border-border bg-popover/95 backdrop-blur-md shadow-lg"
            >
              <div className="px-2.5 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                Specialized Modules
              </div>
              {moreTools.map((tool) => {
                const IconComponent = tool.icon;
                return (
                  <DropdownMenuItem 
                    key={tool.href} 
                    className="p-0 rounded-md cursor-pointer focus:bg-muted/80 transition-colors"
                  >
                    <Link
                      href={tool.href}
                      className={cn(
                        "flex items-start gap-2.5 p-2 w-full rounded-md transition-colors",
                        tool.active 
                          ? "bg-primary/10 text-primary font-medium" 
                          : "text-foreground hover:bg-muted/60"
                      )}
                    >
                      <div className="size-8 rounded-md bg-accent text-accent-foreground flex items-center justify-center shrink-0 mt-0.5">
                        <IconComponent className="size-4 text-primary" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-semibold text-foreground tracking-tight">{tool.label}</span>
                        <span className="text-[11px] text-muted-foreground line-clamp-1">{tool.desc}</span>
                      </div>
                    </Link>
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="ml-1 pl-2.5 border-l border-border">
            <Badge variant="outline" className="text-[10px] px-2 py-0.5 font-medium border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
              100% Free
            </Badge>
          </div>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle (Dark/Light Mode) */}
          <ThemeToggle />

          <a
            href="https://github.com/rakibulislamdev/UnTraceMe"
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "hidden sm:inline-flex shadow-xs text-xs font-semibold h-8.5 px-3 gap-1.5 cursor-pointer hover:border-primary/50"
            )}
            title="Star UnTraceMe on GitHub"
          >
            <Github01Icon className="size-3.5" />
            <span>Star on GitHub</span>
          </a>

          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden size-9"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <Cancel01Icon className="size-5" />
            ) : (
              <Menu01Icon className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-card px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2">
          {allNavLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  link.active
                    ? "bg-muted text-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <IconComponent className="size-4 text-primary" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
