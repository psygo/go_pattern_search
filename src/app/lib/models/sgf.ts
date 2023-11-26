
import { TreeNodeId } from "./game_tree";
import { BoardCoordinates } from "./board_coordinates";

//----------------------------------------------------------
// SGF

export type Sgf = string;

export type WithSgf = { sgf: Sgf };

export enum Player {
  Black = "B",
  White = "W",
}

/**
 * Only the more or less useful SGF fields.
 *
 * References:
 *
 * - [Red Bean - SGF's Official Documentation](https://www.red-bean.com/sgf/)
 * - [Alternative SGF's Documentation](https://homepages.cwi.nl/~aeb/go/misc/sgf.html)
 */
export type SgfData = {
  // 1. Metadata
  GM?: ["1"]; // Game Type (GM = '1' is Go)
  FF?: [string]; // File Format
  CA?: [string]; // Character Set
  AP?: [string]; // Application used to produce the file
  // 2. Game Info
  KM?: [string]; // Komi
  SZ?: [string]; // Board Size
  DT?: [string]; // Date
  HA?: [string]; // Number of Handicap Stones
  RU?: [string]; // Rules Set in Use
  GN?: [string]; // Game Name
  EV?: [string]; // Event
  // 3. Players
  PB?: [string]; // Black Player
  BR?: [string]; // Black's Rating
  PW?: [string]; // White Player
  WR?: [string]; // White's Rating
  // 4. Comments
  C?: [string]; // (Move) Comments
  GC?: [string]; // Game Comment
  // 5. Editing the Goban
  PL?: [Player]; // Who plays next
  AB?: BoardCoordinates[]; // Add Black stones
  AW?: BoardCoordinates[]; // Add White stones
  // 6. Moves
  B?: [BoardCoordinates]; // What Black plays
  W?: [BoardCoordinates]; // What White Plays
};

//----------------------------------------------------------
// Parsing

/**
 * The first suggestion on Sabaki's SGF Parser
 * documentation.
 */
export const getId = (
  (id: TreeNodeId) => () =>
    id++
)(0);

//----------------------------------------------------------
// Custom SGF Parser

export const sgf1 =
  "(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-11-16]AB[qc][pc][oc]AW[od][pd][qd]C[Hello there]PB[Player 1]BR[1p]PW[Philippe Fanaro]WR[2d]GN[Game Name]EV[Event 1]GC[This is an info comment]RE[B+1.5];B[pg]C[This is the second comment];W[qi](;PL[B]AB[qk][ok];B[pm](;W[qo];B[dp];W[dl];B[dn])(;W[rm];B[ro]))(;B[dd];W[df]))";

export const sgf7 =
  "(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-11-25];B[pd](;W[md])(;W[pf]))(;GM[1]FF[4]CA[UTF-8]AP[Sabaki:0.52.2]KM[6.5]SZ[19]DT[2023-11-25];B[qd](;W[oc])(;W[pd]))";

export type BranchSegments = {
  id?: number;
  parentId?: number | null;
  data: string;
  children: BranchSegments[];
};

export function parseStringToTrees(s: string) {
  return parseBranchSegmentsToTree(
    parseStackToBranchSegments(parseStringToStack(s))
  );
}

function recursivelyDismantleBranch(
  data: string,
  pastChildren: BranchSegments[]
): BranchSegments {
  const possibleMoves = data
    .split(";")
    .filter((pb) => pb !== "");

  const firstMove = possibleMoves.first();
  const otherMoves = possibleMoves.slice(1).join(";");

  return {
    data: firstMove,
    children:
      possibleMoves.length > 1
        ? [
            recursivelyDismantleBranch(
              otherMoves,
              pastChildren
            ),
          ]
        : pastChildren.map((c) =>
            recursivelyDismantleBranch(c.data, c.children)
          ),
  };
}

export function parseBranchSegmentsToTree(
  bs: BranchSegments[]
) {
  const newBs: BranchSegments[] = [];
  for (const b of bs) {
    newBs.push(
      recursivelyDismantleBranch(b.data, b.children)
    );    
  }

  return newBs;
}

export function parseStackToBranchSegments(
  stack: string[]
) {
  const trees: BranchSegments[] = [];
  const treeTempArray: BranchSegments[] = [];
  let currentParentId: number | null = null;

  for (let i = 0; i < stack.length; i++) {
    const s = stack[i];

    if (s === "(") {
      const newId = treeTempArray.length;
      const data = stack[i + 1];

      const newTree: BranchSegments = {
        id: newId,
        parentId: currentParentId,
        data,
        children: [],
      };

      if (currentParentId === null) {
        trees.push(newTree);

        treeTempArray.push(newTree);
        currentParentId = newId;
      } else {
        treeTempArray[currentParentId].children.push(
          newTree
        );
        treeTempArray.push(newTree);
        currentParentId = newId;
      }
    } else if (s === ")") {
      const currentParent = treeTempArray
        .filter((t) => t.id === currentParentId)
        .first();
      const grandParentId = currentParent.parentId!;

      currentParentId = grandParentId;
    }
  }

  return trees;
}

export function parseStringToStack(sgf: Sgf) {
  const stack: string[] = [];
  let currentString = "";

  for (let i = 0; i < sgf.length; i++) {
    const char = sgf[i];

    if (char === "(" || char === ")") {
      if (currentString) stack.push(currentString);
      currentString = "";
      stack.push(char);
    } else {
      currentString += char;
    }
  }

  return stack;
}

//----------------------------------------------------------
