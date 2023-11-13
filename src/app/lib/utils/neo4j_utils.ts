import _ from "lodash";

import {
  Node,
  Path,
  QueryResult,
  RecordShape,
  Relationship,
} from "neo4j-driver";

import {
  ApiStandardRes,
  LinkProperties,
  NeoNodeBase,
  NodeProperties,
  OutLinkAny,
  OutNodeAny,
  stringToNeoLinkLabel,
  stringToNeoNodeLabel,
} from "@models/utils/exports";

export type Neo4jGraphElement = {
  elementId: string;
  [key: string]: any;
};

export function extractNeo4jId(s: string) {
  return s.split(":").last();
}

export function flattenRecords(results: QueryResult<RecordShape>) {
  return results.records
    .map((record) => record.keys.map((k) => record.get(k)))
    .flat(2) as Neo4jGraphElement[];
}

export function getAllNodesAndRelationships(results: QueryResult<RecordShape>) {
  return {
    nodes: getAllNodes(results),
    links: getAllRelationships(results),
  } as ApiStandardRes;
}

export function getAllNodes<N extends OutNodeAny = OutNodeAny>(
  results: QueryResult<RecordShape>
) {
  const flattenedRecords = flattenRecords(results);

  const allNodes = flattenedRecords.filter(
    (fr) => fr instanceof Node
  ) as NeoNodeBase[];

  const remappedNodes = allNodes.map<N>((n) => {
    const type = stringToNeoNodeLabel(n.labels.first());

    return {
      type,
      id: extractNeo4jId(n.elementId as string),
      properties: n.properties as NodeProperties<typeof type>,
    } as N;
  });

  const nodesSet = _.uniqBy(remappedNodes, "id");

  return nodesSet;
}

export function getAllRelationships<L extends OutLinkAny = OutLinkAny>(
  results: QueryResult<RecordShape>
) {
  const flattenedRecords = flattenRecords(results);

  const allRelationshipsAndPaths = flattenedRecords.filter(
    (fr) => fr instanceof Relationship || fr instanceof Path
  ) as (Relationship | Path)[];

  const allRelationships = allRelationshipsAndPaths.map((rp) => {
    if (rp instanceof Relationship) {
      return rp;
    } else {
      return rp.segments.first().relationship;
    }
  });

  const remappedRelationships = allRelationships.map<L>((r) => {
    const type = stringToNeoLinkLabel(r.type);

    return {
      type,
      id: extractNeo4jId(r.elementId),
      source: extractNeo4jId(r.startNodeElementId),
      target: extractNeo4jId(r.endNodeElementId),
      properties: r.properties as LinkProperties<typeof type>,
    } as L;
  });

  const relationshipsSet = _.uniqBy(remappedRelationships, "id");

  return relationshipsSet;
}
