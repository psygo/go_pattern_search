export enum NeoNodeLabel {
  GameNode = "GameNode",
  MoveNode = "MoveNode",
}

export function stringToNeoNodeLabel(
  s: string
): NeoNodeLabel {
  return Object.values(NeoNodeLabel).find(
    (nodeLabel) => nodeLabel === s
  )!;
}
