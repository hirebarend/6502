import { AddressingMode } from './types';

export const OPCODES: Record<string, { [key: string]: number }> = {
  // --- Load/Store ---
  LDA: {
    immediate: 0xa9,
    zeropage: 0xa5,
    zeropage_x: 0xb5,
    absolute: 0xad,
    absolute_x: 0xbd,
    absolute_y: 0xb9,
    zeropage_x_indirect: 0xa1,
    zeropage_y_indirect: 0xb1,
  },
  LDX: {
    immediate: 0xa2,
    zeropage: 0xa6,
    zeropage_y: 0xb6,
    absolute: 0xae,
    absolute_y: 0xbe,
  },
  LDY: {
    immediate: 0xa0,
    zeropage: 0xa4,
    zeropage_x: 0xb4,
    absolute: 0xac,
    absolute_x: 0xbc,
  },
  STA: {
    zeropage: 0x85,
    zeropage_x: 0x95,
    absolute: 0x8d,
    absolute_x: 0x9d,
    absolute_y: 0x99,
    zeropage_x_indirect: 0x81,
    zeropage_y_indirect: 0x91,
  },
  STX: {
    zeropage: 0x86,
    zeropage_y: 0x96,
    absolute: 0x8e,
  },
  STY: {
    zeropage: 0x84,
    zeropage_x: 0x94,
    absolute: 0x8c,
  },

  // --- Transfer ---
  TAX: { implied: 0xaa },
  TAY: { implied: 0xa8 },
  TXA: { implied: 0x8a },
  TYA: { implied: 0x98 },
  TSX: { implied: 0xba },
  TXS: { implied: 0x9a },

  // --- Arithmetic ---
  ADC: {
    immediate: 0x69,
    zeropage: 0x65,
    zeropage_x: 0x75,
    absolute: 0x6d,
    absolute_x: 0x7d,
    absolute_y: 0x79,
    zeropage_x_indirect: 0x61,
    zeropage_y_indirect: 0x71,
  },
  SBC: {
    immediate: 0xe9,
    zeropage: 0xe5,
    zeropage_x: 0xf5,
    absolute: 0xed,
    absolute_x: 0xfd,
    absolute_y: 0xf9,
    zeropage_x_indirect: 0xe1,
    zeropage_y_indirect: 0xf1,
  },

  // --- Logic ---
  AND: {
    immediate: 0x29,
    zeropage: 0x25,
    zeropage_x: 0x35,
    absolute: 0x2d,
    absolute_x: 0x3d,
    absolute_y: 0x39,
    zeropage_x_indirect: 0x21,
    zeropage_y_indirect: 0x31,
  },
  ORA: {
    immediate: 0x09,
    zeropage: 0x05,
    zeropage_x: 0x15,
    absolute: 0x0d,
    absolute_x: 0x1d,
    absolute_y: 0x19,
    zeropage_x_indirect: 0x01,
    zeropage_y_indirect: 0x11,
  },
  EOR: {
    immediate: 0x49,
    zeropage: 0x45,
    zeropage_x: 0x55,
    absolute: 0x4d,
    absolute_x: 0x5d,
    absolute_y: 0x59,
    zeropage_x_indirect: 0x41,
    zeropage_y_indirect: 0x51,
  },

  // --- Shift/Rotate ---
  ASL: {
    accumulator: 0x0a,
    zeropage: 0x06,
    zeropage_x: 0x16,
    absolute: 0x0e,
    absolute_x: 0x1e,
  },
  LSR: {
    accumulator: 0x4a,
    zeropage: 0x46,
    zeropage_x: 0x56,
    absolute: 0x4e,
    absolute_x: 0x5e,
  },
  ROL: {
    accumulator: 0x2a,
    zeropage: 0x26,
    zeropage_x: 0x36,
    absolute: 0x2e,
    absolute_x: 0x3e,
  },
  ROR: {
    accumulator: 0x6a,
    zeropage: 0x66,
    zeropage_x: 0x76,
    absolute: 0x6e,
    absolute_x: 0x7e,
  },

  // --- Compare ---
  CMP: {
    immediate: 0xc9,
    zeropage: 0xc5,
    zeropage_x: 0xd5,
    absolute: 0xcd,
    absolute_x: 0xdd,
    absolute_y: 0xd9,
    zeropage_x_indirect: 0xc1,
    zeropage_y_indirect: 0xd1,
  },
  CPX: {
    immediate: 0xe0,
    zeropage: 0xe4,
    absolute: 0xec,
  },
  CPY: {
    immediate: 0xc0,
    zeropage: 0xc4,
    absolute: 0xcc,
  },

  // --- Branch ---
  BCC: { relative: 0x90 },
  BCS: { relative: 0xb0 },
  BEQ: { relative: 0xf0 },
  BMI: { relative: 0x30 },
  BNE: { relative: 0xd0 },
  BPL: { relative: 0x10 },
  BVC: { relative: 0x50 },
  BVS: { relative: 0x70 },

  // --- Jump/Subroutine ---
  JMP: {
    absolute: 0x4c,
    absolute_indirect: 0x6c,
  },
  JSR: { absolute: 0x20 },
  RTS: { implied: 0x60 },

  // --- Stack ---
  PHA: { implied: 0x48 },
  PHP: { implied: 0x08 },
  PLA: { implied: 0x68 },
  PLP: { implied: 0x28 },

  // --- Flags ---
  CLC: { implied: 0x18 },
  CLD: { implied: 0xd8 },
  CLI: { implied: 0x58 },
  CLV: { implied: 0xb8 },
  SEC: { implied: 0x38 },
  SED: { implied: 0xf8 },
  SEI: { implied: 0x78 },

  // --- Increment/Decrement ---
  INC: {
    zeropage: 0xe6,
    zeropage_x: 0xf6,
    absolute: 0xee,
    absolute_x: 0xfe,
  },
  INX: { implied: 0xe8 },
  INY: { implied: 0xc8 },
  DEC: {
    zeropage: 0xc6,
    zeropage_x: 0xd6,
    absolute: 0xce,
    absolute_x: 0xde,
  },
  DEX: { implied: 0xca },
  DEY: { implied: 0x88 },

  // --- Bit Test ---
  BIT: {
    zeropage: 0x24,
    absolute: 0x2c,
  },

  // --- System ---
  BRK: { implied: 0x00 },
  NOP: { implied: 0xea },
  RTI: { implied: 0x40 },
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
