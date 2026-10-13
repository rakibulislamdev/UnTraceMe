import React from "react";

interface AdContainerProps {
  slotId?: string;
  format?: "banner" | "horizontal" | "box";
  className?: string;
}

export function AdContainer({ format = "horizontal", className = "" }: AdContainerProps) {
  const heightClass = format === "banner" ? "h-24" : format === "box" ? "h-64" : "h-28";

  return (
    <div
      className={`w-full my-6 flex flex-col items-center justify-center rounded-xl border border-dashed border-[var(--border)] bg-[var(--card)]/50 p-3 text-center transition-all ${heightClass} ${className}`}
    >
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-[var(--muted-foreground)] uppercase tracking-wider">
        <span>Sponsored Advertisement</span>
      </div>
      <p className="text-xs text-[var(--muted-foreground)] mt-1 opacity-70">
        Google AdSense Responsive Ad Slot
      </p>
    </div>
  );
}
