/**
 * app/api/chat/route.ts
 * Server-side Gemini streaming endpoint.
 * POST /api/chat — Gemini 1.5 Flash streaming response.
 * Rate limiting handled by proxy.ts (20 req/min per IP).
 */
import { NextRequest } from "next/server";
import { ChatRequestSchema, createGeminiModel, sanitizeInput } from "@/lib/gemini";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    // 1. Parse and validate request body
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return Response.json({ error: "Invalid JSON in request body." }, { status: 400 });
    }

    const { messages, profile } = ChatRequestSchema.parse(body);

    // 2. Sanitize the last user message
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "user") {
      return Response.json({ error: "Last message must be from user." }, { status: 400 });
    }

    const sanitizedText = sanitizeInput(lastMessage.parts[0].text);
    if (!sanitizedText) {
      return Response.json({ error: "Message is empty after sanitization." }, { status: 400 });
    }

    // 3. Build history (all messages except the last)
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: msg.parts,
    }));

    // 4. Create Gemini model and start chat
    const model = createGeminiModel(profile);
    const chat = model.startChat({ history });

    // 5. Stream the response
    const result = await chat.sendMessageStream(sanitizedText);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        try {
          for await (const chunk of result.stream) {
            const text = chunk.text();
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
        } catch (streamError) {
          controller.error(streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "no-cache, no-store",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return Response.json(
        { error: "Invalid request.", details: error.issues.map((i) => i.message) },
        { status: 400 }
      );
    }

    console.error("[/api/chat] Error:", error);
    return Response.json(
      { error: "An error occurred processing your request. Please try again." },
      { status: 500 }
    );
  }
}
