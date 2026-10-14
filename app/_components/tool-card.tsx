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
        "group relative flex flex-col justify-between p-4 sm:p-5 rounded-xl border-border bg-card transition-all duration-200",
        tool.isReady
          ? "hover:border-primary/50 hover:shadow-sm hover:-translate-y-0.5 cursor-pointer"
          : "opacity-65 hover:border-border cursor-pointer",
        className
      )}
    >
      <Link
        href={tool.isReady ? tool.slug : "#"}
        className="flex flex-col h-full justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-3.5">
            <div className="size-9 rounded-lg bg-accent text-accent-foreground flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <IconComponent className="size-4.5 text-primary" />
            </div>
            {tool.badge && (
              <Badge
                variant={
                  tool.badge === "Popular"
                    ? "default"
                    : tool.badge === "New"
                    ? "default"
                    : tool.badge === "100% Free"
                    ? "outline"
                    : "secondary"
                }
                className={cn(
                  "text-[10px] px-2 py-0.5 font-medium tracking-tight",
                  tool.badge === "New" && "bg-primary text-primary-foreground",
                  tool.badge === "100% Free" && "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5",
                  tool.badge === "Coming Soon" && "bg-muted text-muted-foreground border-border"
                )}
              >
                {tool.badge}
              </Badge>
            )}
          </div>

          <h3 className="text-sm font-semibold text-foreground tracking-tight mb-1.5 group-hover:text-primary transition-colors">
            {tool.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {tool.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-border/60 flex items-center justify-between text-[11px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
          <span>{tool.isReady ? "Open Tool Workspace" : "Coming Soon"}</span>
          <ArrowRight01Icon className="size-3.5 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </Link>
    </Card>
  );
}
