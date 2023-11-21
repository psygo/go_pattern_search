export {};

/**
 * Extra Utilities on `Array`
 */
declare global {
  interface Array<T> {
    // 1. Items
    first(): T;
    second(): T;
    penultimate(): T;
    last(): T;

    // 2. Optional Methods
    optionalMap(
      callbackfn: (
        value: T,
        index: number,
        array: T[]
      ) => T,
      mapOrNot: boolean
    ): Array<T>;
    optionalFlatMap(
      callbackfn: (
        value: T,
        index: number,
        array: T[]
      ) => T,
      mapOrNot: boolean
    ): Array<T>;
  }
}

// 1. Items

Array.prototype.first = function <T>(): T {
  return this.at(0);
};

Array.prototype.second = function <T>(): T {
  return this.at(1);
};

Array.prototype.penultimate = function <T>(): T {
  return this.at(-2);
};

Array.prototype.last = function <T>(): T {
  return this.at(-1);
};

// 2. Optional Methods

Array.prototype.optionalMap = function <T>(
  callbackfn: (value: T, index: number, array: T[]) => T,
  mapOrNot: boolean
): Array<T> {
  return mapOrNot ? this.map(callbackfn) : this;
};

Array.prototype.optionalFlatMap = function <T>(
  callbackfn: (value: T, index: number, array: T[]) => T,
  mapOrNot: boolean
): Array<T> {
  return mapOrNot ? this.flatMap(callbackfn) : this;
};
