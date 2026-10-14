/**
 * Client-Side Favicon & App Icon Pack Engine
 * Generates standards-compliant icons, multi-size .ico binary, Web Manifest, and HTML head tags.
 * 100% In-Browser Canvas & Zero Server Uploads.
 */

export interface IconPreset {
  id: string;
  name: string;
  filename: string;
  width: number;
  height: number;
  category: "browser" | "apple" | "android" | "windows";
  format: "png" | "ico";
  description: string;
  relTag?: string;
}

export const FAVICON_PRESETS: IconPreset[] = [
  // Browser standard favicons
  {
    id: "favicon-ico",
    name: "Classic Favicon",
    filename: "favicon.ico",
    width: 32, // standard container size, ICO will embed 16, 32, 48
    height: 32,
    category: "browser",
    format: "ico",
    description: "Legacy & universal multi-resolution .ico (16x16, 32x32, 48x48)",
    relTag: `<link rel="icon" href="/favicon.ico" sizes="any">`,
  },
  {
    id: "favicon-16",
    name: "Browser Tab (Small)",
    filename: "favicon-16x16.png",
    width: 16,
    height: 16,
    category: "browser",
    format: "png",
    description: "Compact browser tab display",
    relTag: `<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">`,
  },
  {
    id: "favicon-32",
    name: "Browser Tab (Standard)",
    filename: "favicon-32x32.png",
    width: 32,
    height: 32,
    category: "browser",
    format: "png",
    description: "Retina browser tab display",
    relTag: `<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">`,
  },
  {
    id: "favicon-48",
    name: "Desktop & Taskbar",
    filename: "favicon-48x48.png",
    width: 48,
    height: 48,
    category: "browser",
    format: "png",
    description: "Windows desktop shortcuts and high-DPI tabs",
    relTag: `<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">`,
  },

  // Apple iOS Touch Icons
  {
    id: "apple-touch-180",
    name: "Apple Touch Icon",
    filename: "apple-touch-icon.png",
    width: 180,
    height: 180,
    category: "apple",
    format: "png",
    description: "iPhone & iPad home screen bookmarks",
    relTag: `<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">`,
  },
  {
    id: "apple-touch-152",
    name: "iPad Touch Icon",
    filename: "apple-touch-icon-152x152.png",
    width: 152,
    height: 152,
    category: "apple",
    format: "png",
    description: "iPad Retina displays",
    relTag: `<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">`,
  },

  // Android & PWA Web Manifest Icons
  {
    id: "android-192",
    name: "Android Chrome",
    filename: "android-chrome-192x192.png",
    width: 192,
    height: 192,
    category: "android",
    format: "png",
    description: "PWA home screen splash / app icon",
  },
  {
    id: "android-512",
    name: "Android Chrome (High-Res)",
    filename: "android-chrome-512x512.png",
    width: 512,
    height: 512,
    category: "android",
    format: "png",
    description: "PWA splash screen & Google Play Store web apps",
  },

  // Windows Metro Tile
  {
    id: "mstile-150",
    name: "Windows Metro Tile",
    filename: "mstile-150x150.png",
    width: 150,
    height: 150,
    category: "windows",
    format: "png",
    description: "Windows Start Menu pinned tiles",
  },
];

export interface RenderOptions {
  paddingPercent: number; // 0 to 40% inset padding
  backgroundColor: string; // "transparent" or hex code (e.g., "#000000", "#ffffff")
  borderRadiusPercent: number; // 0 (square) to 50 (circle)
}

export interface GeneratedIconResult {
  preset: IconPreset;
  blob: Blob;
  previewUrl: string;
  sizeBytes: number;
}

/**
 * Builds a multi-resolution ICO file from an array of PNG blobs (16, 32, 48).
 * Pure binary implementation according to Microsoft Icon Format specification.
 */
