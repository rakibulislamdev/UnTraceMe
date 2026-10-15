/**
 * Batch Image Conversion Engine (Client-side HTML5 Canvas & Web API)
 * Zero server uploads, 100% private in-browser conversion between PNG, JPG, WebP, AVIF, and BMP.
 */

export type TargetImageFormat = "image/png" | "image/jpeg" | "image/webp" | "image/avif" | "image/bmp";

export interface FormatDefinition {
  id: TargetImageFormat;
  label: string;
  extension: string;
  badge: string;
  description: string;
  supportsQuality: boolean;
  supportsTransparency: boolean;
}

export const SUPPORTED_TARGET_FORMATS: FormatDefinition[] = [
  {
    id: "image/webp",
    label: "WebP",
    extension: "webp",
    badge: "Recommended",
    description: "Modern format with exceptional compression and full transparency support.",
    supportsQuality: true,
    supportsTransparency: true,
  },
  {
    id: "image/png",
    label: "PNG",
    extension: "png",
    badge: "Lossless",
    description: "Lossless graphics format with crisp edges and alpha transparency.",
    supportsQuality: false,
    supportsTransparency: true,
  },
  {
    id: "image/jpeg",
    label: "JPEG / JPG",
    extension: "jpg",
    badge: "Universal",
    description: "Universally compatible photography format with customizable compression.",
    supportsQuality: true,
    supportsTransparency: false,
  },
  {
    id: "image/avif",
    label: "AVIF",
    extension: "avif",
    badge: "Next-Gen",
    description: "High-efficiency next-gen codec offering up to 50% smaller sizes than JPEG.",
    supportsQuality: true,
    supportsTransparency: true,
  },
  {
    id: "image/bmp",
    label: "BMP",
    extension: "bmp",
    badge: "Legacy",
    description: "Uncompressed Windows Bitmap format for legacy software compatibility.",
    supportsQuality: false,
    supportsTransparency: false,
  },
];

export interface ConversionOptions {
  targetFormat: TargetImageFormat;
  quality: number; // 0.1 to 1.0 (used for JPEG, WebP, AVIF)
  maxWidth?: number;
  maxHeight?: number;
  maintainAspectRatio: boolean;
  backgroundColor: string; // Used when converting transparent images to JPEG / BMP (e.g., "#ffffff" or "#000000")
  stripMetadata: boolean;
}

export interface ConvertedImageResult {
  id: string;
  originalFile: File;
  originalUrl: string;
  convertedBlob: Blob;
  previewUrl: string;
  originalSize: number;
  convertedSize: number;
  sizeDiffBytes: number;
  sizeChangePercentage: number; // Negative means reduced, positive means increased
  originalFormat: string;
  targetFormat: TargetImageFormat;
  targetExtension: string;
  width: number;
  height: number;
  convertedFileName: string;
  status: "success" | "error";
  errorMessage?: string;
}

/**
 * Format bytes into human readable string (KB, MB)
 */
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Checks if a specific mime type can be exported by the current browser's canvas
 */
export function checkBrowserFormatSupport(mimeType: string): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    const dataUrl = canvas.toDataURL(mimeType);
    return dataUrl.startsWith(`data:${mimeType}`);
  } catch {
    return false;
  }
}

/**
 * Encodes canvas ImageData to BMP ArrayBuffer / Blob
 */
function imageDataToBmpBlob(imageData: ImageData): Blob {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;

  // BMP rows are padded to a multiple of 4 bytes
  const rowSize = Math.floor((24 * width + 31) / 32) * 4;
  const pixelArraySize = rowSize * height;
  const fileSize = 54 + pixelArraySize; // 14 bytes header + 40 bytes DIB header

  const buffer = new ArrayBuffer(fileSize);
  const view = new DataView(buffer);

  // --- BMP Header (14 bytes) ---
  view.setUint16(0, 0x424d, false); // "BM" in ASCII
  view.setUint32(2, fileSize, true); // File size
  view.setUint16(6, 0, true);        // Reserved
  view.setUint16(8, 0, true);        // Reserved
  view.setUint32(10, 54, true);      // Offset to pixel array

  // --- DIB Header (BITMAPINFOHEADER - 40 bytes) ---
  view.setUint32(14, 40, true);      // Header size
  view.setInt32(18, width, true);     // Image width
  view.setInt32(22, height, true);    // Image height (bottom-up BMP)
  view.setUint16(26, 1, true);       // Color planes
  view.setUint16(28, 24, true);      // Bits per pixel (24-bit RGB)
  view.setUint32(30, 0, true);       // BI_RGB (no compression)
  view.setUint32(34, pixelArraySize, true); // Image data size
  view.setInt32(38, 2835, true);     // Horizontal resolution (pixels/meter ~ 72 DPI)
  view.setInt32(42, 2835, true);     // Vertical resolution
  view.setUint32(46, 0, true);       // Colors in color table
  view.setUint32(50, 0, true);       // Important color count

  // --- Pixel Array (BGR order, bottom-to-top) ---
  let offset = 54;
  for (let y = height - 1; y >= 0; y--) {
    for (let x = 0; x < width; x++) {
      const srcIdx = (y * width + x) * 4;
      const r = data[srcIdx];
      const g = data[srcIdx + 1];
      const b = data[srcIdx + 2];

      view.setUint8(offset++, b);
      view.setUint8(offset++, g);
      view.setUint8(offset++, r);
    }
    // Padding to 4-byte boundary
    const padding = rowSize - width * 3;
    for (let p = 0; p < padding; p++) {
      view.setUint8(offset++, 0);
    }
  }

  return new Blob([buffer], { type: "image/bmp" });
}

