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
  INX: {
    implied: 0xe8,
  },
  BNE: {
    relative: 0xd0,
  },
  BRK: {
    implied: 0x00,
  },
  CPX: {
    immediate: 0xe0,
  },
  JMP: {
    absolute: 0x4c,
    absolute_indirect: 0x6c,
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
  protected labels: Record<string, number> = {};

  protected pointer: number = 0;

  protected reservedPointer: number = 0x10000;

  protected variables: Record<string, number> = {};

  constructor(protected src: string) {}

  public assemble() {
    const arr = [];

    const tokens: Array<Token> = new Tokenizer(this.src).tokenize();

    const tokenStream: TokenStream = new TokenStream(tokens);

    let label: string | undefined = undefined;

    while (tokenStream.peek()) {
      let token: Token = tokenStream.next();

      if (token.type === 'comment') {
        continue;
      }

      if (token.type === 'directive') {
        token = tokenStream.next();

        // this.pointer = this.tokenToValue(token, false);

        this.pointer = 0x6000;

        continue;
      }

      if (token.type === 'label') {
        label = token.value as string;

        continue;
      }

      if (token.type === 'mnemonic') {
        const obj = {
          addressingMode: 'implied' as AddressingMode,
          label: undefined as string | undefined,
          mnemonic: token.value as string,
          position: undefined as number | undefined,
          value: undefined as Uint8Array | undefined,
        };

        if (label) {
          obj.label = label;

          label = undefined;
        }

        if (
          tokenStream.peek() &&
          !['comment', 'directive', 'label', 'mnemonic'].includes(
            tokenStream.peek().type,
          )
        ) {
          token = tokenStream.next();

          if (token.type === 'literal' && token.value === 'A') {
            obj.addressingMode = 'accumulator';
          } else if (
            token.type === 'parentheses' &&
            tokenStream.peek() &&
            tokenStream.peek().type === 'address' &&
            tokenStream.peek(1) &&
            tokenStream.peek(1).type === 'comma' &&
            tokenStream.peek(2) &&
            tokenStream.peek(2).type === 'literal' &&
            tokenStream.peek(3) &&
            tokenStream.peek(3).type === 'parentheses'
          ) {
            if (
              tokenStream.peek(2) &&
              tokenStream.peek(2).type === 'literal' &&
              tokenStream.peek(2).value === 'X'
            ) {
              obj.addressingMode = 'zeropage_x_indirect';
            } else if (
              tokenStream.peek(2) &&
              tokenStream.peek(2).type === 'literal' &&
              tokenStream.peek(2).value === 'Y'
            ) {
              obj.addressingMode = 'zeropage_y_indirect';
            }

            obj.value = this.tokenToValue(tokenStream.peek(), false);

            // TODO:
            tokenStream.next();
            tokenStream.next();
            tokenStream.next();
            tokenStream.next();
          } else if (
            token.type === 'parentheses' &&
            tokenStream.peek() &&
            tokenStream.peek().type === 'address' &&
            tokenStream.peek(1) &&
            tokenStream.peek(1).type === 'parentheses'
          ) {
            obj.addressingMode = 'absolute_indirect';

            obj.value = this.tokenToValue(tokenStream.peek(), false);

            // TODO
            tokenStream.next();
            tokenStream.next();
          } else if (token.type === 'address' || token.type === 'literal') {
            if (
              tokenStream.peek() &&
              tokenStream.peek().type === 'comma' &&
              tokenStream.peek(1).type === 'literal'
            ) {
              if (tokenStream.peek(1).value === 'X') {
                if (token.bits === 8) {
                  obj.addressingMode = 'zeropage_x';
                } else {
                  obj.addressingMode = 'absolute_x';
                }
              } else if (tokenStream.peek(1).value === 'Y') {
                if (token.bits === 8) {
                  obj.addressingMode = 'zeropage_y';
                } else {
                  obj.addressingMode = 'absolute_y';
                }
              }

              obj.value = this.tokenToValue(token, false);

              // TODO:
              tokenStream.next();
              tokenStream.next();
            } else if (this.isBranchInstruction(obj.mnemonic)) {
              obj.addressingMode = 'relative';

              obj.value = this.tokenToValue(token, true);
            } else if (token.bits === 8) {
              obj.addressingMode = 'zeropage';

              obj.value = this.tokenToValue(token, false);
            } else {
              obj.addressingMode = 'absolute';

              obj.value = this.tokenToValue(token, false);
            }
          } else if (token.type === 'number') {
            obj.addressingMode = 'immediate';

            obj.value = new Uint8Array(
              numberToLittleEndian(token.value as number, 1),
            );
          }
        }

        obj.position = this.pointer;
        this.pointer += 1 + (obj.value ? obj.value.length : 0);

        if (obj.label && !this.labels[obj.label]) {
          this.labels[obj.label] = obj.position;
        }

        arr.push(obj);
      }
    }

    // const memory: Uint8Array = new Uint8Array(0x10000);

    // for (const x of arr) {
    //   if (!x.position) {
    //     continue;
    //   }

    //   if (!OPCODES[x.mnemonic]) {
    //     throw new Error(`unable to find ${x.mnemonic}`);
    //   }

    //   memory[x.position] = OPCODES[x.mnemonic][x.addressingMode];

    //   if (x.value) {
    //     for (let i = 0; i < x.value.length; i++) {
    //       memory[x.position + i + 1] = x.value[i];
    //     }
    //   }
    // }

    const memory = [];

    for (const x of arr) {
      if (!x.position) {
        continue;
      }

      if (!OPCODES[x.mnemonic]) {
        throw new Error(`unable to find ${x.mnemonic}`);
      }

      memory.push(OPCODES[x.mnemonic][x.addressingMode]);

      if (x.value) {
        for (let i = 0; i < x.value.length; i++) {
          memory.push(x.value[i]);
        }
      }
    }

    return new Uint8Array(memory);

    // ///////////////////////////////

    // const output = [];

    // for (const x of arr) {
    //   if (!x.position) {
    //     continue;
    //   }

    //   if (!OPCODES[x.mnemonic]) {
    //     throw new Error(x.mnemonic);
    //   }

    //   output.push(OPCODES[x.mnemonic][x.addressingMode]);

    //   if (x.value) {
    //     for (let i = 0; i < x.value.length; i++) {
    //       output.push(x.value[i]);
    //     }
    //   }
    // }

    // return output.map((x) => x.toString(16));

    // ////////////////////////

    // for (const x of arr) {
    //   if (!OPCODES[x.mnemonic]) {
    //     throw new Error(x.mnemonic);
    //   }

    //   if (x.value) {
    //     console.log(
    //       `${OPCODES[x.mnemonic][x.addressingMode].toString(16)} ${x.value.map((y) => (y as any).toString(16)).join(' ')} ; ${x.mnemonic}`,
    //     );
    //   } else {
    //     console.log(
    //       `${OPCODES[x.mnemonic][x.addressingMode].toString(16)} ; ${x.mnemonic}`,
    //     );
    //   }
    // }

    // return memory;
  }

  protected isBranchInstruction(mnemonic: string | undefined): boolean {
    if (!mnemonic) {
      return false;
    }

    return ['BCC', 'BCS', 'BEQ', 'BMI', 'BNE', 'BPL', 'BVC', 'BVS'].includes(
      mnemonic,
    );
  }

  protected tokenToValue(
    token: Token,
    isBranchInstruction: boolean,
  ): Uint8Array | undefined {
    if (token.type === 'address') {
      if (token.bits === 8) {
        return new Uint8Array(numberToLittleEndian(token.value as number, 1));
      } else if (token.bits === 16) {
        return new Uint8Array(numberToLittleEndian(token.value as number, 2));
      }
    } else if (token.type === 'literal' && !isBranchInstruction) {
      if (!this.variables[token.value as string]) {
        this.variables[token.value as string] = --this.reservedPointer;
      }

      return new Uint8Array(
        numberToLittleEndian(this.variables[token.value as string], 2),
      );
    } else if (token.type === 'literal' && isBranchInstruction) {
      return new Uint8Array(
        numberToLittleEndian(this.labels[token.value as string], 2),
      );
    }

    return undefined;
  }
}
