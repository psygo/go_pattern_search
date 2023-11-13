import {
  GraphData,
  LinkObject,
  NodeObject,
} from "react-force-graph-2d";

import { OutNodeAny } from "./nodes_models";
import { OutLinkAny } from "./link_models";

//----------------------------------------------------------
// API

export type ApiStandardRes = GraphData<
  OutNodeAny,
  OutLinkAny
>;

//----------------------------------------------------------
// React Force Graph

export type NodeObj = NodeObject<OutNodeAny>;
export type LinkObj = LinkObject<OutNodeAny, OutLinkAny>;

export type NodeOrNull = NodeObj | null;
export type LinkOrNull = LinkObj | null;

export type ClickedNodesPair = [NodeOrNull, NodeOrNull];

export type GraphProps = {
  data: ApiStandardRes;
};

//----------------------------------------------------------
