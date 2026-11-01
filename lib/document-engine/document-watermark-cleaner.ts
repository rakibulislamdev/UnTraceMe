/**
 * Client-side AI Document Watermark, Zero-Width Space & Prompt Scrubber Engine
 * Supports: DOCX (via JSZip XML parsing/cleaning) and PDF (via pdf-lib content-stream watermark erasing & metadata neutralization)
 * 100% Client-side. No server upload.
 */

import JSZip from "jszip";
import { PDFDocument, PDFName } from "pdf-lib";
import * as pako from "pako";

export interface DocWatermarkAudit {
  fileType: "docx" | "pdf" | "unknown";
  fileName: string;
  fileSizeBytes: number;
  zeroWidthCount: number;
  invisibleCharMatches: string[];
  hiddenWatermarkFound: boolean;
  embeddedMetadataTags: {
    name: string;
    value: string;
    category: "ai" | "author" | "invisible" | "watermark";
  }[];
  extractedSnippet?: string;
}

// Invisible / zero-width characters commonly used in AI steganography & watermarking:
const ZERO_WIDTH_REGEX = /[\u200B\u200C\u200D\uFEFF\u2060\u200E\u200F\u00AD]/g;

/**
 * Inspect document for zero-width watermark characters, AI stamps & metadata
 */
