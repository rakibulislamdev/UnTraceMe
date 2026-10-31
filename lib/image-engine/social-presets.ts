export interface SocialPreset {
  id: string;
  name: string;
  platform: "Instagram" | "YouTube" | "Twitter / X" | "LinkedIn" | "TikTok / Story";
  width: number;
  height: number;
  aspectRatio: string;
  category: "square" | "landscape" | "portrait" | "banner";
  description: string;
}

export const SOCIAL_PRESETS: SocialPreset[] = [
  // Instagram
  {
    id: "ig-square",
    name: "Instagram Square Post",
    platform: "Instagram",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    category: "square",
    description: "Standard square feed post",
  },
  {
    id: "ig-portrait",
    name: "Instagram Portrait Post",
    platform: "Instagram",
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
    category: "portrait",
    description: "Full vertical feed portrait (4:5)",
  },
  {
    id: "ig-story",
    name: "Instagram Story & Reel",
    platform: "Instagram",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    category: "portrait",
    description: "Vertical full-screen story / reel",
  },

  // YouTube
  {
    id: "yt-thumbnail",
    name: "YouTube Thumbnail",
    platform: "YouTube",
    width: 1280,
    height: 720,
    aspectRatio: "16:9",
    category: "landscape",
    description: "Standard HD 16:9 video thumbnail",
  },
  {
    id: "yt-banner",
    name: "YouTube Channel Banner",
    platform: "YouTube",
    width: 2560,
    height: 1440,
    aspectRatio: "16:9",
    category: "banner",
    description: "Channel header art across devices",
  },

  // Twitter / X
  {
    id: "x-post",
    name: "X / Twitter Post Image",
    platform: "Twitter / X",
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
    category: "landscape",
    description: "Optimal single photo tweet preview",
  },
  {
    id: "x-header",
    name: "X / Twitter Header Banner",
    platform: "Twitter / X",
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
    category: "banner",
    description: "Profile banner (3:1 ratio)",
  },

  // LinkedIn
  {
    id: "li-post",
    name: "LinkedIn Feed Post",
    platform: "LinkedIn",
    width: 1200,
    height: 627,
    aspectRatio: "1.91:1",
    category: "landscape",
    description: "Feed update and article graphic",
  },
  {
    id: "li-banner",
    name: "LinkedIn Personal Cover",
    platform: "LinkedIn",
    width: 1584,
    height: 396,
    aspectRatio: "4:1",
    category: "banner",
    description: "Personal profile background banner",
  },

  // TikTok
  {
    id: "tiktok-video",
    name: "TikTok & Shorts Video Cover",
    platform: "TikTok / Story",
    width: 1080,
    height: 1920,
    aspectRatio: "9:16",
    category: "portrait",
    description: "High-res vertical 9:16 cover",
  },
];

