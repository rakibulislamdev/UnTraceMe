/**
 * Distinct Humanization Profile Dictionaries & Sentence Cadence Engines
 */

// 1. Natural Profile Replacements (Conversational, contractions, relatable)
const NATURAL_REPLACEMENTS: Record<string, string[]> = {
  "furthermore": ["also", "on top of that", "plus"],
  "moreover": ["what's more", "besides", "also"],
  "in conclusion": ["to sum it up", "in the end", "all in all"],
  "delve into": ["explore", "check out", "dig into"],
  "delves into": ["explores", "looks closely at", "digs into"],
  "pivotal": ["key", "huge", "super important"],
  "testament to": ["proof of", "clear sign of"],
  "foster": ["build", "encourage", "grow"],
  "fosters": ["builds", "encourages", "grows"],
  "beacon": ["guide", "bright example"],
  "it is important to note that": ["keep in mind that", "worth noting that"],
  "it is essential to": ["you really need to", "it helps to"],
  "undeniably": ["clearly", "for sure", "without a doubt"],
  "leverage": ["use", "take advantage of"],
  "leveraging": ["using", "drawing on"],
  "crucial aspect": ["big factor", "key thing"],
  "tapestry": ["mix", "blend"],
};

// 2. Academic Profile Replacements (Scholarly, precise, high-register, no slang)
const ACADEMIC_REPLACEMENTS: Record<string, string[]> = {
  "furthermore": ["additionally", "correspondingly", "in addition"],
  "moreover": ["likewise", "subsequently", "similarly"],
  "in conclusion": ["in summary", "ultimately", "synthesizing these findings"],
  "delve into": ["investigate", "examine critically", "interrogate"],
  "delves into": ["investigates", "examines critically", "evaluates"],
  "pivotal": ["crucial", "paramount", "foundational"],
  "testament to": ["demonstration of", "empirical indicator of", "manifestation of"],
  "foster": ["cultivate", "facilitate", "stimulate"],
  "fosters": ["cultivates", "facilitates", "stimulates"],
  "beacon": ["exemplar", "benchmark"],
  "it is important to note that": ["notably,", "it should be observed that"],
  "it is essential to": ["it remains imperative to", "scholars must"],
  "undeniably": ["evidently", "demonstrably", "unquestionably"],
  "leverage": ["utilize", "apply", "operationalize"],
  "leveraging": ["utilizing", "applying", "operationalizing"],
  "crucial aspect": ["primary determinant", "critical dimension"],
  "tapestry": ["complex configuration", "heterogeneous domain"],
};

// 3. Stealth Profile Replacements (Aggressively strips Turnitin/GPTZero statistical signatures)
const STEALTH_REPLACEMENTS: Record<string, string[]> = {
  "furthermore": ["along with this", "together with that", "then too"],
  "moreover": ["on a related note", "at the same time"],
  "in conclusion": ["taking everything into account", "when all is weighed"],
  "delve into": ["closely inspect", "sift through", "weigh"],
  "delves into": ["closely inspects", "sifts through", "weighs"],
  "pivotal": ["central", "defining", "vital"],
  "testament to": ["plain indication of", "tangible proof of"],
  "foster": ["spark", "spur", "advance"],
  "fosters": ["sparks", "spurs", "advances"],
  "beacon": ["touchstone", "guiding model"],
  "it is important to note that": ["one notices that", "a telling detail is that"],
  "it is essential to": ["one is obliged to", "it proves necessary to"],
  "undeniably": ["plainly", "by all measures"],
  "leverage": ["employ", "harness", "draw upon"],
  "leveraging": ["employing", "harnessing", "drawing upon"],
  "crucial aspect": ["major element", "telling factor"],
  "tapestry": ["mosaic", "interplay"],
};

export function humanizeTextHeuristically(
  text: string, 
  mode: "academic" | "natural" | "stealth"
): string {
  const dictionary = 
    mode === "academic"
      ? ACADEMIC_REPLACEMENTS
      : mode === "stealth"
      ? STEALTH_REPLACEMENTS
      : NATURAL_REPLACEMENTS;

  const paragraphs = text.split(/\n\s*\n/);

  const humanizedParagraphs = paragraphs.map((para) => {
    const sentences = para.split(/(?<=[.?!])\s+/);
    if (sentences.length === 0) return para;

    const transformedSentences = sentences.map((sentence, idx) => {
      let s = sentence.trim();

      // 1. Dictionary Phrase Replacement based on chosen profile
      for (const [robotic, replacements] of Object.entries(dictionary)) {
        const regex = new RegExp(`\\b${robotic}\\b`, "gi");
        if (regex.test(s)) {
          const chosen = replacements[idx % replacements.length];
          s = s.replace(regex, (match) => {
            return match[0] === match[0].toUpperCase()
              ? chosen.charAt(0).toUpperCase() + chosen.slice(1)
              : chosen;
          });
        }
      }

      // 2. Structural & Cadence Differentiation
      if (mode === "natural") {
        // Natural contractions & conversational cadence
        s = s.replace(/\bdo not\b/gi, "don't")
             .replace(/\bcannot\b/gi, "can't")
             .replace(/\bwill not\b/gi, "won't")
             .replace(/\bis not\b/gi, "isn't")
             .replace(/\bare not\b/gi, "aren't")
             .replace(/\bhas not\b/gi, "hasn't");
      } else if (mode === "academic") {
        // Enforce scholarly third-person syntax & expand informal contractions
        s = s.replace(/\bdon't\b/gi, "do not")
             .replace(/\bcan't\b/gi, "cannot")
             .replace(/\bwon't\b/gi, "will not")
             .replace(/\bisn't\b/gi, "is not");
      } else if (mode === "stealth") {
        // Turnitin Stealth: Dynamic clause restructuring to spike burstiness
        if (s.length > 90 && s.includes(",")) {
          const commaIdx = s.indexOf(",");
          if (commaIdx > 20 && commaIdx < s.length - 20) {
            const firstPart = s.slice(0, commaIdx).trim();
            const secondPart = s.slice(commaIdx + 1).trim();
            s = `${firstPart}; consequently, ${secondPart.charAt(0).toLowerCase() + secondPart.slice(1)}`;
          }
        }
      }

      return s;
    });

    return transformedSentences.join(" ");
  });

  return humanizedParagraphs.join("\n\n");
}
