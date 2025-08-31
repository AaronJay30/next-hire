// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { Buffer } from "node:buffer";
import extract from "pdf-extraction";

export const runtime = "nodejs"; // pdf-extraction needs Node runtime

// ------------------ ROUTES ------------------

export async function GET() {
    return NextResponse.json({ status: "ok", message: "API route is working" });
}

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const file = formData.get("resume");
        const course = (formData.get("course") as string) || "";
        const industry = (formData.get("industry") as string) || "";

        if (!(file instanceof Blob) || !course || !industry) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        // ✅ Only allow PDFs (optional)
        const mime = (file as any).type || "";
        if (mime && mime !== "application/pdf") {
            return NextResponse.json(
                { error: "Only PDF resumes are supported." },
                { status: 400 }
            );
        }

        // ✅ Extract resume text
        const resumeText = await extractWithPdfExtraction(file);
        if (!resumeText || resumeText.length < 50) {
            throw new Error(
                "Failed to extract meaningful text from the resume file"
            );
        }

        // ✅ Build AI prompt
        const prompt = getAnalysisPrompt(
            truncate(resumeText, 12000),
            course,
            industry
        );

        // ✅ Call AI (Groq)
        const raw = await callGroq(prompt);

        // ✅ Parse AI response safely
        const parsed = parseJsonLoose(raw);
        if (!parsed) {
            console.error("Raw AI output (could not parse JSON):", raw);
            throw new Error(
                "AI did not return valid JSON. See server logs for raw output."
            );
        }

        // ✅ Dynamic scoring logic
        const overallScore = parsed.overallRating
            ? Math.min(
                  100,
                  Math.max(0, Math.round(Number(parsed.overallRating) * 10))
              )
            : 50;

        const keywordOptimizationScore = parsed.keywordOptimizationScore
            ? Math.min(
                  100,
                  Math.max(0, Number(parsed.keywordOptimizationScore))
              )
            : parsed.recommendedAdditions &&
              parsed.recommendedAdditions.length > 0
            ? 80
            : 65;

        const atsCompatibilityScore = parsed.atsCompatibilityScore
            ? Math.min(100, Math.max(0, Number(parsed.atsCompatibilityScore)))
            : parsed.atsCompatibilityIssues &&
              parsed.atsCompatibilityIssues.length > 0
            ? 70
            : 85;

        // ✅ Map AI response → UI schema
        const analysis = {
            overallScore,
            strengths: Array.isArray(parsed.keyStrengths)
                ? parsed.keyStrengths
                : [],
            improvements: Array.isArray(parsed.areasForImprovement)
                ? parsed.areasForImprovement
                : [],
            keywordOptimization: {
                score: keywordOptimizationScore,
                suggestions: Array.isArray(parsed.recommendedAdditions)
                    ? parsed.recommendedAdditions
                    : [],
                keywords: Array.isArray(parsed.recommendedKeywords)
                    ? parsed.recommendedKeywords
                    : [],
            },
            atsCompatibility: {
                score: atsCompatibilityScore,
                issues: Array.isArray(parsed.atsCompatibilityIssues)
                    ? parsed.atsCompatibilityIssues
                    : [],
            },
            recommendations: [
                ...(Array.isArray(parsed.recommendedAdditions)
                    ? parsed.recommendedAdditions
                    : []),
                parsed.summaryAdvice ? String(parsed.summaryAdvice) : "",
            ].filter(Boolean),
        };

        return NextResponse.json({ success: true, analysis });
    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: error.message || "Failed to process resume" },
            { status: 500 }
        );
    }
}

// ------------------ HELPERS ------------------

// Replace these with your env vars:
const GROQ_URL =
    process.env.GROQ_URL || "https://api.groq.com/openai/v1/chat/completions";
const GROQ_KEY = process.env.GROQ_KEY; // ensure this is set in .env.local

async function callGroq(prompt: string): Promise<string> {
    if (!GROQ_URL || !GROQ_KEY)
        throw new Error("Missing GROQ_URL or GROQ_KEY env variables");

    const res = await fetch(GROQ_URL, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${GROQ_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            model: "meta-llama/llama-4-scout-17b-16e-instruct",
            messages: [{ role: "user", content: prompt }],
        }),
    });

    if (!res.ok) {
        const errorText = await res.text().catch(() => "");
        throw new Error(`Groq API error: ${errorText}`);
    }

    const data = await res.json();
    const maybe =
        data?.choices?.[0]?.message?.content ?? data?.choices?.[0]?.text ?? "";

    if (!maybe && data) {
        // If Groq returns text differently, stringify to help debugging
        return typeof data === "string" ? data : JSON.stringify(data);
    }

    return String(maybe);
}

/** Robust PDF extraction */
async function extractWithPdfExtraction(file: Blob): Promise<string> {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const data = await extract(buffer);
    const text = (data?.text || "").trim();
    if (!text)
        throw new Error("No readable text found in PDF (it may be scanned).");
    return text;
}

