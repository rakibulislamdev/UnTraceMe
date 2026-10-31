export interface ExtractedColor {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
  population: number; // percentage of image
  isDark: boolean;
  contrastOnWhite: number;
  contrastOnBlack: number;
  role: "primary" | "secondary" | "accent" | "surface" | "muted";
}

export interface PaletteAnalysisResult {
  dominantColors: ExtractedColor[];
  dominantHex: string;
  cssVariables: string;
  tailwindConfig: string;
  jsonTokens: string;
}

// Helper to convert RGB to HEX
function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
      })
      .join("")
  );
}

// Helper to convert RGB to HSL
function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

// Relative luminance for WCAG contrast
function getLuminance(r: number, g: number, b: number): number {
  const [rs, gs, bs] = [r, g, b].map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Contrast ratio
function getContrast(lum1: number, lum2: number): number {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
}

// Client-side Quantization using Color Bucketing
export async function extractPaletteFromImage(
  imageSrc: string,
  colorCount: number = 6
): Promise<PaletteAnalysisResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      // Downscale to speed up sampling and average out noise
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return reject(new Error("Canvas context unavailable"));

      const maxDim = 200;
      let width = img.naturalWidth;
      let height = img.naturalHeight;
      if (width > height) {
        if (width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        }
      } else {
        if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const imageData = ctx.getImageData(0, 0, width, height).data;
      const totalPixels = width * height;

      // Color quantization via 5-bit color buckets
      const colorBuckets = new Map<string, { r: number; g: number; b: number; count: number }>();

      for (let i = 0; i < imageData.length; i += 4) {
        const a = imageData[i + 3];
        if (a < 128) continue; // ignore transparent pixels

        const r = imageData[i];
        const g = imageData[i + 1];
        const b = imageData[i + 2];

        // Quantize by rounding down to steps of 16 (4-bit reduction)
        const qR = Math.round(r / 16) * 16;
        const qG = Math.round(g / 16) * 16;
        const qB = Math.round(b / 16) * 16;
        const key = `${qR},${qG},${qB}`;

        const existing = colorBuckets.get(key);
        if (existing) {
          existing.count += 1;
        } else {
          colorBuckets.set(key, { r, g, b, count: 1 });
        }
      }

      // Sort by population
      const sortedBuckets = Array.from(colorBuckets.values()).sort(
        (a, b) => b.count - a.count
      );

      // Select top diverse colors
      const chosenColors: { r: number; g: number; b: number; count: number }[] = [];

      for (const bucket of sortedBuckets) {
        if (chosenColors.length >= colorCount) break;

        // Check if perceptually too close to an already selected color
        const isTooClose = chosenColors.some((c) => {
          const dist = Math.sqrt(
            Math.pow(c.r - bucket.r, 2) +
            Math.pow(c.g - bucket.g, 2) +
            Math.pow(c.b - bucket.b, 2)
          );
          return dist < 38; // Distance threshold for diversity
        });

        if (!isTooClose) {
          chosenColors.push(bucket);
        }
      }

      const whiteLum = getLuminance(255, 255, 255);
      const blackLum = getLuminance(0, 0, 0);

      const roles: ExtractedColor["role"][] = [
        "primary",
        "secondary",
        "accent",
        "surface",
        "muted",
      ];

      const dominantColors: ExtractedColor[] = chosenColors.map((c, idx) => {
        const hex = rgbToHex(c.r, c.g, c.b);
        const hsl = rgbToHsl(c.r, c.g, c.b);
        const lum = getLuminance(c.r, c.g, c.b);
        const population = Math.round((c.count / totalPixels) * 100);

        return {
          hex,
          rgb: [c.r, c.g, c.b],
          hsl,
          population: Math.max(1, population),
          isDark: lum < 0.35,
          contrastOnWhite: getContrast(lum, whiteLum),
          contrastOnBlack: getContrast(lum, blackLum),
          role: roles[idx] || "muted",
        };
      });

      const dominantHex = dominantColors[0]?.hex || "#000000";

      // Formatted Token Outputs
      const cssVariables = `:root {\n${dominantColors
        .map((c, i) => `  --color-${c.role || `palette-${i + 1}`}: ${c.hex}; /* Population: ${c.population}% */`)
        .join("\n")}\n}`;

      const tailwindConfig = `// tailwind.config.ts\nextend: {\n  colors: {\n${dominantColors
        .map((c, i) => `    "${c.role || `color-${i + 1}`}": "${c.hex}",`)
        .join("\n")}\n  }\n}`;

      const jsonTokens = JSON.stringify(
        {
          meta: { generatedBy: "UnTraceMe Palette Studio", version: "1.0" },
          palette: dominantColors.map((c, i) => ({
            name: c.role || `palette-${i + 1}`,
            hex: c.hex,
            rgb: `rgb(${c.rgb.join(", ")})`,
            hsl: `hsl(${c.hsl[0]}, ${c.hsl[1]}%, ${c.hsl[2]}%)`,
            populationPercent: c.population,
            wcagContrast: {
              onWhite: c.contrastOnWhite,
              onBlack: c.contrastOnBlack,
            },
          })),
        },
        null,
        2
      );

      resolve({
        dominantColors,
        dominantHex,
        cssVariables,
        tailwindConfig,
        jsonTokens,
      });
    };

    img.onerror = reject;
    img.src = imageSrc;
  });
}

