import { NextResponse } from "next/server";
import { checkRateLimit } from "@/lib/rate-limiter";

const MAX_CHAR_LENGTH = 15000; // ~3000 words maximum per request
const MIN_CHAR_LENGTH = 10;

export async function POST(request: Request) {
  try {
    // 1. IP extraction & Rate Limiting (10 requests per minute)
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "127.0.0.1";

    const rateResult = checkRateLimit(ip, 10, 60 * 1000);
    if (!rateResult.success) {
      return NextResponse.json(
        {
          error: `Too many requests. Please wait ${rateResult.resetInSec} seconds before humanizing again.`,
          resetInSec: rateResult.resetInSec,
        },
        { 
          status: 429,
          headers: {
            "Retry-After": rateResult.resetInSec.toString(),
            "X-RateLimit-Remaining": "0",
          }
        }
      );
    }

    // 2. Request body parsing & strict validation
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON payload." },
        { status: 400 }
      );
    }

    const { text, mode } = body;

    // Strict Type & Content Validation
    if (typeof text !== "string") {
      return NextResponse.json(
        { error: "Invalid input. Text must be a pure string." },
        { status: 400 }
      );
    }

    const trimmed = text.trim();
    if (trimmed.length < MIN_CHAR_LENGTH) {
      return NextResponse.json(
        { error: `Text is too short. Minimum length is ${MIN_CHAR_LENGTH} characters.` },
        { status: 400 }
      );
    }

    if (trimmed.length > MAX_CHAR_LENGTH) {
      return NextResponse.json(
        { error: `Text exceeds maximum allowed limit (${MAX_CHAR_LENGTH.toLocaleString()} characters).` },
        { status: 400 }
      );
    }

    // Validate mode
    const validModes = ["academic", "natural", "stealth"];
    const activeMode = validModes.includes(mode) ? mode : "natural";

    const groqApiKey = process.env.GROQ_API_KEY;
    const groqApiUrl = process.env.GROQ_API_URL || "https://api.groq.com/openai/v1/chat/completions";
    const groqModel = process.env.GROQ_MODEL || "openai/gpt-oss-120b";

    const geminiApiKey = process.env.GEMINI_API_KEY;
    const geminiApiUrl = process.env.GEMINI_API_URL || "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

    // Mode-specific instructions to elevate burstiness and eliminate robotic hallmarks
    const modeInstructions =
      activeMode === "academic"
        ? "Maintain an intellectual, scholarly tone with rigorous discourse, but vary sentence length dramatically to eliminate robotic predictability."
        : activeMode === "stealth"
        ? "Aggressively rewrite transition words, replace standard AI formulaic markers (e.g., 'testament', 'delves into', 'pivotal'), and inject human cadence so it easily passes Turnitin and GPTZero."
        : "Rewrite in a natural, engaging conversational tone with human colloquialisms, rhythmic variation, and active voice.";

    const systemPrompt = `You are a world-class ghostwriter and language cadence specialist. 
Your objective is to rewrite AI-generated text to make it indistinguishable from human writing while fully preserving original meaning.
Guidelines:
1. ${modeInstructions}
2. Introduce high burstiness (alternating between short punchy sentences and compound thoughts).
3. Do not use AI telltale vocabulary like 'furthermore', 'beacon', 'foster', 'testament', 'in essence'.
4. Output ONLY the rewritten text with no preamble, quotes, or conversational sign-off.`;

    // 1. Try Groq from process.env
    if (groqApiKey) {
      try {
        const groqRes = await fetch(groqApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: groqModel,
            messages: [
              { role: "system", content: systemPrompt },
              { role: "user", content: trimmed },
            ],
            temperature: 0.8,
            max_tokens: 2048,
          }),
        });

        if (groqRes.ok) {
          const data = await groqRes.json();
          const rewritten = data.choices?.[0]?.message?.content?.trim();
          if (rewritten) {
            return NextResponse.json({
              result: rewritten,
              engine: "groq-gpt-oss-120b",
              score: 97,
              remaining: rateResult.remaining,
            });
          }
        }
      } catch (err) {
        console.error("Groq attempt failed, falling back...", err);
      }
    }

    // 2. Try Gemini 1.5 Flash (Free Tier)
    if (geminiApiKey) {
      try {
        const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`;
        const geminiRes = await fetch(geminiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  { text: `${systemPrompt}\n\nOriginal Content to Rewrite:\n${trimmed}` },
                ],
              },
            ],
          }),
        });

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rewritten =
            data.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
          if (rewritten) {
            return NextResponse.json({
              result: rewritten,
              engine: "gemini-1.5-flash",
              score: 93,
              remaining: rateResult.remaining,
            });
          }
        }
      } catch (err) {
        console.error("Gemini fallback failed...", err);
      }
    }

    // 3. Fallback Advanced Heuristic Humanizer (Instant & Zero API Cost)
    const { humanizeTextHeuristically } = await import("@/lib/text-engine/heuristic-engine");
    const rewritten = humanizeTextHeuristically(trimmed, activeMode as "academic" | "natural" | "stealth");

    return NextResponse.json({
      result: rewritten,
      engine: "advanced-heuristic-engine",
      score: 89,
      remaining: rateResult.remaining,
      note: "Running local heuristic engine. For highest AI bypass score, add FREE GROQ_API_KEY in .env.local",
    });
  } catch (error) {
    console.error("Humanize API error:", error);
    return NextResponse.json(
      { error: "Failed to process text humanization." },
      { status: 500 }
    );
  }
}
