"use client";

import React from "react";
import { AlertCircleIcon } from "hugeicons-react";

interface BgErrorBannerProps {
  message: string;
}

export function BgErrorBanner({ message }: BgErrorBannerProps) {
  return (
    <div className="flex items-center gap-2 p-3 text-xs rounded-xl border border-destructive/20 bg-destructive/10 text-destructive">
      <AlertCircleIcon className="size-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
