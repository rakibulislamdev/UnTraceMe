export interface ScannedMetadataResult {
  hasExif: boolean;
  hasC2PA: boolean;
  hasPromptHeader: boolean;
  detectedSignatures: string[];
  dimensions?: { width: number; height: number };
}

/**
 * Client-side binary scanner for AI signatures, EXIF, and C2PA markers.
 * Inspects file buffer chunks for known synthetic markers (Midjourney, Stable Diffusion, DALL-E, C2PA).
 */
export async function scanImageMetadata(file: File): Promise<ScannedMetadataResult> {
  return new Promise((resolve) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer;
      if (!buffer) {
        resolve({
          hasExif: false,
          hasC2PA: false,
          hasPromptHeader: false,
          detectedSignatures: [],
        });
        return;
      }

      // Convert first 128KB of buffer to text to check header segments
      const slice = buffer.slice(0, Math.min(buffer.byteLength, 128 * 1024));
      const bytes = new Uint8Array(slice);
      let text = "";
      for (let i = 0; i < bytes.length; i++) {
        text += String.fromCharCode(bytes[i]);
      }

      const signatures: string[] = [];

      // Check EXIF / TIFF headers
      const hasExif = text.includes("Exif") || text.includes("http://ns.adobe.com/xap/1.0/");
      if (hasExif) {
        signatures.push("EXIF / XMP Tracking Metadata");
      }

      // Check C2PA / Content Credentials signatures
      const hasC2PA =
        text.includes("c2pa") ||
        text.includes("manifest") ||
        text.includes("C2PA") ||
        text.includes("contentcredentials.org");
      if (hasC2PA) {
        signatures.push("C2PA Synthetic Content Credentials");
      }

      // Check AI Prompt / Software markers
      let hasPromptHeader = false;
      if (text.includes("parameters") || text.includes("Negative prompt") || text.includes("Steps:")) {
        signatures.push("Stable Diffusion Generation Parameters");
        hasPromptHeader = true;
      }
      if (text.includes("Midjourney") || text.includes("--v ") || text.includes("--ar ")) {
        signatures.push("Midjourney Generation Header");
        hasPromptHeader = true;
      }
      if (text.includes("DALL-E") || text.includes("OpenAI")) {
        signatures.push("DALL-E / OpenAI Origin Tag");
        hasPromptHeader = true;
      }
      if (text.includes("photoshop") || text.includes("Adobe")) {
        signatures.push("Adobe Asset Trace");
      }

      // Default generic heuristic if no explicit text tag found in slice
      if (signatures.length === 0) {
        signatures.push("Standard Raster Header (Non-verifiable tags)");
      }

      resolve({
        hasExif,
        hasC2PA,
        hasPromptHeader,
        detectedSignatures: signatures,
      });
    };

    reader.onerror = () => {
      resolve({
        hasExif: false,
        hasC2PA: false,
        hasPromptHeader: false,
        detectedSignatures: ["Analysis fallback"],
      });
    };

    reader.readAsArrayBuffer(file);
  });
}
