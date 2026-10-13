"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Shield01Icon, 
  SparklesIcon, 
  Image01Icon,
  Menu01Icon,
  Cancel01Icon
} from "hugeicons-react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function SiteNavbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
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
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/85 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group select-none">
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

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-md flex items-center gap-2 transition-all duration-150",
                  link.active
                    ? "text-foreground bg-muted font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                <IconComponent className="size-4 -mt-px" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="ml-2 pl-3 border-l border-border">
            <Badge variant="outline" className="text-[11px] font-medium border-emerald-500/20 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5">
              100% Free Tiers
            </Badge>
          </div>
        </nav>

        {/* CTA & Mobile Toggle */}
        <div className="flex items-center gap-2">
          <Link
            href="/text-humanizer"
            className={cn(
              buttonVariants({ size: "sm" }),
              "hidden sm:inline-flex shadow-sm"
            )}
          >
            <SparklesIcon className="size-3.5 -mt-px mr-1.5" />
            Start Free
          </Link>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden size-9"
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
        <div className="md:hidden border-b border-border bg-card px-4 pt-2 pb-4 space-y-1 animate-in fade-in slide-in-from-top-2">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  link.active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                )}
              >
                <IconComponent className="size-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
