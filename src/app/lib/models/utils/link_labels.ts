export enum NeoLinkLabel {
  Follows = "FOLLOWS",
  VotesOn = "VOTES_ON",
  ConnectedBy = "CONNECTED_BY",
  ConnectionOrigin = "CONNECTION_ORIGIN",
  ConnectionDestination = "CONNECTION_DESTINATION",
  Connection = "CONNECTION",
  Created = "CREATED",
  CreatedComment = "CREATED_COMMENT",
  CommentsOn = "COMMENTS_ON",
  TagMentions = "TAG_MENTIONS",
  TagMentionsBy = "TAG_MENTIONS_BY",
  HyperlinkMentions = "HYPERLINK_MENTIONS",
  HyperlinkMentionsBy = "HYPERLINK_MENTIONS_BY",
}

export function stringToNeoLinkLabel(
  s: string
): NeoLinkLabel {
  return Object.values(NeoLinkLabel).find(
    (linkLabel) => linkLabel === s
  )!;
}
