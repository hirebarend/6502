import { numberToLittleEndian } from './misc';
import { StringStream } from './string-stream';
import { Tokenizer } from './tokenizer';
import { Token } from './types';

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
    const tokens: Array<Token> = new Tokenizer(this.src).tokenize();

    let index: number = 0;

    let token: Token | undefined = undefined;

    while (index < tokens.length) {
      token = tokens[index++];

      if (token.type === 'comment') {
        continue;
      }

      if (token.type === 'directive') {
        index += 1;

        continue;
      }

      if (token.type === 'label') {
        continue;
      }

      if (token.type === 'mnemonic') {
        const arr = [];

        arr.push(token);

        if (
          tokens[index].type === 'address' ||
          tokens[index].type === 'literal' ||
          tokens[index].type === 'number'
        ) {
          token = tokens[index++];

          arr.push(token);
        }

        console.log(arr);

        continue;
      }
    }

    // return new Uint32Array(
    //   arr
    //     .map((x) => [x.opcode, ...(x.value || [])])
    //     .reduce((a, b) => a.concat(b)),
    // );

    return new Uint32Array();
  }
}
