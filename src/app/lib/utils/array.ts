export {};

declare global {
  interface Array<T> {
    first(): T;
    second(): T;
    last(): T;
  }
}

Array.prototype.first = function <T>(): T {
  return this.at(0);
};

Array.prototype.second = function <T>(): T {
  return this.at(1);
};

Array.prototype.last = function <T>(): T {
  return this.at(-1);
};
