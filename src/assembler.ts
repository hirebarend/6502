import { numberToLittleEndian } from './misc';
import { StringStream } from './string-stream';
import { AddressingMode } from './types';

const OPCODES: Record<string, { [key: string]: number }> = {
  ADC: {
    absolute: 0x6d,
  },
  CLC: {
    implied: 0x18,
  },
  LDA: {
    absolute: 0xad,
    immediate: 0xa9,
  },
  LDX: {
    immediate: 0xa2,
  },
  STA: {
    absolute: 0x8d,
  },
};

export class Assembler {
  constructor(protected src: string) {}

  public assemble(): Uint32Array {
    const lines = this.src.split('\n').filter((x) => (x ? true : false));

    const arr = lines.map((x) => this.tokenize(x));

    // return new Uint32Array(
    //   arr
    //     .map((x) => [x.opcode, ...(x.value || [])])
    //     .reduce((a, b) => a.concat(b)),
    // );

    return new Uint32Array();
  }

  public tokenize(src: string) {
    const stringStream = new StringStream(src);

    const tokens = [];

    let buffer = '';

    while (stringStream.peek()) {
      if (!buffer) {
        stringStream.skipWhitespace();
      }

      const c: string = stringStream.next();

      if (c === '\n') {
        // tokens.push({
        //   type: 'newline',
        //   value: buffer,
        // });

        buffer = '';

        continue;
      }

      if (!buffer && c === ';') {
        while (stringStream.peek() && stringStream.peek() !== '\n') {
          buffer += stringStream.next();
        }

        // tokens.push({
        //   type: 'comment',
        //   value: buffer,
        // });

        buffer = '';

        continue;
      }

      if (!buffer && c === '.') {
        while (stringStream.peek() !== '\n') {
          buffer += stringStream.next();
        }

        tokens.push({
          type: 'TODO',
          value: buffer,
        });

        buffer = '';

        continue;
      }

      if (c === ':') {
        tokens.push({
          type: 'label',
          value: buffer,
        });

        buffer = '';

        continue;
      }

      if (c === ' ') {
        if (buffer.length === 3) {
          tokens.push({
            type: 'mnemonic',
            value: buffer,
          });

          buffer = '';

          continue;
        }
      }

      if (!buffer && c === '$') {
        let str = '';

        while (stringStream.peek() !== ' ' && stringStream.peek() !== '\n') {
          str += stringStream.next();
        }

        tokens.push({
          type: 'address',
          value: parseInt(str, 16),
        });

        buffer = '';

        continue;
      }

      if (!buffer && c === '#' && stringStream.peek() === '$') {
        stringStream.next();

        let str = '';

        while (stringStream.peek() !== ' ' && stringStream.peek() !== '\n') {
          str += stringStream.next();
        }

        tokens.push({
          type: 'number',
          value: parseInt(str, 16),
        });

        buffer = '';

        continue;
      }

      buffer += c;
    }

    return tokens;
  }

  // public tokenizeLine(src: string) {
  //   const mnemonic: string = src.substring(0, 3);

  //   const remainder = src.substring(4);

  //   let addressingMode: AddressingMode = 'immediate';

  //   let value: Array<number> | undefined = undefined;

  //   if (!remainder) {
  //     addressingMode = 'implied';
  //   } else if (remainder.startsWith('#$')) {
  //     addressingMode = 'immediate';
  //     value = [parseInt(remainder.substring(2, 4), 16)];
  //   } else if (remainder.startsWith('$')) {
  //     addressingMode = 'absolute';
  //     value = numberToLittleEndian(parseInt(remainder.substring(1, 5), 16));
  //   } else {
  //     addressingMode = 'absolute';
  //     value = numberToLittleEndian(0x00);
  //   }

  //   const opcode: number = OPCODES[mnemonic][addressingMode];

  //   return {
  //     mnemonic,
  //     opcode,
  //     src,
  //     value,
  //   };
  // }
}
