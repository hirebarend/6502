export class StringStream {
  protected index: number = 0;

  constructor(protected str: string) {}

  public next() {
    return this.str[this.index++];
  }

  public peek() {
    return this.str[this.index];
  }

  public skipWhitespace(): string {
    let buffer: string = '';

    while (this.peek() === ' ') {
      const c: string = this.next();

      buffer += c;
    }

    return buffer;
  }
}
