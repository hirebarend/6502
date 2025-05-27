import { numberToLittleEndian } from './misc';
import { StringStream } from './string-stream';
import { TokenStream } from './token-stream';
import { Tokenizer } from './tokenizer';
import { AddressingMode, Token } from './types';

const OPCODES: Record<string, { [key: string]: number }> = {
  ADC: {
    absolute: 0x6d,
    immediate: 0x69,
  },
  AND: {
    absolute: 0x2d,
    immediate: 0x29,
  },
  ASL: {
    absolute: 0x0e,
  },

  //////
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
  protected memory: Uint8Array = new Uint8Array(0x10000);

  protected reservedPointer: number = 65536;

  constructor(protected src: string) {}

  public assemble(): Uint32Array {
    let pointer: number = 0;

    const tokens: Array<Token> = new Tokenizer(this.src).tokenize();

    console.log(tokens)

    const labels: Record<string, number> = {};

    const variables: Record<string, number> = {};

    const tokenStream: TokenStream = new TokenStream(tokens);

    let label: string | undefined = undefined;

    while (tokenStream.peek()) {
      let token: Token = tokenStream.next();

      if (token.type === 'comment') {
        continue;
      }

      if (token.type === 'directive') {
        tokenStream.next();

        continue;
      }

      if (token.type === 'label') {
        label = token.value as string;

        continue;
      }

      if (token.type === 'mnemonic') {
        const obj = {
          addressingMode: undefined as AddressingMode | undefined,
          label: undefined as string | undefined,
          mnemonic: token.value,
          position: undefined as number | undefined,
          value: undefined as Uint8Array | undefined,
        };

        if (label) {
          obj.label = label;

          label = undefined;
        }

        if (
          tokenStream.peek() &&
          ['address', 'literal', 'number'].includes(tokenStream.peek().type)
        ) {
          token = tokenStream.next();

          if (token.type === 'address') {
            obj.addressingMode = 'absolute';

            obj.value = new Uint8Array(
              numberToLittleEndian(token.value as number),
            );
          } else if (token.type === 'literal' && token.value === 'A') {
            obj.addressingMode = 'accumulator';
          } else if (obj.mnemonic === 'BNE' && token.type === 'literal') {
            obj.value = new Uint8Array(
              numberToLittleEndian(labels[token.value as string]),
            );
          } else if (token.type === 'literal') {
            if (obj.mnemonic === 'BNE') {
              obj.value = new Uint8Array(
                numberToLittleEndian(variables[token.value as string]),
              );
            }

            if (!variables[token.value as string]) {
              variables[token.value as string] = --this.reservedPointer;
            }

            obj.value = new Uint8Array(
              numberToLittleEndian(variables[token.value as string]),
            );
          } else if (token.type === 'number') {
            obj.addressingMode = 'immediate';

            obj.value = new Uint8Array(
              numberToLittleEndian(token.value as number, 1),
            );
          }
        }

        obj.position = pointer;
        pointer += 1 + (obj.value ? obj.value.length : 0);

        if (obj.label && !labels[obj.label]) {
          labels[obj.label] = obj.position;
        }

        console.log(obj);
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
