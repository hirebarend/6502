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

  public tokenizeLine(src: string): Array<Token> {
    const stringStream: StringStream = new StringStream(src);

    const tokens: Array<Token> = [];

    let buffer: string = '';

    while (stringStream.peek()) {
      const c: string = stringStream.next();

      if (c === ' ') {
        continue;
      }

      if (c === ';') {
        if (stringStream.peek() === ' ') {
          stringStream.next();
        }

        tokens.push({
          type: 'comment',
          value: stringStream.end(),
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
          type: 'mnemonic',
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

      buffer += c;
    }

    return tokens;
  }

  public tokenizeLineValue(stringStream: StringStream): Array<Token> {
    const tokens: Array<Token> = [];

    let buffer: string = '';

    while (stringStream.peek()) {
      const c: string = stringStream.next();

      if (c === ' ') {
        continue;
      }

      if (c === ';') {
        if (stringStream.peek() === ' ') {
          stringStream.next();
        }

        tokens.push({
          type: 'comment',
          value: stringStream.end(),
        });

        buffer = '';

        continue;
      }

      if (c === ',') {
        tokens.push({
          type: 'comma',
          value: undefined,
        });

        buffer = '';

        continue;
      }

      if (c === '(' || c === ')') {
        tokens.push({
          type: 'parentheses',
          value: undefined,
        });

        buffer = '';

        continue;
      }

      if (c === '$') {
        while (
          stringStream.peek() &&
          ![' ', ',', '(', ')'].includes(stringStream.peek())
        ) {
          buffer += stringStream.next();
        }

        tokens.push({
          type: 'address',
          value: parseInt(buffer, 16),
        });

        buffer = '';

        continue;
      }

      if (c === '#' && stringStream.peek() === '$') {
        stringStream.next();

        while (
          stringStream.peek() &&
          ![' ', ',', '(', ')'].includes(stringStream.peek())
        ) {
          buffer += stringStream.next();
        }

        tokens.push({
          type: 'number',
          value: parseInt(buffer, 16),
        });

        buffer = '';

        continue;
      }

      buffer += c;

      while (
        stringStream.peek() &&
        ![' ', ',', '(', ')'].includes(stringStream.peek())
      ) {
        buffer += stringStream.next();
      }

      tokens.push({
        type: 'literal',
        value: buffer,
      });

      buffer = '';

      continue;
    }

    return tokens;
  }
}
