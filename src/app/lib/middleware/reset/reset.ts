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

/**
 * Based on [@cybersam's hack for reconfiguring Neo4j](https://stackoverflow.com/a/52596026/4756173).
 */
async function deleteAllIndexes() {
  try {
    await neo4jSession.executeWrite((tx) =>
      tx.run(/* cypher */ `
        CALL  apoc.schema.assert({}, {}, true) 
        YIELD label, key
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
