import { NextResponse } from "next/server";

/**
 * Health
 */
export async function GET() {
  try {
    return new NextResponse("Healthy", { status: 200 });
  } catch (e) {
    console.error("Not healthy");
  }
}