/**
 * Converts a single image file to the designated target format using HTML5 Canvas & Web APIs
 */
export async function convertImage(
  file: File,
  options: ConversionOptions
): Promise<ConvertedImageResult> {
  return new Promise((resolve, reject) => {
    // Strict safeguard: Reject non-image files immediately
    const isImageMime = file.type.startsWith("image/");
    const hasImageExt = /\.(jpe?g|png|webp|avif|bmp|gif|svg)$/i.test(file.name);
    if (!isImageMime && !hasImageExt) {
      return reject(new Error(`"${file.name}" is not an image file. Only image formats are supported.`));
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        try {
          let targetWidth = img.width;
          let targetHeight = img.height;

          // Scaling calculation if maxWidth or maxHeight is specified
          if (options.maxWidth && options.maxWidth > 0 && targetWidth > options.maxWidth) {
            const ratio = options.maxWidth / targetWidth;
            targetWidth = options.maxWidth;
            if (options.maintainAspectRatio) {
              targetHeight = Math.round(targetHeight * ratio);
            }
          }

          if (options.maxHeight && options.maxHeight > 0 && targetHeight > options.maxHeight) {
            const ratio = options.maxHeight / targetHeight;
            targetHeight = options.maxHeight;
            if (options.maintainAspectRatio) {
              targetWidth = Math.round(targetWidth * ratio);
            }
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const requiresAlphaOmission = options.targetFormat === "image/jpeg" || options.targetFormat === "image/bmp";
          const ctx = canvas.getContext("2d", {
            alpha: !requiresAlphaOmission,
            willReadFrequently: options.targetFormat === "image/bmp",
          });

          if (!ctx) {
            return reject(new Error("Unable to create canvas 2D rendering context"));
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // If converting to a format without alpha channel, fill background
          if (requiresAlphaOmission) {
            ctx.fillStyle = options.backgroundColor || "#ffffff";
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else {
            ctx.clearRect(0, 0, targetWidth, targetHeight);
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Get target definition
          const formatDef = SUPPORTED_TARGET_FORMATS.find((f) => f.id === options.targetFormat) || SUPPORTED_TARGET_FORMATS[0];
          const baseName = file.name.replace(/\.[^/.]+$/, "");
          const convertedFileName = `${baseName}.${formatDef.extension}`;

          // Quality calibration:
          // In Chromium/WebKit, WebP/JPEG/AVIF at 1.0 (100%) triggers uncompressed mathematical lossless mode,
          // which bloats compressed images by 300%-500% with zero visible difference.
          // Standard browser visually-lossless ceiling is 0.92 (92%).
          const effectiveQuality = options.quality >= 0.98
            ? (options.targetFormat === "image/webp" || options.targetFormat === "image/jpeg" || options.targetFormat === "image/avif" ? 0.92 : 1.0)
            : Math.min(0.95, Math.max(0.1, options.quality));

          // Custom handler for BMP export
          if (options.targetFormat === "image/bmp") {
            const imageData = ctx.getImageData(0, 0, targetWidth, targetHeight);
            const bmpBlob = imageDataToBmpBlob(imageData);
            const previewUrl = URL.createObjectURL(bmpBlob);
            const sizeDiff = bmpBlob.size - file.size;
            const pct = file.size > 0 ? Math.round(((bmpBlob.size - file.size) / file.size) * 100) : 0;

            return resolve({
              id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
              originalFile: file,
              originalUrl: URL.createObjectURL(file),
              convertedBlob: bmpBlob,
              previewUrl,
              originalSize: file.size,
              convertedSize: bmpBlob.size,
              sizeDiffBytes: sizeDiff,
              sizeChangePercentage: pct,
              originalFormat: file.type || "image/unknown",
              targetFormat: "image/bmp",
              targetExtension: "bmp",
              width: targetWidth,
              height: targetHeight,
              convertedFileName,
              status: "success",
            });
          }

          // Fallback check if browser supports target mime (e.g. AVIF on older browsers)
          let targetMime: string = options.targetFormat;
          if (targetMime === "image/avif" && !checkBrowserFormatSupport("image/avif")) {
            // Graceful fallback to WebP
            targetMime = "image/webp";
          }

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error(`Failed to encode image to ${options.targetFormat}`));
              }

              const previewUrl = URL.createObjectURL(blob);
              const sizeDiff = blob.size - file.size;
              const pct = file.size > 0 ? Math.round(((blob.size - file.size) / file.size) * 100) : 0;

              resolve({
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                originalFile: file,
                originalUrl: URL.createObjectURL(file),
                convertedBlob: blob,
                previewUrl,
                originalSize: file.size,
                convertedSize: blob.size,
                sizeDiffBytes: sizeDiff,
                sizeChangePercentage: pct,
                originalFormat: file.type || "image/unknown",
                targetFormat: options.targetFormat,
                targetExtension: formatDef.extension,
                width: targetWidth,
                height: targetHeight,
                convertedFileName,
                status: "success",
              });
            },
            targetMime,
            effectiveQuality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error(`Failed to load and decode "${file.name}"`));
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error("Failed to read image source"));
      }
    };

    reader.onerror = () => {
      reject(new Error("FileReader error while reading image file"));
    };

    reader.readAsDataURL(file);
  });
}
