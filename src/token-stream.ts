import { Token } from './types';

export class TokenStream {
  protected index: number = 0;

  constructor(protected tokens: Array<Token>) {}

  public next() {
    return this.tokens[this.index++];
  }

  public peek() {
    return this.tokens[this.index];
  }
}
