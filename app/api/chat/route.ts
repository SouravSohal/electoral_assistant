import { NextRequest } from "next/server";
import { ChatRequestSchema, sanitizeInput } from "@/lib/gemini";
import { runAssistant } from "@/agents/core/assistant-graph";

export const runtime = "nodejs";

/**
 * POST /api/chat
 * Orchestrated Multi-Agent Assistant endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validate Input
    const validation = ChatRequestSchema.safeParse(body);
    if (!validation.success) {
      return Response.json(
        { error: validation.error.issues[0].message },
        { status: 400 }
      );
    }
    const { messages, profile, threadId } = validation.data;

    // 2. Personalization Enforcement
    // If profile is missing, we still chat but with a placeholder and a reminder.
    if (!profile) {
      console.warn("No user profile provided for chat. Personalization will be limited.");
    }

    // 3. Execute Multi-Agent Assistant
    const tId = threadId || "anonymous-default";
    const { response } = await runAssistant(
      null, // userId could be added if we had auth session in server
      profile,
      messages,
      tId
    );

    // 4. Stream response to client (simulated for compatibility)
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(response));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "X-Thread-ID": tId
      },
    });

  } catch (error: any) {
    console.error("[/api/chat] Agentic Assistant Error:", error);
    return Response.json(
      { error: "Failed to process personalized request.", details: error.message }, 
      { status: 500 }
    );
  }
}
