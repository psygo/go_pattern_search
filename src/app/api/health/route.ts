import { NextResponse } from "next/server";

/**
 * Health
 */
export async function GET() {
  try {
    return new NextResponse("Healthy", { status: 200 });
  } catch (e) {
    console.error(e);

    return new NextResponse("Not healthy", { status: 500 });
  }
}