function getAnalysisPrompt(
    resumeText: string,
    course: string,
    industry: string
) {
    return `You are a senior HR recruiter with 10+ years of experience evaluating candidates who graduated in ${course} and are applying to roles in ${industry}. 
Carefully analyze the RESUME TEXT provided below and respond ONLY with valid JSON (no commentary, no code fences, no extra fields). The JSON must follow this schema exactly:

{
  "overallRating": number,                 // integer 1-10 (holistic fit for ${industry})
  "keyStrengths": string[],                // 3-8 concise bullet points (skills, experiences, degrees)
  "areasForImprovement": string[],         // 3-8 concise bullet points (gaps, missing metrics, clarity)
  "recommendedAdditions": string[],        // 3-6 actionable items (skills, certs, projects, phrasing)
  "recommendedKeywords": string[],         // 6-12 high-value industry keywords to add (single words or short phrases)
  "keywordOptimizationScore": number,      // 0-100 (how well resume matches target keywords)
  "atsCompatibilityScore": number,         // 0-100 (how well resume will be parsed by ATS)
  "atsCompatibilityIssues": string[],      // list of issues that may break ATS parsing (formatting, images, tables, headers)
  "summaryAdvice": string                  // 1-2 short paragraphs (max ~150 words) with clear next steps
}

Guidelines for producing values:
- overallRating: provide an integer between 1 (low) and 10 (excellent) reflecting fit for ${industry}.
- keyStrengths: be specific (e.g., "Built REST APIs in Node.js; reduced API latency by 30%"), avoid vague phrases.
- areasForImprovement: be actionable (e.g., "Add quantifiable results", "Clarify role responsibilities", "Include leadership examples").
- recommendedAdditions: prioritize items that are achievable within 1–3 months (courses, certs, sample projects).
- recommendedKeywords: select terms commonly found in ${industry} job descriptions and relevant to ${course}; prefer canonical spellings (e.g., "React", "REST API", "CI/CD").
- keywordOptimizationScore: compute as integer percent representing keyword coverage and relevance (0 = none, 100 = excellent coverage). Base it on the presence and placement of the top recommended keywords.
- atsCompatibilityScore: compute as integer percent reflecting ease of parsing by Applicant Tracking Systems (headers, text-only layout, no images/tables, standard section names). 100 = fully ATS-friendly.
- atsCompatibilityIssues: list concrete parsing problems (e.g., "Header image with contact info", "Two-column layout", "Unclear section headings like 'Accomplish' instead of 'Experience'").
- summaryAdvice: concise, prioritized steps (exact 3–5 bullets/next actions may be embedded in the paragraph but keep it short).

If the resume omits information, make conservative inferences but mark them as inferred — for example include the word "(inferred)" in the recommendation text when you infer something.

RESPOND ONLY WITH THE JSON OBJECT (no explanation, no preamble). The "Resume" text follows below.

RESUME_TEXT_START
${resumeText}
RESUME_TEXT_END`;
}

/** Loosely parse AI output into JSON:
 * - strips markdown fences
 * - extracts a balanced {...} substring
 * - attempts a few cleanups (remove comments, trailing commas)
 */
function parseJsonLoose(raw: string | null | undefined): any | null {
    if (!raw) return null;

    // Step 1 — remove triple backticks and language fences
    let s = String(raw)
        .replace(/```(?:json|js|txt)?/gi, "")
        .replace(/```/g, "")
        .trim();

    // Step 2 — find the first balanced JSON object substring
    const jsonSub = findBalancedJson(s);
    if (jsonSub) {
        const cleaned = cleanPotentialJson(jsonSub);
        try {
            return JSON.parse(cleaned);
        } catch {
            // continue to other attempts
        }
    }

    // Step 3 — try to parse the whole cleaned string (after removing comments/trailing commas)
    const wholeClean = cleanPotentialJson(s);
    try {
        return JSON.parse(wholeClean);
    } catch {
        // final fallback: return null so caller can handle/log raw
        return null;
    }
}

/** Find first balanced {...} substring using brace counting */
function findBalancedJson(s: string): string | null {
    const start = s.indexOf("{");
    if (start === -1) return null;
    let depth = 0;
    for (let i = start; i < s.length; i++) {
        const ch = s[i];
        if (ch === "{") depth++;
        else if (ch === "}") {
            depth--;
            if (depth === 0) {
                return s.slice(start, i + 1);
            }
        }
    }
    return null;
}

/** Clean JSON-like string: remove comments, remove trailing commas */
function cleanPotentialJson(s: string): string {
    // remove JS-style comments
    let cleaned = s.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

    // replace smart quotes with normal quotes
    cleaned = cleaned.replace(/[‘’]/g, "'").replace(/[“”]/g, '"');

    // remove trailing commas before } or ]
    cleaned = cleaned.replace(/,\s*(?=[}\]])/g, "");

    return cleaned.trim();
}

/** Prevent super long prompts */
function truncate(s: string, max = 12000) {
    if (s.length <= max) return s;
    return s.slice(0, max) + "\n[TRUNCATED]";
}
