import React from "react";
import Link from "next/link";
import { 
  FileEditIcon, 
  Image01Icon, 
  SecurityLockIcon, 
  AiVoiceIcon,
  ArrowRight01Icon 
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
        "group relative flex flex-col justify-between p-6 rounded-lg border-border bg-card transition-all duration-200",
        tool.isReady
          ? "hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
          : "opacity-60 cursor-not-allowed",
        className
      )}
    >
      <Link
        href={tool.isReady ? tool.slug : "#"}
        className="flex flex-col h-full justify-between"
      >
        <div>
          <div className="flex items-center justify-between mb-5">
            <div className="size-11 rounded-md bg-accent text-accent-foreground flex items-center justify-center transition-transform duration-200 group-hover:scale-105">
              <IconComponent className="size-5" />
            </div>
            {tool.badge && (
              <Badge
                variant={
                  tool.badge === "Popular"
                    ? "default"
                    : tool.badge === "100% Free"
                    ? "outline"
                    : "secondary"
                }
                className={cn(
                  "text-[11px] font-medium tracking-tight",
                  tool.badge === "100% Free" && "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5"
                )}
              >
                {tool.badge}
              </Badge>
            )}
          </div>

          <h3 className="text-base font-semibold text-foreground tracking-tight mb-2 group-hover:text-primary transition-colors">
            {tool.title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {tool.description}
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
          <span>{tool.isReady ? "Open Tool Workspace" : "Under Development"}</span>
          <ArrowRight01Icon className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
        </div>
      </Link>
    </Card>
  );
}
