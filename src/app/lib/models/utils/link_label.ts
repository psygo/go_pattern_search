export enum NeoLinkLabel {
  NextPlay = "NEXT_PLAY",
}

export function stringToNeoLinkLabel(
  s: string
): NeoLinkLabel {
  return Object.values(NeoLinkLabel).find(
    (linkLabel) => linkLabel === s
  )!;
}
