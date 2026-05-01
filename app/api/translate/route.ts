import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TranslationRequestSchema = z.object({
  texts: z.array(z.string()).min(1, "At least one text is required"),
  targetLanguage: z.string().length(2, "Invalid language code"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const validation = TranslationRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }

    const { texts, targetLanguage } = validation.data;
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Translation API Key not configured" },
        { status: 500 }
      );
    }

    // Google Cloud Translation v2 API allows 'q' to be an array of strings
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          q: texts,
          target: targetLanguage,
          format: "text",
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Translation API Error:", data);
      return NextResponse.json(
        { error: data.error?.message || "Failed to translate text" },
        { status: response.status }
      );
    }

    // 3. Return translated text array
    return NextResponse.json({
      translatedTexts: data.data.translations.map((t: any) => t.translatedText),
    });

  } catch (error) {
    console.error("Translation Proxy Exception:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
