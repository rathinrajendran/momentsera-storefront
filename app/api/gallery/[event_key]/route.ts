import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<{
    event_key: string;
  }>;
};

export async function GET(_request: Request, { params }: RouteContext) {
  try {
    const { event_key } = await params;

    // TODO: Replace this with your DB query
    const images: string[] = [];

    return NextResponse.json({
      event_key,
      images,
    });
  } catch (error) {
    console.error("Gallery API error:", error);

    return NextResponse.json({ error: "Failed to load gallery" }, { status: 500 });
  }
}
