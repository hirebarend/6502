import { StringStream } from './string-stream';
import { Token } from './types';

export class Tokenizer {
  constructor(protected src: string) {}

  public tokenize(): Array<Token> {
    const lines: Array<string> = this.src
      .split('\n')
      .filter((x) => (x ? true : false));

    return lines.map((x) => this.tokenizeLine(x)).reduce((a, b) => a.concat(b));
  }

  protected tokenizeLine(src: string): Array<Token> {
    const stringStream: StringStream = new StringStream(src);

    stringStream.skipWhitespace();

    const tokens: Array<Token> = [];

    let buffer: string = '';

    while (stringStream.peek()) {
      const c: string = stringStream.next();

      if (c === ';') {
        if (stringStream.peek() === ' ') {
          stringStream.next();
        }

        while (stringStream.peek()) {
          buffer += stringStream.next();
        }

        tokens.push({
          type: 'comment',
          value: buffer,
        });

        buffer = '';

        continue;
      }

      if (c === '.') {
        while (stringStream.peek() !== ' ') {
          buffer += stringStream.next();
        }

        tokens.push({
          type: 'directive',
          value: buffer,
        });

        buffer = '';

        tokens.push(...this.tokenizeLineValue(stringStream));

        continue;
      }

      if (c === ':') {
        tokens.push({
          type: 'label',
          value: buffer,
        });

        buffer = '';

        return tokens;
      }

      if (c === ' ' && buffer.length === 3 && !tokens.length) {
        tokens.push({
          type: 'mnemonic',
          value: buffer,
        });

        buffer = '';

        tokens.push(...this.tokenizeLineValue(stringStream));

        continue;
      }

      buffer += c;
    }

    return tokens;
  }

  protected tokenizeLineValue(stringStream: StringStream): Array<Token> {
    stringStream.skipWhitespace();

    const tokens: Array<Token> = [];

    let buffer: string = '';

    const c: string = stringStream.next();

    if (c === ';') {
      if (stringStream.peek() === ' ') {
        stringStream.next();
      }

      while (stringStream.peek()) {
        buffer += stringStream.next();
      }

      tokens.push({
        type: 'comment',
        value: buffer,
      });

      buffer = '';

      stringStream.skipWhitespace();

      return tokens;
    }

    if (c === '$') {
      while (stringStream.peek() && stringStream.peek() !== ' ') {
        buffer += stringStream.next();
      }

      tokens.push({
        type: 'address',
        value: parseInt(buffer, 16),
      });

      buffer = '';

      stringStream.skipWhitespace();

      return tokens;
    }

    if (c === '#' && stringStream.peek() === '$') {
      stringStream.next();

      while (stringStream.peek() && stringStream.peek() !== ' ') {
        buffer += stringStream.next();
      }

      tokens.push({
        type: 'number',
        value: parseInt(buffer, 16),
      });

      buffer = '';

      stringStream.skipWhitespace();

      return tokens;
    }

    buffer += c;

    while (stringStream.peek() && stringStream.peek() !== ' ') {
      buffer += stringStream.next();
    }

    tokens.push({
      type: 'literal',
      value: buffer,
    });

    buffer = '';

    stringStream.skipWhitespace();

    return tokens;
  }
}
