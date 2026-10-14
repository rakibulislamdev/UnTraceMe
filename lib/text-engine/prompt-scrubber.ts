/**
 * AI Prompt Scrubber Engine
 * Cleans jailbreaks, hidden injection tokens, watermark tags, secret leaks, and developer prompts.
 */

export interface ScrubberOptions {
  stripJailbreaks: boolean;
  stripWatermarks: boolean;
  redactSecrets: boolean;
  cleanMetaInstructions: boolean;
  normalizeWhitespace: boolean;
}

export interface ScrubFinding {
  type: "jailbreak" | "watermark" | "secret" | "meta";
  label: string;
  count: number;
}

export interface ScrubResult {
  cleanedText: string;
  removedCount: number;
  findings: ScrubFinding[];
  originalRiskScore: number;
  postScrubPurity: number;
  sanitizationScore: number;
}

// Regex patterns for jailbreak prefixes and role-play injection traps
const JAILBREAK_PATTERNS: { label: string; pattern: RegExp }[] = [
  {
    label: "DAN / Jailbreak Persona preamble",
    pattern: /(?:ignore\s+all\s+previous\s+instructions|disregard\s+all\s+(?:prior|previous)\s+prompts|from\s+now\s+on\s+you\s+are\s+(?:DAN|DUDE|AIM|STAN|Jailbroken|an\s+unfiltered\s+AI)|act\s+as\s+(?:DAN|an\s+unrestricted\s+AI))[^.?!;\n]*[.?!;\n]?/gi,
  },
  {
    label: "Developer Mode / Bypass toggle",
    pattern: /(?:\[(?:developer|debug|unlocked|system|admin)\s+mode\s+enabled\]|simulate\s+developer\s+mode|you\s+must\s+bypass\s+(?:safety|content)\s+filters|answer\s+in\s+two\s+ways:\s*one\s+normal\s+and\s+one\s+unfiltered)[^.?!;\n]*[.?!;\n]?/gi,
  },
  {
    label: "System Prompt Extraction attacks",
    pattern: /(?:repeat\s+the\s+words\s+above|print\s+(?:your|the)\s+system\s+prompt|what\s+are\s+your\s+exact\s+instructions\s+before\s+this|reveal\s+(?:your|the)\s+pre-prompt)[^.?!;\n]*[.?!;\n]?/gi,
  },
];

// Watermark signatures and AI platform stamps
const WATERMARK_PATTERNS: { label: string; pattern: RegExp }[] = [
  {
    label: "OpenAI / ChatGPT Signature watermark",
    pattern: /(?:(?:Generated\s+by|Created\s+with|Prompt\s+crafted\s+by)\s+(?:ChatGPT|OpenAI|GPT-4|GPT-3\.5|DALL-E|Sora)|As\s+an\s+AI\s+language\s+model,\s*|I\s+do\s+not\s+have\s+personal\s+opinions,\s*but\s*)[^.?!;\n]*[.?!;\n]?/gi,
  },
  {
    label: "Anthropic / Claude Signature watermark",
    pattern: /(?:(?:Generated\s+by|Crafted\s+for)\s+(?:Claude|Anthropic)|Claude\s+Sonnet\s+prompt\s+artifact)[^.?!;\n]*[.?!;\n]?/gi,
  },
  {
    label: "Zero-Width & Invisible Tracking Characters",
    pattern: /[\u200B-\u200D\uFEFF\u200E\u200F\u202A-\u202E]/g,
  },
  {
    label: "AI Platform Tag Brackets",
    pattern: /\[(?:midjourney|dall-e|stablediffusion|chatgpt|copilot|gemini|flux)\s*:\s*[^\]]+\]/gi,
  },
];

// Sensitive Credentials & Private Key leaks in prompts
const SECRET_PATTERNS: { label: string; pattern: RegExp; replacement: string }[] = [
  {
    label: "OpenAI API Key (sk-...)",
    pattern: /sk-(?:proj-|admin-|live-)?[a-zA-Z0-9_-]{20,}/g,
    replacement: "[REDACTED_OPENAI_KEY]",
  },
  {
    label: "Anthropic API Key (sk-ant-...)",
    pattern: /sk-ant-[a-zA-Z0-9_-]{20,}/g,
    replacement: "[REDACTED_ANTHROPIC_KEY]",
  },
  {
    label: "GitHub / Cloud Secret Token",
    pattern: /(?:ghp_[a-zA-Z0-9]{36}|gho_[a-zA-Z0-9]{36}|glpat-[a-zA-Z0-9_-]{20,})/g,
    replacement: "[REDACTED_ACCESS_TOKEN]",
  },
  {
    label: "Generic Bearer Token / API Key",
    pattern: /(?:bearer\s+[a-zA-Z0-9_\-\.]{25,}|(?:api[_-]?key|secret[_-]?token|auth[_-]?key)\s*[:=]\s*['"][a-zA-Z0-9_\-\.]{16,}['"])/gi,
    replacement: "[REDACTED_API_CREDENTIAL]",
  },
  {
    label: "Private Email addresses",
    pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
    replacement: "[REDACTED_EMAIL]",
  },
  {
    label: "IPv4 Internal Addresses",
    pattern: /\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})\b/g,
    replacement: "[REDACTED_INTERNAL_IP]",
  },
];

