export enum NeoNodeLabel {
  BoardNode = "BoardNode",
  GameNode = "GameNode",
}

export function stringToNeoNodeLabel(
  s: string
): NeoNodeLabel {
  return Object.values(NeoNodeLabel).find(
    (nodeLabel) => nodeLabel === s
  )!;
}
