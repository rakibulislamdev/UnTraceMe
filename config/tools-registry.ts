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
    badge: "100% Free",
    category: "audio",
    iconName: "AiVoiceIcon",
    isReady: true,
  },
  {
    id: "image-compressor",
    title: "Image Compressor & Optimizer",
    description: "Compress PNG, JPG, and WebP images up to 85% with smart quality tuning and client-side privacy preservation.",
    slug: "/image-compressor",
    badge: "New",
    category: "image",
    iconName: "ImageCompositionIcon",
    isReady: true,
  },
  {
    id: "image-converter",
    title: "Batch Image Converter",
    description: "Convert images seamlessly between PNG, JPG, WebP, and AVIF formats entirely in your browser without data uploads.",
    slug: "/image-converter",
    badge: "Coming Soon",
    category: "image",
    iconName: "Exchange01Icon",
    isReady: false,
  },
  {
    id: "favicon-generator",
    title: "Favicon & App Icon Pack",
    description: "Generate multi-size .ico bundles, iOS touch icons, and Android PWA assets with instant client-side download.",
    slug: "/favicon-generator",
    badge: "New",
    category: "image",
    iconName: "Layers01Icon",
    isReady: true,
  },
  {
    id: "pdf-compressor",
    title: "PDF Compressor & Sanitizer",
    description: "Reduce PDF document size and strip hidden author, software, and revision history metadata securely.",
    slug: "/pdf-compressor",
    badge: "New",
    category: "security",
    iconName: "Pdf01Icon",
    isReady: true,
  },
];
