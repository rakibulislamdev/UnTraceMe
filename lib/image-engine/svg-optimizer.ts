/**
 * Client-side SVG Optimizer & Minifier Engine
 * Zero server uploads, strips XML bloat, comments, editor namespaces (Inkscape, Illustrator, Sketch),
 * cleans metadata tags, and optimizes paths with lossless or lossy decimal precision.
 */

export interface SvgOptimizerOptions {
  stripComments: boolean;
  stripMetadata: boolean;
  stripEditorNamespaces: boolean;
  stripUselessDefs: boolean;
  removeHiddenElements: boolean;
  collapseWhitespace: boolean;
  precision: number; // 1 to 5 decimal places (default 2)
  multipass: boolean;
}

export interface SvgOptimizeResult {
  id: string;
  originalName: string;
  originalSize: number;
  optimizedSize: number;
  savedBytes: number;
  savedPercentage: number;
  cleanedSvgText: string;
  previewUrl: string;
  removedElementsCount: number;
}

/**
 * Optimizes an SVG text string completely client-side via DOMParser and regex rules
 */
export function optimizeSvgString(
  svgString: string,
  options: SvgOptimizerOptions
): { optimizedText: string; removedElementsCount: number } {
  let cleaned = svgString;
  let removedCount = 0;

  // 1. Strip XML comments <!-- ... -->
  if (options.stripComments) {
    const commentMatches = cleaned.match(/<!--[\s\S]*?-->/g);
    if (commentMatches) removedCount += commentMatches.length;
    cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, "");
  }

  // 2. Parse SVG as XML Document for surgical DOM cleanup
  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(cleaned, "image/svg+xml");

      // Check for parsing error
      const parserError = doc.querySelector("parsererror");
      if (!parserError) {
        // Strip metadata tags (<metadata>, <rdf:RDF>, etc.)
        if (options.stripMetadata) {
          const metadatas = doc.querySelectorAll("metadata, desc, title");
          metadatas.forEach((el) => {
            el.remove();
            removedCount++;
          });
        }

        // Strip editor-specific elements & namespaces (Inkscape, Adobe, Corel, Sketch)
        if (options.stripEditorNamespaces) {
          const editorTags = doc.querySelectorAll(
            "sodipodi\\:namedview, inkscape\\:grid, i\\:pgf, foreignObject"
          );
          editorTags.forEach((el) => {
            el.remove();
            removedCount++;
          });

          // Remove editor attributes from all elements
          const allElements = doc.querySelectorAll("*");
          allElements.forEach((el) => {
            const attrNames = Array.from(el.attributes).map((a) => a.name);
            attrNames.forEach((name) => {
              if (
                name.startsWith("inkscape:") ||
                name.startsWith("sodipodi:") ||
                name.startsWith("xmlns:inkscape") ||
                name.startsWith("xmlns:sodipodi") ||
                name.startsWith("xmlns:i") ||
                name.startsWith("xmlns:sketch") ||
                name.startsWith("sketch:") ||
                name.startsWith("xmlns:a") ||
                name === "xml:space"
              ) {
                el.removeAttribute(name);
                removedCount++;
              }
            });
          });
        }

        // Remove hidden elements (display="none", opacity="0", visibility="hidden")
        if (options.removeHiddenElements) {
          const hiddenElements = doc.querySelectorAll(
            '[display="none"], [visibility="hidden"], [opacity="0"]'
          );
          hiddenElements.forEach((el) => {
            // keep defs intact as symbols may be referenced
            if (!el.closest("defs")) {
              el.remove();
              removedCount++;
            }
          });
        }

        // Clean empty defs
        if (options.stripUselessDefs) {
          const defs = doc.querySelectorAll("defs");
          defs.forEach((def) => {
            if (def.children.length === 0) {
              def.remove();
              removedCount++;
            }
          });
        }

        const serializer = new XMLSerializer();
        cleaned = serializer.serializeToString(doc);
      }
    } catch {
      // Fallback to regex cleaning if XML DOM parsing fails
    }
  }

  // 3. Precision rounding of coordinates & path points (e.g., 12.3456789 -> 12.35)
  if (options.precision >= 1 && options.precision <= 4) {
    const p = options.precision;
    // Replace coordinate numbers with rounded decimals
    cleaned = cleaned.replace(/(\d+\.\d{3,})/g, (match) => {
      const num = parseFloat(match);
      return isNaN(num) ? match : num.toFixed(p).replace(/\.?0+$/, "");
    });
  }

  // 4. Collapse superfluous whitespace and line breaks
  if (options.collapseWhitespace) {
    cleaned = cleaned
      .replace(/>\s+</g, "><")
      .replace(/\s{2,}/g, " ")
      .trim();
  }

  return { optimizedText: cleaned, removedElementsCount: removedCount };
}

/**
 * Optimizes an SVG File object and returns downloadable blob & stats
 */
export async function optimizeSvgFile(
  file: File,
  options: SvgOptimizerOptions
): Promise<SvgOptimizeResult> {
  const originalText = await file.text();
  const originalSize = file.size;

  const { optimizedText, removedElementsCount } = optimizeSvgString(originalText, options);

  const optimizedBlob = new Blob([optimizedText], { type: "image/svg+xml;charset=utf-8" });
  const optimizedSize = optimizedBlob.size;
  const savedBytes = Math.max(0, originalSize - optimizedSize);
  const savedPercentage = originalSize > 0 ? Math.round((savedBytes / originalSize) * 100) : 0;
  const previewUrl = URL.createObjectURL(optimizedBlob);

  return {
    id: `${file.name}-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    originalName: file.name,
    originalSize,
    optimizedSize,
    savedBytes,
    savedPercentage,
    cleanedSvgText: optimizedText,
    previewUrl,
    removedElementsCount,
  };
}
