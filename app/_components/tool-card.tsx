import React from "react";
import Link from "next/link";
import { 
  FileEditIcon, 
  Image01Icon, 
  SecurityLockIcon, 
  AiVoiceIcon,
  ArrowRight01Icon,
  ImageCompositionIcon,
  Exchange01Icon,
  Layers01Icon,
  Pdf01Icon
} from "hugeicons-react";
import { ToolItem } from "@/config/tools-registry";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const ICON_MAP: Record<string, React.ElementType> = {
  FileEditIcon,
  Image01Icon,
  SecurityLockIcon,
  AiVoiceIcon,
  ImageCompositionIcon,
  Exchange01Icon,
  Layers01Icon,
  Pdf01Icon,
};

interface ToolCardProps {
  tool: ToolItem;
  className?: string;
}

export function ToolCard({ tool, className }: ToolCardProps) {
  const IconComponent = ICON_MAP[tool.iconName] || FileEditIcon;

  return (
    <Card
      className={cn(
        "group relative flex flex-col justify-between p-5 sm:p-6 rounded-lg border border-border bg-card transition-all duration-200",
        tool.isReady
          ? "hover:border-primary/50 hover:bg-secondary/40 hover:-translate-y-0.5 cursor-pointer shadow-none hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)]"
          : "opacity-60 hover:border-border cursor-pointer",
        className
      )}
    >
      <Link
        href={tool.isReady ? tool.slug : "#"}
        className="flex flex-col h-full justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="size-9 rounded-md bg-secondary text-primary border border-border/70 flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <IconComponent className="size-4.5 text-primary" />
            </div>
            {tool.badge && (
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] px-2 py-0.5 font-medium rounded-full",
                  tool.badge === "New" && "bg-primary text-white border-transparent",
                  tool.badge === "100% Free" && "border-border text-foreground bg-secondary",
                  tool.badge === "Coming Soon" && "bg-secondary text-muted-foreground border-border"
                )}
              >
                {tool.badge}
              </Badge>
            )}
          </div>

          <h3 className="text-base font-medium text-foreground tracking-[-0.015em] mb-1.5 group-hover:text-primary transition-colors">
            {tool.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        <div className="mt-5 pt-3.5 border-t border-border flex items-center justify-between text-xs text-muted-foreground group-hover:text-foreground transition-colors">
          <span className="font-mono text-[10px] text-muted-foreground uppercase">
            {tool.category}
          </span>
          <span className="inline-flex items-center gap-1 font-medium text-primary text-xs">
            {tool.isReady ? "Open module" : "In queue"}
            <ArrowRight01Icon className="size-3 transition-transform duration-150 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </Card>
  );
}
