import { NeoLinkLabel } from "./link_labels";
import { NeoNodeLabel } from "./node_labels";
import { OutNode, OutNodeAny } from "./nodes_models";
import { Id, WithId } from "./mixin_models";

export type NeoLinkBase = {
  type: NeoLinkLabel;
  elementId: Id;
  startNodeElementId: Id;
  endNodeElementId: Id;
  properties: LinkPropertiesAny;
};

export type OutLinkAny = WithId & {
  type: NeoLinkLabel;
  source: Id | OutNodeAny;
  target: Id | OutNodeAny;
  properties: LinkPropertiesAny;
};
export type OutLink<
  L extends NeoLinkLabel,
  S extends NeoNodeLabel,
  T extends NeoNodeLabel
> = OutLinkAny & {
  type: L;
  source: Id | OutNode<S>;
  target: Id | OutNode<T>;
  properties: LinkProperties<L>;
};

export type LinkPropertiesAny = {};
export type LinkProperties<L extends NeoLinkLabel> =
  LinkPropertiesAny;
