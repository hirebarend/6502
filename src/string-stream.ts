export class StringStream {
  protected index: number = 0;

  constructor(protected str: string) {}

  public end() {
    let buffer: string = '';

    while (this.peek()) {
      buffer += this.next();
    }

    return buffer;
  }

  public next(): string | undefined {
    return this.index < this.str.length ? this.str[this.index++] : undefined;
  }

  public peek(n: number = 0): string | undefined {
    return this.index + n < this.str.length
      ? this.str[this.index + n]
      : undefined;
  }
}
