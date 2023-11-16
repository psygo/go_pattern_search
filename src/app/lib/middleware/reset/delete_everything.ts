import { neo4jSession } from "@config/db";

export async function deleteEverything() {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        MATCH (n)
        DETACH DELETE n
      `)
    );
  } catch (e) {
    console.error(e);
  }
}
