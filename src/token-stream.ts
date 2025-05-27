import { Token } from './types';

export class TokenStream {
  protected index: number = 0;

  constructor(protected tokens: Array<Token>) {}

  public next() {
    return this.tokens[this.index++];
  }

  public peek(n: number = 0) {
    return this.tokens[this.index + n];
  }
}
