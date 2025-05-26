import { AddressingMode } from './types';

export const OPCODES: Record<
  number,
  { addressingMode: AddressingMode; mnemonic: string }
> = {
  // ADC
  0x69: {
    addressingMode: 'immediate',
    mnemonic: 'ADC',
  },
  0x6d: {
    addressingMode: 'absolute',
    mnemonic: 'ADC',
  },
  0x7d: {
    addressingMode: 'absolute_x',
    mnemonic: 'ADC',
  },
  0x79: {
    addressingMode: 'absolute_y',
    mnemonic: 'ADC',
  },
  0x65: {
    addressingMode: 'zeropage',
    mnemonic: 'ADC',
  },
  0x75: {
    addressingMode: 'zeropage_x',
    mnemonic: 'ADC',
  },
  0x61: {
    addressingMode: 'zeropage_x_indirect',
    mnemonic: 'ADC',
  },
  0x71: {
    addressingMode: 'zeropage_y_indirect',
    mnemonic: 'ADC',
  },

  // LDA
  0xa9: {
    addressingMode: 'immediate',
    mnemonic: 'LDA',
  },
  0xad: {
    addressingMode: 'absolute',
    mnemonic: 'LDA',
  },
  0xbd: {
    addressingMode: 'absolute_x',
    mnemonic: 'LDA',
  },
  0xb9: {
    addressingMode: 'absolute_y',
    mnemonic: 'LDA',
  },
  0xa5: {
    addressingMode: 'zeropage',
    mnemonic: 'LDA',
  },
  0xb5: {
    addressingMode: 'zeropage_x',
    mnemonic: 'LDA',
  },
  0xa1: {
    addressingMode: 'zeropage_x_indirect',
    mnemonic: 'LDA',
  },
  0xb1: {
    addressingMode: 'zeropage_y_indirect',
    mnemonic: 'LDA',
  },

  // LDX
  0xa2: {
    addressingMode: 'immediate',
    mnemonic: 'LDX',
  },
  0xae: {
    addressingMode: 'absolute',
    mnemonic: 'LDX',
  },
  0xbe: {
    addressingMode: 'absolute_y',
    mnemonic: 'LDX',
  },
  0xa6: {
    addressingMode: 'zeropage',
    mnemonic: 'LDX',
  },
  0xb6: {
    addressingMode: 'zeropage_y',
    mnemonic: 'LDX',
  },

  // INX
  0xe8: {
    addressingMode: 'implied',
    mnemonic: 'INX',
  },

  // CPX
  0xe0: {
    addressingMode: 'immediate',
    mnemonic: 'CPX',
  },

  // BNE
  0xd0: {
    addressingMode: 'relative',
    mnemonic: 'BNE',
  },

  // BRK
  0x00: {
    addressingMode: 'implied',
    mnemonic: 'BRK',
  },
};
