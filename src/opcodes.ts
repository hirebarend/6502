import { AddressingMode } from './types';

export const OPCODES: Record<string, { [key: string]: number }> = {
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

export const OPCODES_TRANSFORMED: Record<
  number,
  { addressingMode: AddressingMode; mnemonic: string }
> = Object.keys(OPCODES)
  .map((mnemonic) =>
    Object.keys(OPCODES[mnemonic]).map((addressingMode) => {
      return {
        addressingMode: addressingMode as AddressingMode,
        mnemonic: mnemonic,
        opcode: OPCODES[mnemonic][addressingMode],
      };
    }),
  )
  .reduce((a, b) => a.concat(b))
  .reduce(
    (dict, x) => {
      dict[x.opcode] = {
        addressingMode: x.addressingMode,
        mnemonic: x.mnemonic,
      };

      return dict;
    },
    {} as Record<number, { addressingMode: AddressingMode; mnemonic: string }>,
  );
