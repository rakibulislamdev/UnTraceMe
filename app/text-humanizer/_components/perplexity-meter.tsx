import { Badge } from "@/components/ui/badge";
import { CheckmarkCircle02Icon, SparklesIcon } from "hugeicons-react";

interface PerplexityMeterProps {
  score: number;
  burstinessGrade: "Low" | "Medium" | "High";
  hasText: boolean;
}

export function PerplexityMeter({
  score,
  burstinessGrade,
  hasText,
}: PerplexityMeterProps) {
  if (!hasText) return null;

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg border border-border bg-card text-xs gap-3">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
          <CheckmarkCircle02Icon className="size-4" />
        </div>
        <div>
          <span className="font-semibold text-foreground">
            Estimated Human Likelihood: {score}%
          </span>
          <p className="text-muted-foreground mt-0.5">
            Measured against statistical token perplexity benchmarks.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-muted-foreground">Cadence Burstiness:</span>
        <Badge
          variant="outline"
          className="border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 font-medium"
        >
          <SparklesIcon className="size-3 -mt-px mr-1" />
          {burstinessGrade} Variation
        </Badge>
      </div>
    </div>
  );
}
