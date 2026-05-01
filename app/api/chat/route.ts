/**
 * app/api/chat/route.ts
 * Server-side Gemini streaming endpoint.
 * POST /api/chat — Gemini 1.5 Flash streaming response.
 * Rate limiting handled by proxy.ts (20 req/min per IP).
 */
import { NextRequest } from "next/server";
import { ChatRequestSchema, createGeminiModel, sanitizeInput } from "@/lib/gemini";
import { toolExecutors } from "@/lib/tools";
import { ZodError } from "zod";

export const runtime = "nodejs";

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
    const { messages, profile } = validation.data;

    const lastMessage = messages[messages.length - 1];
    const sanitizedText = sanitizeInput(lastMessage.parts[0].text);
    
    const history = messages.slice(0, -1).map((msg) => ({
      role: msg.role,
      parts: msg.parts,
    }));

    const model = createGeminiModel(profile);
    const chat = model.startChat({ history });

    // --- Agentic Tool Loop ---
    let result = await chat.sendMessage(sanitizedText);
    let response = result.response;
    let parts = response.candidates?.[0].content.parts || [];
    
    // Check for function calls
    const functionCalls = parts.filter(part => part.functionCall);
    
    if (functionCalls.length > 0) {
      const toolResults = [];
      for (const call of functionCalls) {
        const toolName = call.functionCall?.name as keyof typeof toolExecutors;
        const args = call.functionCall?.args;
        
        if (toolExecutors[toolName]) {
          const output = await (toolExecutors[toolName] as any)(args);
          toolResults.push({
            functionResponse: {
              name: toolName,
              response: output
            }
          });
        }
      }

      // Final streaming response after tool execution
      const finalResult = await chat.sendMessageStream(toolResults);
      return new Response(
        new ReadableStream({
          async start(controller) {
            const encoder = new TextEncoder();
            try {
              for await (const chunk of finalResult.stream) {
                const text = chunk.text();
                if (text) controller.enqueue(encoder.encode(text));
              }
            } catch (e) {
              controller.error(e);
            } finally {
              controller.close();
            }
          },
        }),
        { headers: { "Content-Type": "text/plain; charset=utf-8" } }
      );
    }

    // No tools called, but we might have text already from the first sendMessage
    const initialText = response.text();
    return new Response(
      new ReadableStream({
        start(controller) {
          if (initialText) controller.enqueue(new TextEncoder().encode(initialText));
          controller.close();
        },
      }),
      { headers: { "Content-Type": "text/plain; charset=utf-8" } }
    );

  } catch (error) {
    console.error("[/api/chat] Agent Error:", error);
    return Response.json({ error: "Failed to process agentic request." }, { status: 500 });
  }
}
