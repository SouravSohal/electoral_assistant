import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const TranslationRequestSchema = z.object({
  text: z.string().min(1, "Text is required"),
  targetLanguage: z.string().length(2, "Invalid language code"),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const validation = TranslationRequestSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const { text, targetLanguage } = validation.data;
    const apiKey = process.env.GOOGLE_TRANSLATE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "Translation API Key not configured" },
        { status: 500 }
      );
    }

    // 2. Call Google Cloud Translation API
    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
      {
        method: "POST",
        body: JSON.stringify({
          q: text,
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

    // 3. Return translated text
    return NextResponse.json({
      translatedText: data.data.translations[0].translatedText,
    });

  } catch (error) {
    console.error("Translation Proxy Exception:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