// Telltale Meta Instructions & AI preambles
const META_PATTERNS: { label: string; pattern: RegExp }[] = [
  {
    label: "Robot conversational preambles",
    pattern: /^(?:Sure!|Certainly!|Here\s+is\s+the\s+prompt\s+you\s+requested:|Here\s+are\s+the\s+details:|I'd\s+be\s+happy\s+to\s+help\s+with\s+that!)\s*/gim,
  },
  {
    label: "Conversational sign-offs",
    pattern: /(?:Let\s+me\s+know\s+if\s+you\s+need\s+anything\s+else!|I\s+hope\s+this\s+helps!|Feel\s+free\s+to\s+ask\s+more\s+questions!|Hope\s+this\s+is\s+useful!)\s*$/gim,
  },
  {
    label: "XML-like prompt delimiters (<instructions>, <prompt>, etc)",
    pattern: /<\/?(?:instructions?|system|prompt|context|guidelines|meta)>/gi,
  },
];

export function scrubPrompt(
  input: string,
  options: ScrubberOptions = {
    stripJailbreaks: true,
    stripWatermarks: true,
    redactSecrets: true,
    cleanMetaInstructions: true,
    normalizeWhitespace: true,
  }
): ScrubResult {
  let cleaned = input;
  const findings: ScrubFinding[] = [];
  let totalRemoved = 0;

  // 1. Jailbreak stripping
  if (options.stripJailbreaks) {
    for (const rule of JAILBREAK_PATTERNS) {
      const matches = cleaned.match(rule.pattern);
      if (matches && matches.length > 0) {
        findings.push({
          type: "jailbreak",
          label: rule.label,
          count: matches.length,
        });
        totalRemoved += matches.length;
        cleaned = cleaned.replace(rule.pattern, "");
      }
    }
  }

  // 2. Watermark & Tracking scrubbing
  if (options.stripWatermarks) {
    for (const rule of WATERMARK_PATTERNS) {
      const matches = cleaned.match(rule.pattern);
      if (matches && matches.length > 0) {
        findings.push({
          type: "watermark",
          label: rule.label,
          count: matches.length,
        });
        totalRemoved += matches.length;
        cleaned = cleaned.replace(rule.pattern, "");
      }
    }
  }

  // 3. Secret Redaction
  if (options.redactSecrets) {
    for (const rule of SECRET_PATTERNS) {
      const matches = cleaned.match(rule.pattern);
      if (matches && matches.length > 0) {
        findings.push({
          type: "secret",
          label: rule.label,
          count: matches.length,
        });
        totalRemoved += matches.length;
        cleaned = cleaned.replace(rule.pattern, rule.replacement);
      }
    }
  }

  // 4. Meta Instructions & Chat Preamble
  if (options.cleanMetaInstructions) {
    for (const rule of META_PATTERNS) {
      const matches = cleaned.match(rule.pattern);
      if (matches && matches.length > 0) {
        findings.push({
          type: "meta",
          label: rule.label,
          count: matches.length,
        });
        totalRemoved += matches.length;
        cleaned = cleaned.replace(rule.pattern, "");
      }
    }
  }

  // 5. Whitespace and layout normalization
  if (options.normalizeWhitespace) {
    // Replace multiple empty lines with maximum 2 linebreaks
    cleaned = cleaned.replace(/\n{3,}/g, "\n\n");
    // Trim extraneous trailing/leading space per line
    cleaned = cleaned
      .split("\n")
      .map((line) => line.trimEnd())
      .join("\n")
      .trim();
  }

  // 1. Original Risk Score (how compromised was the input)
  const penalty = Math.min(findings.length * 15 + totalRemoved * 5, 85);
  const originalRiskScore = totalRemoved === 0 ? 100 : Math.max(15, 100 - penalty);

  // 2. Post-Scrub Purity (how clean & safe is the sanitized result)
  // If the engine has purged all detected contaminants, post-scrub score is 100% (or 99% if secret placeholders are present)
  const containsRedactedTokens = /\[REDACTED_[A-Z_]+\]/.test(cleaned);
  const postScrubPurity = totalRemoved === 0 ? 100 : containsRedactedTokens ? 99 : 100;

  return {
    cleanedText: cleaned,
    removedCount: totalRemoved,
    findings,
    originalRiskScore,
    postScrubPurity,
    sanitizationScore: postScrubPurity,
  };
}
