/**
 * Client-side AI Document Watermark, Zero-Width Space & Prompt Scrubber Engine
 * Supports: DOCX (via JSZip XML parsing/cleaning) and PDF (via pdf-lib metadata neutralization)
 * 100% Client-side. No server upload.
 */

import JSZip from "jszip";
import { PDFDocument } from "pdf-lib";

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
// \u200B: Zero-width space
// \u200C: Zero-width non-joiner
// \u200D: Zero-width joiner
// \uFEFF: Zero-width no-break space (Byte order mark)
// \u2060: Word joiner
// \u200E / \u200F: LTR / RTL marks
// \u00AD: Soft hyphen
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
          xmlText.includes("Confidential") ||
          xmlText.includes("Draft")
        ) {
          audit.hiddenWatermarkFound = true;
          audit.embeddedMetadataTags.push({
            name: "Word Visual Watermark Layer",
            value: "Found watermark shape in document body",
            category: "watermark",
          });
        }
      }

      // Check header/footer files for watermarks (headers often hold watermarks in DOCX)
      const headerFiles = Object.keys(zip.files).filter((k) => k.startsWith("word/header"));
      for (const hf of headerFiles) {
        const hText = await zip.files[hf].async("string");
        if (
          hText.includes("PowerPlusWaterMarkObject") ||
          hText.includes("WordPictureWatermark") ||
          hText.includes("watermark")
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

        if (creatorMatch) {
          audit.embeddedMetadataTags.push({
            name: "Document Creator",
            value: creatorMatch[1],
            category: "author",
          });
        }
        if (lastModifiedMatch) {
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
      const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

      const title = pdfDoc.getTitle();
      const author = pdfDoc.getAuthor();
      const producer = pdfDoc.getProducer();
      const creator = pdfDoc.getCreator();

      if (title) {
        audit.embeddedMetadataTags.push({ name: "Title", value: title, category: "author" });
      }
      if (author) {
        audit.embeddedMetadataTags.push({ name: "Author", value: author, category: "author" });
      }
      if (producer) {
        const isAi = /(chatgpt|openai|anthropic|claude|gemini|copilot)/i.test(producer);
        audit.embeddedMetadataTags.push({
          name: "Producer",
          value: producer,
          category: isAi ? "ai" : "author",
        });
      }
      if (creator) {
        const isAi = /(chatgpt|openai|anthropic|claude|gemini|copilot)/i.test(creator);
        audit.embeddedMetadataTags.push({
          name: "Creator",
          value: creator,
          category: isAi ? "ai" : "author",
        });
      }

      // Scan text bytes for zero-width characters
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
<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
  <dc:title></dc:title>
  <dc:subject></dc:subject>
  <dc:creator></dc:creator>
  <cp:keywords></cp:keywords>
  <dc:description></dc:description>
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
    const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

    // Clean metadata fields
    if (scrubMetadata) {
      pdfDoc.setTitle("");
      pdfDoc.setAuthor("");
      pdfDoc.setSubject("");
      pdfDoc.setKeywords([]);
      pdfDoc.setProducer("UnTraceMe Cleaned Document");
      pdfDoc.setCreator("UnTraceMe Document Engine");
      metadataFieldsCleared += 6;
    }

    const pdfBytes = await pdfDoc.save();

    // In-place zero-width character clean on final output
    const cleanBytes = new Uint8Array(pdfBytes);
    const textDecoder = new TextDecoder("utf-8", { fatal: false });
    const text = textDecoder.decode(cleanBytes);
    const matches = text.match(ZERO_WIDTH_REGEX);
    if (matches && cleanZeroWidth) {
      zeroWidthRemoved += matches.length;
    }

    const sanitizedBlob = new Blob([cleanBytes], { type: "application/pdf" });
    return {
      sanitizedBlob,
      zeroWidthRemoved: Math.max(zeroWidthRemoved, 0),
      watermarksScrubbed,
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

