import { NeoNodeLabel } from "./node_labels";
import { Id, WithExtId, WithId } from "./mixin_models";

export type NeoNodeBase = {
  labels: NeoNodeLabel[];
  elementId: Id;
  properties: NodePropertiesAny;
};

export type OutNodeAny = WithId & {
  type: NeoNodeLabel;
  properties: NodePropertiesAny;
};
export type OutNode<N extends NeoNodeLabel> = OutNodeAny & {
  type: N;
  properties: NodeProperties<N>;
};

export type NodePropertiesAny = {} & WithExtId;
export type NodeProperties<N extends NeoNodeLabel> =
  NodePropertiesAny;
