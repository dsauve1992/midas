export class Watchlist implements Iterable<string> {
  constructor(private items: string[]) {}

  public [Symbol.iterator](): Iterator<string> {
    let pointer = 0;
    const items = this.items;

    return {
      next(): IteratorResult<string> {
        if (pointer < items.length) {
          return {
            done: false,
            value: items[pointer++],
          };
        } else {
          return {
            done: true,
            value: null,
          };
        }
      },
    };
  }
}
