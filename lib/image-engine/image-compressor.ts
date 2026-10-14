/**
 * Image Compression Engine (Client-side HTML5 Canvas & Web API)
 * Zero server uploads, 100% private in-browser compression.
 */

export interface CompressionOptions {
  quality: number; // 0.1 to 1.0 (e.g. 0.75 = 75%)
  format: "original" | "image/jpeg" | "image/webp" | "image/png";
  maxWidth?: number; // e.g. 1920
  stripMetadata: boolean;
}

export interface CompressedImageResult {
  id: string;
  originalFile: File;
  originalUrl: string;
  compressedBlob: Blob;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
  savedPercentage: number;
  width: number;
  height: number;
  format: string;
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
 * Compresses an image file in the browser using HTML5 Canvas
 */
export async function compressImage(
  file: File,
  options: CompressionOptions
): Promise<CompressedImageResult> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          let targetWidth = img.width;
          let targetHeight = img.height;

          // Optional downscaling if maxWidth is provided
          if (options.maxWidth && targetWidth > options.maxWidth) {
            const ratio = options.maxWidth / targetWidth;
            targetWidth = options.maxWidth;
            targetHeight = Math.round(targetHeight * ratio);
          }

          // Determine output mime type
          let mimeType = options.format === "original" ? file.type : options.format;
          if (!mimeType || mimeType === "image/svg+xml") {
            mimeType = "image/png";
          }

          const canvas = document.createElement("canvas");
          canvas.width = targetWidth;
          canvas.height = targetHeight;

          const ctx = canvas.getContext("2d", { 
            alpha: mimeType !== "image/jpeg",
            willReadFrequently: false 
          });

          if (!ctx) {
            return reject(new Error("Unable to create canvas 2D context"));
          }

          // Top-notch crisp downsampling with bicubic interpolation
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // If converting to JPEG (which doesn't support alpha), fill solid white
          if (mimeType === "image/jpeg") {
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, targetWidth, targetHeight);
          } else {
            ctx.clearRect(0, 0, targetWidth, targetHeight);
          }

          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // WebP/JPEG at 100% (1.0) activates mathematical lossless/uncompressed tables which bloats file size 3x-4x.
          // Standard browser optimal visually-lossless ceiling is 0.92 (92%).
          const effectiveQuality = options.quality >= 1.0 
            ? (mimeType === "image/webp" || mimeType === "image/jpeg" ? 0.92 : 1.0)
            : Math.min(0.95, Math.max(0.1, options.quality));

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                return reject(new Error("Canvas toBlob failed"));
              }

              let finalBlob = blob;
              let finalMime = mimeType;

              // Smart Safety Fallback: If compressed output happens to be larger than original,
              // and format wasn't explicitly changed, use the original file to guarantee zero size increase!
              if (blob.size >= file.size && options.format === "original" && !options.maxWidth) {
                finalBlob = file;
                finalMime = file.type;
              }

              const previewUrl = URL.createObjectURL(finalBlob);
              const originalSize = file.size;
              const compressedSize = finalBlob.size;
              const savedBytes = Math.max(0, originalSize - compressedSize);
              const savedPercentage = originalSize > 0 
                ? Math.round((savedBytes / originalSize) * 100) 
                : 0;

              resolve({
                id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
                originalFile: file,
                originalUrl: URL.createObjectURL(file),
                compressedBlob: finalBlob,
                previewUrl,
                originalSize,
                compressedSize,
                savedPercentage,
                width: targetWidth,
                height: targetHeight,
                format: finalMime,
              });
            },
            mimeType,
            effectiveQuality
          );
        } catch (err) {
          reject(err);
        }
      };

      img.onerror = () => {
        reject(new Error("Failed to decode image file"));
      };

      if (event.target?.result) {
        img.src = event.target.result as string;
      } else {
        reject(new Error("Failed to read image file data"));
      }
    };

    reader.onerror = () => {
      reject(new Error("FileReader encounter an error reading image"));
    };

    reader.readAsDataURL(file);
  });
}
