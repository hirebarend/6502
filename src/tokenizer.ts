import { StringStream } from './string-stream';
import { Token } from './types';

export class Tokenizer {
  constructor(protected src: string) {}

  public tokenize(): Array<Token> {
    return this.src
      .split('\n')
      .filter((line) => line.trim() !== '')
      .flatMap((line) => this.tokenizeLine(line.trim()));
  }

  public tokenizeLine(src: string): Array<Token> {
    const stringStream: StringStream = new StringStream(src);

    const tokens: Array<Token> = [];

    let buffer: string = '';

    while (stringStream.peek()) {
      const c: string | undefined = stringStream.next();

      if (!c) {
        break;
      }

      if (c === ' ') {
        continue;
      }

      if (c === ';') {
        tokens.push(...this.parseComment(stringStream));

        continue;
      }

      if (c === '.') {
        tokens.push(...this.parseDirective(stringStream));

        continue;
      }

      if (
        !buffer &&
        !tokens.length &&
        (!stringStream.peek(2) || stringStream.peek(2) === ' ')
      ) {
        buffer += c;

        while (stringStream.peek() && stringStream.peek() !== ' ') {
          buffer += stringStream.next();
        }

        tokens.push({
          bits: undefined,
          type: 'mnemonic',
          value: buffer,
        });

        buffer = '';

        tokens.push(...this.tokenizeLineValue(stringStream));

        continue;
      }

      if (c === ':') {
        tokens.push({
          bits: undefined,
          type: 'label',
          value: buffer,
        });

        buffer = '';

        return tokens;
      }

      buffer += c;
    }

    return tokens;
  }

  public tokenizeLineValue(stringStream: StringStream): Array<Token> {
    const tokens: Array<Token> = [];

    let buffer: string = '';

    while (stringStream.peek()) {
      const c: string | undefined = stringStream.next();

      if (!c) {
        break;
      }

      if (c === ' ') {
        continue;
      }

      if (c === ';') {
        tokens.push(...this.parseComment(stringStream));

        buffer = '';

        continue;
      }

      if (c === ',') {
        tokens.push({
          bits: undefined,
          type: 'comma',
          value: undefined,
        });

        buffer = '';

        continue;
      }

      if (c === '(' || c === ')') {
        tokens.push({
          bits: undefined,
          type: 'parentheses',
          value: undefined,
        });

        buffer = '';

        continue;
      }

      if (c === '$') {
        buffer += this.readHexadecimal(stringStream);

        tokens.push({
          bits: buffer.length === 2 ? 8 : buffer.length === 4 ? 16 : undefined,
          type: 'address',
          value: parseInt(buffer, 16),
        });

        buffer = '';

        continue;
      }

      if (c === '#' && stringStream.peek() === '$') {
        stringStream.next();

        buffer += this.readHexadecimal(stringStream);

        tokens.push({
          bits: buffer.length === 2 ? 8 : buffer.length === 4 ? 16 : undefined,
          type: 'number',
          value: parseInt(buffer, 16),
        });

        buffer = '';

        continue;
      }

      buffer += c;

      while (
        stringStream.peek() &&
        ![' ', ',', '(', ')'].includes(stringStream.peek() || '')
      ) {
        buffer += stringStream.next();
      }

      tokens.push({
        bits: undefined,
        type: 'literal',
        value: buffer,
      });

      buffer = '';

      continue;
    }

    return tokens;
  }

  protected parseComment(stringStream: StringStream): Array<Token> {
    if (stringStream.peek() === ' ') {
      stringStream.next();
    }

    return [
      {
        bits: undefined,
        type: 'comment',
        value: stringStream.end(),
      },
    ];
  }

  protected parseDirective(stringStream: StringStream): Array<Token> {
    const tokens: Array<Token> = [];

    let buffer: string = '';

    while (stringStream.peek() !== ' ') {
      buffer += stringStream.next();
    }

    tokens.push({
      bits: undefined,
      type: 'directive',
      value: buffer,
    });

    tokens.push(...this.tokenizeLineValue(stringStream));

    return tokens;
  }

  protected readHexadecimal(stringStream: StringStream): string {
    let value: string = '';

    while (
      stringStream.peek() &&
      ![' ', ',', '(', ')'].includes(stringStream.peek()!)
    ) {
      value += stringStream.next();
    }

    return value;
  }
}
