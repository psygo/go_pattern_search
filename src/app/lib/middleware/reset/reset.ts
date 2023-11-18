import { neo4jSession } from "@config/db";

import {
  createGameAndMoveNodesIndexes,
  sgfsToNeo4j,
} from "./sgf_to_neo4j";

//----------------------------------------------------------

export async function reset() {
  await deleteEverything();
  await configureEverything();
}

async function deleteEverything() {
  await deleteAllNodesAndRelationships();
  await deleteAllIndexes();
}

async function configureEverything() {
  await createAllIndexes();
  await sgfsToNeo4j();
}

//----------------------------------------------------------
// 1. Delete

async function deleteAllNodesAndRelationships() {
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

async function deleteAllIndexes() {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CALL apoc.schema.assert({},{},true) YIELD label, key
        RETURN *
      `)
    );
  } catch (e) {
    console.error(e);
  }
}

//----------------------------------------------------------
// 2. Indexes

async function createAllIndexes() {
  await createGameAndMoveNodesIndexes();
}

//----------------------------------------------------------
