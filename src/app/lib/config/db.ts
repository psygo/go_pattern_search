import * as neo4j from "neo4j-driver";

import { Env } from "./env";

import {} from "@utils/array";

export const NANOID_SIZE = 10;

function getUriUserAndPassword(env: Env = Env.Dev) {
  switch (env) {
    case Env.Dev:
      const neo4jPort = parseInt(process.env.NEO4J_PORT!);
      return {
        uri: `neo4j://localhost:${neo4jPort}`,
        user: process.env.NEO4J_USER!,
        password: process.env.NEO4J_PASSWORD!,
      };
    case Env.Prod:
      const remoteUriPrefix = "neo4j+s://";
      return {
        uri: `${remoteUriPrefix}2a8bc089.databases.neo4j.io:7687`,
        user: process.env.AURA_USERNAME!,
        password: process.env.AURA_PASSWORD!,
      };
  }
}

function neo4jSetup(env: Env = Env.Dev) {
  const { uri, user, password } =
    getUriUserAndPassword(env);

  const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(user, password),
    { disableLosslessIntegers: true }
  );
  const session = driver.session();

  return session;
}

export const neo4jSession = neo4jSetup();
