import { NextResponse } from "next/server";

import { neo4jSession } from "@config/db";

import { API_URL } from "@config/api_config";

/**
 * Reset Dev DB
 */
export async function POST() {
  try {
    ////////////////////////////////////////////////////////

    // 1. Delete Everything
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        MATCH (n)
        DETACH DELETE n
      `)
    );

    ////////////////////////////////////////////////////////

    return new NextResponse("Reset DB Successfully", {
      status: 201,
    });
  } catch (e) {
    console.error(e);

    return new NextResponse(
      "Error trying to reset the DB",
      { status: 500 }
    );
  }
}
