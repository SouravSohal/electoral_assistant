import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AddressQuerySchema = z.object({
  address: z.string().min(3, "Address too short"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    // 1. Validate Input
    const validation = AddressQuerySchema.safeParse({ address });
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const apiKey = process.env.GOOGLE_CIVIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Civic API Key not configured" },
        { status: 500 }
      );
    }

    // 2. Fetch from Google Civic Information API
    // voterinfo endpoint: https://www.googleapis.com/civicinfo/v2/voterinfo
    const civicUrl = new URL("https://www.googleapis.com/civicinfo/v2/voterinfo");
    civicUrl.searchParams.append("address", address!);
    civicUrl.searchParams.append("key", apiKey);
    // Note: For India, specific electionId might not be needed for general info, 
    // or might return nothing if ECI data hasn't been ingested recently.
    
    const response = await fetch(civicUrl.toString(), {
      next: { revalidate: 3600 }, // Cache for 1 hour per Google ToS
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Civic API Error Response:", data);
      // Handle "Address not found" or other specific Civic API errors
      if (data.error?.message?.includes("Address not found")) {
        return NextResponse.json(
          { error: "We couldn't find information for this specific address. Please try a more general location or visit the ECI portal." },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: data.error?.message || "Failed to fetch civic data" },
        { status: response.status }
      );
    }

    // 3. Return sanitized data
    return NextResponse.json(data);

  } catch (error) {
    console.error("Civic API Proxy Exception:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
