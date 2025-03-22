import { NextRequest, NextResponse } from "next/server";
import * as serverApi from "@/lib/api/server";

/**
 * Generic API handler that proxies requests to the backend
 * This implements the Backend-For-Frontend (BFF) pattern
 */
export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    // Reconstruct the API path from the route parameters
    const path = `/${params.path.join("/")}`;

    // Forward query parameters if any
    const url = new URL(req.url);
    const queryString = url.search;
    const apiPath = path + queryString;

    // Use server API to make the actual request
    const response = await serverApi.get(apiPath);

    return NextResponse.json(response);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = `/${params.path.join("/")}`;
    const body = await req.json();

    const response = await serverApi.post(path, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = `/${params.path.join("/")}`;
    const body = await req.json();

    const response = await serverApi.put(path, body);

    return NextResponse.json(response);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const path = `/${params.path.join("/")}`;

    const response = await serverApi.del(path);

    return NextResponse.json(response);
  } catch (error) {
    console.error("API proxy error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process request" },
      { status: 500 }
    );
  }
}
