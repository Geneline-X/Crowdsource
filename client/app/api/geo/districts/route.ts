import { NextRequest, NextResponse } from "next/server";

const SERVER_URL = process.env.SERVER_URL || "http://localhost:3001";

export async function GET(request: NextRequest) {
  try {
    const response = await fetch(`${SERVER_URL}/api/geo/districts`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
