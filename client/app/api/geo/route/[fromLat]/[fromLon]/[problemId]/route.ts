import { NextRequest, NextResponse } from "next/server";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";

interface RouteParams {
  params: Promise<{
    fromLat: string;
    fromLon: string;
    problemId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { fromLat, fromLon, problemId } = await params;
    
    const response = await fetch(
      `${SERVER_URL}/api/geo/route/${fromLat}/${fromLon}/${problemId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch from server" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error proxying to server:", error);
    return NextResponse.json(
      { success: false, error: "Server unavailable" },
      { status: 503 }
    );
  }
}
