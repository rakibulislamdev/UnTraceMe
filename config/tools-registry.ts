export interface ToolItem {
  id: string;
  title: string;
  description: string;
  slug: string;
  badge?: string;
  category: "text" | "image" | "audio" | "security";
  iconName: string;
  isReady: boolean;
}

export const TOOLS_REGISTRY: ToolItem[] = [
  {
    id: "text-humanizer",
    title: "AI Text Humanizer",
    description: "Paraphrase and restructure AI-generated text to bypass Turnitin, GPTZero, and detector algorithms naturally.",
    slug: "/text-humanizer",
    badge: "Popular",
    category: "text",
    iconName: "FileEditIcon",
    isReady: true,
  },
  {
    id: "image-sanitizer",
    title: "AI Image Sanitizer",
    description: "Strip EXIF, C2PA synthetic metadata, and Midjourney/DALL-E traces locally in your browser at zero cost.",
    slug: "/image-sanitizer",
    badge: "100% Free",
    category: "image",
    iconName: "Image01Icon",
    isReady: true,
  },
  {
    id: "prompt-cleaner",
    title: "AI Prompt Scrubber",
    description: "Remove system jailbreaks, hidden watermarking tokens, and AI signature prompts from shared workflows.",
    slug: "/prompt-cleaner",
    badge: "100% Free",
    category: "text",
    iconName: "SecurityLockIcon",
    isReady: true,
  },
  {
    id: "audio-denoiser",
    title: "Voice AI Artifact Filter",
    description: "Harmonize synthetic frequency anomalies and metallic voiceover artifacts from generated speech.",
    slug: "/audio-denoiser",
    badge: "Coming Soon",
    category: "audio",
    iconName: "AiVoiceIcon",
    isReady: false,
  },
];
