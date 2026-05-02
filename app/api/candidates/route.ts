import { NextRequest } from "next/server";
import { runCandidateResearch } from "@/agents/core/graph";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { name } = await req.json();

    if (!name || name.length < 3) {
      return Response.json(
        { error: "Candidate name must be at least 3 characters long" },
        { status: 400 }
      );
    }

    // Run the agentic research
    // For now, we return the full result. 
    // In a more advanced setup, we would use LangGraph's streaming capabilities.
    const result = await runCandidateResearch(name);

    return Response.json({
      report: result.report,
      success: true
    });
  } catch (error: any) {
    console.error("Candidate Research Error:", error);
    return Response.json(
      { error: "Failed to perform candidate research. Please try again." },
      { status: 500 }
    );
  }
}
