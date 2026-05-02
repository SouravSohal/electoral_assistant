import { NextRequest } from "next/server";
import { 
  VerificationRequestSchema,
  sanitizeInput
} from "@/lib/gemini";
import { runFactCheck } from "@/agents/core/graph";

/**
 * POST /api/verify
 * Orchestrated Multi-Agent Fact-Checking endpoint.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // 1. Validate request body
    const validated = VerificationRequestSchema.safeParse(body);
    if (!validated.success) {
      return Response.json(
        { error: "Invalid request", details: validated.error.format() },
        { status: 400 }
      );
    }

    const { text } = validated.data;

    // 2. Sanitize user input
    const sanitizedText = sanitizeInput(text);

    // 3. Execute Multi-Agent Graph
    // For now, we wait for the full result to ensure accuracy in the multi-step process.
    const { report, verdict } = await runFactCheck(sanitizedText);

    // 4. Return the result
    // We simulate a stream for compatibility with the existing UI, 
    // or return it as a single chunk.
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(report));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
      },
    });

  } catch (error: any) {
    console.error("Agentic Fact-check API Error:", error);
    return Response.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}
