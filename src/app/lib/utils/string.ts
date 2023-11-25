export {};

/**
 * Extra Utilities on `Array`
 */
declare global {
  interface String {
    first(): string;
    second(): string;
    penultimate(): string;
    last(): string;
  }
}

String.prototype.first = function (): string {
  return this.at(0) || "";
};

String.prototype.second = function (): string {
  return this.at(1) || "";
};

String.prototype.penultimate = function (): string {
  return this.at(-2) || "";
};

String.prototype.last = function (): string {
  return this.at(-1) || "";
};
