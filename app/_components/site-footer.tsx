import React from "react";
import Link from "next/link";
import { Shield01Icon, HeartCheckIcon } from "hugeicons-react";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-[var(--border)] bg-[var(--card)] text-[var(--muted-foreground)] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Shield01Icon size={18} className="text-[var(--primary)]" />
          <span className="font-semibold text-[var(--foreground)]">UnTraceMe</span>
          <span>© 2026 — Zero Tracking & Private Client Sanitizer.</span>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          <Link href="/privacy" className="hover:text-[var(--foreground)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[var(--foreground)] transition-colors">
            Terms of Service
          </Link>
          <Link href="/about" className="hover:text-[var(--foreground)] transition-colors">
            About Suite
          </Link>
          <span className="flex items-center gap-1 text-[var(--foreground)]">
            <HeartCheckIcon size={14} className="text-rose-500" /> Free for Everyone
          </span>
        </div>
      </div>
    </footer>
  );
}
