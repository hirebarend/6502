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

  public next() {
    return this.str[this.index++];
  }

  public peek(n: number = 0) {
    return this.str[this.index + n];
  }
}