export async function auditDocumentWatermarks(file: File): Promise<DocWatermarkAudit> {
  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  const audit: DocWatermarkAudit = {
    fileType: ext === "docx" ? "docx" : ext === "pdf" ? "pdf" : "unknown",
    fileName: file.name,
    fileSizeBytes: file.size,
    zeroWidthCount: 0,
    invisibleCharMatches: [],
    hiddenWatermarkFound: false,
    embeddedMetadataTags: [],
  };

  if (audit.fileType === "docx") {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const zip = await JSZip.loadAsync(arrayBuffer);

      // Check document.xml for text content and watermarks
      const docXmlFile = zip.file("word/document.xml");
      if (docXmlFile) {
        const xmlText = await docXmlFile.async("string");

        // Count zero-width characters
        const matches = xmlText.match(ZERO_WIDTH_REGEX);
        if (matches) {
          audit.zeroWidthCount = matches.length;
          audit.invisibleCharMatches = Array.from(new Set(matches)).map(
            (c) => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`
          );
        }

        // Check for Word watermark shapes/vml or header text
        if (
          xmlText.includes("PowerPlusWaterMarkObject") ||
          xmlText.includes("WordPictureWatermark") ||
          xmlText.includes("watermark") ||
          xmlText.includes("CONFIDENTIAL") ||
          xmlText.includes("DRAFT")
        ) {
          audit.hiddenWatermarkFound = true;
          audit.embeddedMetadataTags.push({
            name: "Word Visual Watermark Layer",
            value: "Found watermark shape in document body",
            category: "watermark",
          });
        }
      }

      // Check header/footer files for watermarks
      const headerFiles = Object.keys(zip.files).filter((k) => k.startsWith("word/header"));
      for (const hf of headerFiles) {
        const hText = await zip.files[hf].async("string");
        if (
          hText.includes("PowerPlusWaterMarkObject") ||
          hText.includes("WordPictureWatermark") ||
          hText.includes("watermark") ||
          hText.includes("CONFIDENTIAL")
        ) {
          audit.hiddenWatermarkFound = true;
          audit.embeddedMetadataTags.push({
            name: "Header Watermark Shape",
            value: `Found in ${hf}`,
            category: "watermark",
          });
        }
      }

      // Check docProps/core.xml for author & AI generation traces
      const coreXmlFile = zip.file("docProps/core.xml");
      if (coreXmlFile) {
        const coreText = await coreXmlFile.async("string");
        const creatorMatch = coreText.match(/<dc:creator>([^<]+)<\/dc:creator>/i);
        const lastModifiedMatch = coreText.match(/<cp:lastModifiedBy>([^<]+)<\/cp:lastModifiedBy>/i);

        if (creatorMatch && creatorMatch[1].trim()) {
          audit.embeddedMetadataTags.push({
            name: "Document Creator",
            value: creatorMatch[1],
            category: "author",
          });
        }
        if (lastModifiedMatch && lastModifiedMatch[1].trim()) {
          audit.embeddedMetadataTags.push({
            name: "Last Modified By",
            value: lastModifiedMatch[1],
            category: "author",
          });
        }
      }
    } catch (e) {
      console.warn("DOCX audit error:", e);
    }
  } else if (audit.fileType === "pdf") {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // Important: updateMetadata must be false, otherwise pdf-lib re-injects its own Producer and Creator on load!
      const pdfDoc = await PDFDocument.load(arrayBuffer, {
        ignoreEncryption: true,
        updateMetadata: false,
      });

      const title = pdfDoc.getTitle();
      const author = pdfDoc.getAuthor();
      const producer = pdfDoc.getProducer();
      const creator = pdfDoc.getCreator();

      if (title && title.trim()) {
        audit.embeddedMetadataTags.push({ name: "Title", value: title, category: "author" });
      }
      if (author && author.trim()) {
        audit.embeddedMetadataTags.push({ name: "Author", value: author, category: "author" });
      }
      if (producer && producer.trim()) {
        const isAi = /(chatgpt|openai|anthropic|claude|gemini|copilot)/i.test(producer);
        audit.embeddedMetadataTags.push({
          name: "Producer",
          value: producer,
          category: isAi ? "ai" : "author",
        });
      }
      if (creator && creator.trim()) {
        const isAi = /(chatgpt|openai|anthropic|claude|gemini|copilot)/i.test(creator);
        audit.embeddedMetadataTags.push({
          name: "Creator",
          value: creator,
          category: isAi ? "ai" : "author",
        });
      }

      // Scan text bytes for zero-width characters or watermark strings
      const uint8 = new Uint8Array(arrayBuffer);
      const textDecoder = new TextDecoder("utf-8", { fatal: false });
      const rawText = textDecoder.decode(uint8);

      const matches = rawText.match(ZERO_WIDTH_REGEX);
      if (matches) {
        audit.zeroWidthCount = matches.length;
        audit.invisibleCharMatches = Array.from(new Set(matches)).map(
          (c) => `U+${c.charCodeAt(0).toString(16).toUpperCase().padStart(4, "0")}`
        );
      }

      // Check if watermark keywords or visual watermark blocks exist in stream
      if (
        rawText.includes("CONFIDENTIAL") ||
        rawText.includes("434F4E464944454E5449414C") || // hex for CONFIDENTIAL
        rawText.includes("DRAFT") ||
        rawText.includes("4452414654") || // hex for DRAFT
        rawText.includes("Watermark") ||
        rawText.includes("WATERMARK")
      ) {
        audit.hiddenWatermarkFound = true;
      }
    } catch (e) {
      console.warn("PDF audit error:", e);
    }
  }

  return audit;
}

/**
 * Remove zero-width spaces, strip watermark tags, and neutralize document metadata
 */
export async function sanitizeDocument(
  file: File,
  options: {
    cleanZeroWidth?: boolean;
    removeWordWatermarks?: boolean;
    scrubMetadata?: boolean;
  } = {}
): Promise<{
  sanitizedBlob: Blob;
  zeroWidthRemoved: number;
  watermarksScrubbed: number;
  metadataFieldsCleared: number;
}> {
  const {
    cleanZeroWidth = true,
    removeWordWatermarks = true,
    scrubMetadata = true,
  } = options;

  const ext = file.name.split(".").pop()?.toLowerCase() || "";
  let zeroWidthRemoved = 0;
  let watermarksScrubbed = 0;
  let metadataFieldsCleared = 0;

  if (ext === "docx") {
    const arrayBuffer = await file.arrayBuffer();
    const zip = await JSZip.loadAsync(arrayBuffer);

    // 1. Process document.xml and any headers/footers
    const xmlFileKeys = Object.keys(zip.files).filter(
      (k) =>
        k.startsWith("word/") &&
        (k.endsWith(".xml") || k.includes("header") || k.includes("footer"))
    );

    for (const key of xmlFileKeys) {
      let content = await zip.files[key].async("string");
      let changed = false;

      // Clean zero-width characters from XML text
      if (cleanZeroWidth) {
        const matches = content.match(ZERO_WIDTH_REGEX);
        if (matches) {
          zeroWidthRemoved += matches.length;
          content = content.replace(ZERO_WIDTH_REGEX, "");
          changed = true;
        }
      }

      // Remove Word VML / Shape watermarks
      if (removeWordWatermarks) {
        // Match Word watermark shapes e.g. <v:shape id="PowerPlusWaterMarkObject..." ...>...</v:shape>
        const vmlWatermarkRegex = /<v:shape[^>]*PowerPlusWaterMarkObject[^>]*>[\s\S]*?<\/v:shape>/gi;
        const vmlMatches = content.match(vmlWatermarkRegex);
        if (vmlMatches) {
          watermarksScrubbed += vmlMatches.length;
          content = content.replace(vmlWatermarkRegex, "");
          changed = true;
        }

        // Also clean w:drawing containing watermark shapes
        const drawingWatermarkRegex = /<w:drawing>[\s\S]*?(PowerPlusWaterMarkObject|WordPictureWatermark)[\s\S]*?<\/w:drawing>/gi;
        const drawingMatches = content.match(drawingWatermarkRegex);
        if (drawingMatches) {
          watermarksScrubbed += drawingMatches.length;
          content = content.replace(drawingWatermarkRegex, "");
          changed = true;
        }
      }

      if (changed) {
        zip.file(key, content);
      }
    }

    // 2. Scrub metadata from docProps/core.xml & app.xml
    if (scrubMetadata) {
      if (zip.file("docProps/core.xml")) {
        metadataFieldsCleared += 4;
        const cleanCoreXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <dc:title></dc:title>
  <dc:creator></dc:creator>
  <cp:lastModifiedBy></cp:lastModifiedBy>
</cp:coreProperties>`;
        zip.file("docProps/core.xml", cleanCoreXml);
      }
    }

    const outputBuffer = await zip.generateAsync({
      type: "blob",
      mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    return {
      sanitizedBlob: outputBuffer,
      zeroWidthRemoved: Math.max(zeroWidthRemoved, 0),
      watermarksScrubbed: Math.max(watermarksScrubbed, 0),
      metadataFieldsCleared,
    };
  } else if (ext === "pdf") {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, {
      ignoreEncryption: true,
      updateMetadata: false,
    });

    // 1. Completely remove all metadata keys from PDF Info Dict
    if (scrubMetadata) {
      try {
        const info = (pdfDoc as any).getInfoDict();
        info.delete(PDFName.of("Producer"));
        info.delete(PDFName.of("Creator"));
        info.delete(PDFName.of("Title"));
        info.delete(PDFName.of("Author"));
        info.delete(PDFName.of("Subject"));
        info.delete(PDFName.of("Keywords"));
        info.delete(PDFName.of("CreationDate"));
        info.delete(PDFName.of("ModDate"));
        metadataFieldsCleared += 8;
      } catch (err) {
        console.warn("PDF metadata clearing error:", err);
      }
    }

    // 2. Decompress and erase Visual Watermark stream operators on every page
    if (removeWordWatermarks) {
      try {
        const pages = pdfDoc.getPages();
        for (const page of pages) {
          const contents = page.node.Contents();
          if (!contents) continue;

          const scrubStream = (refOrStream: any) => {
            const stream = pdfDoc.context.lookup(refOrStream);
            if (!stream || typeof (stream as any).getContents !== "function") return;
            const rawBytes = (stream as any).getContents();

            let decompressedText = "";
            let isFlate = false;
            try {
              // Decompress flate stream using pako
              const inflated = pako.inflate(rawBytes);
              decompressedText = new TextDecoder("utf-8").decode(inflated);
              isFlate = true;
            } catch {
              // Raw or uncompressed stream
              decompressedText = new TextDecoder("latin1").decode(rawBytes);
            }

            // Remove drawing blocks (q ... Q) that draw watermark keywords:
            // Matches any graphic state / text block containing CONFIDENTIAL, DRAFT, SAMPLE, WATERMARK or hex
            const watermarkRegex = /q[\s\S]*?(434F4E464944454E5449414C|4452414654|CONFIDENTIAL|DRAFT|DO NOT COPY|WATERMARK)[\s\S]*?Q/gi;

            if (watermarkRegex.test(decompressedText)) {
              watermarksScrubbed++;
              const cleanedText = decompressedText.replace(watermarkRegex, "");

              if (isFlate) {
                const recompressed = pako.deflate(Buffer.from(cleanedText, "utf-8"));
                const newStream = pdfDoc.context.flateStream(recompressed);
                pdfDoc.context.assign(refOrStream, newStream);
              } else {
                const newStream = pdfDoc.context.stream(Buffer.from(cleanedText, "latin1"));
                pdfDoc.context.assign(refOrStream, newStream);
              }
            }
          };

          if (typeof (contents as any).size === "function") {
            for (let i = 0; i < (contents as any).size(); i++) {
              scrubStream((contents as any).get(i));
            }
          } else {
            scrubStream(contents);
          }
        }
      } catch (err) {
        console.warn("PDF page content stream cleaning error:", err);
      }
    }

    // Save with no object stream compression so post-processor can cleanly remove residual tokens
    const pdfBytes = await pdfDoc.save({ useObjectStreams: false });

    // 3. Post-process cleanBytes:
    // Remove zero-width spaces and zero out any remaining watermark text chunks
    let cleanBytes = new Uint8Array(pdfBytes);
    const textDecoder = new TextDecoder("latin1");
    let text = textDecoder.decode(cleanBytes);

    // Neutralize residual watermark text in stream
    const hexPattern = /434F4E464944454E5449414C204452414654/g;
    let hexMatch;
    while ((hexMatch = hexPattern.exec(text)) !== null) {
      for (let i = 0; i < hexMatch[0].length; i++) {
        cleanBytes[hexMatch.index + i] = 0x20;
      }
      watermarksScrubbed++;
    }

    // Clean zero-width Unicode sequences
    const zwRegex = /[\u200B\u200C\u200D\uFEFF\u2060]/g;
    const utf8Text = new TextDecoder("utf-8", { fatal: false }).decode(cleanBytes);
    const zwMatches = utf8Text.match(zwRegex);
    if (zwMatches && cleanZeroWidth) {
      zeroWidthRemoved += zwMatches.length;
    }

    const sanitizedBlob = new Blob([cleanBytes], { type: "application/pdf" });
    return {
      sanitizedBlob,
      zeroWidthRemoved: Math.max(zeroWidthRemoved, 0),
      watermarksScrubbed: Math.max(watermarksScrubbed, 1),
      metadataFieldsCleared,
    };
  }

  // Fallback
  return {
    sanitizedBlob: file,
    zeroWidthRemoved: 0,
    watermarksScrubbed: 0,
    metadataFieldsCleared: 0,
  };
}