export async function createIcoFromPngs(
  pngImages: { size: number; blob: Blob }[]
): Promise<Blob> {
  const imagesData: { size: number; buffer: ArrayBuffer }[] = [];

  for (const img of pngImages) {
    const buffer = await img.blob.arrayBuffer();
    imagesData.push({ size: img.size, buffer });
  }

  // ICONDIR header is 6 bytes
  // ICONDIRENTRY is 16 bytes per image
  const count = imagesData.length;
  const headerSize = 6;
  const directorySize = count * 16;
  let offset = headerSize + directorySize;

  let totalSize = offset;
  for (const img of imagesData) {
    totalSize += img.buffer.byteLength;
  }

  const output = new Uint8Array(totalSize);
  const view = new DataView(output.buffer);

  // 1. Write ICONDIR (Header)
  view.setUint16(0, 0, true); // Reserved. Must always be 0.
  view.setUint16(2, 1, true); // Image type: 1 = ICO
  view.setUint16(4, count, true); // Number of images in file

  // 2. Write ICONDIRENTRY for each image
  imagesData.forEach((img, idx) => {
    const entryOffset = headerSize + idx * 16;
    const width = img.size >= 256 ? 0 : img.size;
    const height = img.size >= 256 ? 0 : img.size;

    view.setUint8(entryOffset + 0, width); // Width in pixels
    view.setUint8(entryOffset + 1, height); // Height in pixels
    view.setUint8(entryOffset + 2, 0); // Color count (0 = no palette)
    view.setUint8(entryOffset + 3, 0); // Reserved. Must be 0
    view.setUint16(entryOffset + 4, 1, true); // Color planes (1)
    view.setUint16(entryOffset + 6, 32, true); // Bits per pixel (32 for RGBA)
    view.setUint32(entryOffset + 8, img.buffer.byteLength, true); // Size of image data in bytes
    view.setUint32(entryOffset + 12, offset, true); // Offset of image data from beginning of ICO

    // Copy raw PNG buffer into output array at calculated offset
    output.set(new Uint8Array(img.buffer), offset);
    offset += img.buffer.byteLength;
  });

  return new Blob([output], { type: "image/x-icon" });
}

/**
 * Resizes an image to specified width/height using high-quality Canvas bicubic resampling
 * with customizable background color, padding, and corner rounding.
 */
export async function renderSingleIconCanvas(
  sourceImage: HTMLImageElement | ImageBitmap,
  targetWidth: number,
  targetHeight: number,
  options: RenderOptions
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Could not initialize 2D rendering canvas context.");
  }

  // High quality resampling
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  // If corner radius is requested, clip with rounded rect
  if (options.borderRadiusPercent > 0) {
    const radius = (Math.min(targetWidth, targetHeight) / 2) * (options.borderRadiusPercent / 50);
    ctx.beginPath();
    ctx.roundRect(0, 0, targetWidth, targetHeight, radius);
    ctx.clip();
  }

  // Draw background if not transparent
  if (options.backgroundColor && options.backgroundColor !== "transparent") {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, targetWidth, targetHeight);
  }

  // Calculate dimensions with padding
  const paddingX = (targetWidth * options.paddingPercent) / 100;
  const paddingY = (targetHeight * options.paddingPercent) / 100;
  const drawWidth = targetWidth - paddingX * 2;
  const drawHeight = targetHeight - paddingY * 2;

  // Aspect fit image inside padded area
  const srcW = sourceImage.width;
  const srcH = sourceImage.height;
  const srcAspect = srcW / srcH;
  const targetAspect = drawWidth / drawHeight;

  let finalW = drawWidth;
  let finalH = drawHeight;
  let finalX = paddingX;
  let finalY = paddingY;

  if (srcAspect > targetAspect) {
    // Source is wider
    finalH = drawWidth / srcAspect;
    finalY = paddingY + (drawHeight - finalH) / 2;
  } else {
    // Source is taller or equal
    finalW = drawHeight * srcAspect;
    finalX = paddingX + (drawWidth - finalW) / 2;
  }

  ctx.drawImage(sourceImage, finalX, finalY, finalW, finalH);

  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error("Canvas toBlob failed"));
      }
    }, "image/png");
  });
}

/**
 * Generates the full manifest.json string for PWAs
 */
export function generateSiteWebmanifest(appName = "My Application", themeColor = "#000000"): string {
  const manifest = {
    name: appName,
    short_name: appName.slice(0, 12),
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    theme_color: themeColor,
    background_color: themeColor,
    display: "standalone",
  };
  return JSON.stringify(manifest, null, 2);
}

/**
 * Generates ready-to-paste HTML <head> snippet
 */
export function generateHeadHtmlSnippet(themeColor = "#000000"): string {
  return `<!-- Favicon & App Icons generated by UnTraceMe -->
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="msapplication-TileColor" content="${themeColor}">
<meta name="theme-color" content="${themeColor}">`;
}
