import * as fs from 'node:fs';
import { Assembler } from './assembler';

test('#toInstructions [; this is a comment]', async () => {
  const assembler: Assembler = new Assembler('; this is a comment');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([]);
});

test('#toInstructions [BRK ; this is a comment]', async () => {
  const assembler: Assembler = new Assembler('BRK ; this is a comment');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'implied',
      label: undefined,
      mnemonic: 'BRK',
      position: 0,
      value: undefined,
    },
  ]);
});

test('#toInstructions [.org $8000]', async () => {
  const assembler: Assembler = new Assembler('.org $8000');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([]);
});

test('#toInstructions [start:]', async () => {
  const assembler: Assembler = new Assembler('start:');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([]);
});

test('#toInstructions [BRK]', async () => {
  const assembler: Assembler = new Assembler('BRK');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'implied',
      label: undefined,
      mnemonic: 'BRK',
      position: 0,
      value: undefined,
    },
  ]);
});

test('#toInstructions [ASL A]', async () => {
  const assembler: Assembler = new Assembler('ASL A');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'accumulator',
      label: undefined,
      mnemonic: 'ASL',
      position: 0,
      value: undefined,
    },
  ]);
});

test('#toInstructions [ADC #$00]', async () => {
  const assembler: Assembler = new Assembler('ADC #$00');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'immediate',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00]),
    },
  ]);
});

test('#toInstructions [ADC $0000]', async () => {
  const assembler: Assembler = new Assembler('ADC $0000');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'absolute',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00, 0x00]),
    },
  ]);
});

test('#toInstructions [ADC $0000, X]', async () => {
  const assembler: Assembler = new Assembler('ADC $0000, X');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'absolute_x',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00, 0x00]),
    },
  ]);
});

test('#toInstructions [ADC $0000, Y]', async () => {
  const assembler: Assembler = new Assembler('ADC $0000, Y');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'absolute_y',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00, 0x00]),
    },
  ]);
});

test('#toInstructions [JMP ($0000)]', async () => {
  const assembler: Assembler = new Assembler('JMP ($0000)');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'absolute_indirect',
      label: undefined,
      mnemonic: 'JMP',
      position: 0,
      value: new Uint8Array([0x00, 0x00]),
    },
  ]);
});

test('#toInstructions [ADC $00]', async () => {
  const assembler: Assembler = new Assembler('ADC $00');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'zeropage',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00]),
    },
  ]);
});

test('#toInstructions [ADC $00, X]', async () => {
  const assembler: Assembler = new Assembler('ADC $00, X');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'zeropage_x',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00]),
    },
  ]);
});

test('#toInstructions [LDX $00, Y]', async () => {
  const assembler: Assembler = new Assembler('LDX $00, Y');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'zeropage_y',
      label: undefined,
      mnemonic: 'LDX',
      position: 0,
      value: new Uint8Array([0x00]),
    },
  ]);
});

test('#toInstructions [ADC ($00, X)]', async () => {
  const assembler: Assembler = new Assembler('ADC ($00, X)');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'zeropage_x_indirect',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00]),
    },
  ]);
});

test('#toInstructions [ADC ($00, Y)]', async () => {
  const assembler: Assembler = new Assembler('ADC ($00, Y)');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'zeropage_y_indirect',
      label: undefined,
      mnemonic: 'ADC',
      position: 0,
      value: new Uint8Array([0x00]),
    },
  ]);
});

test('#toInstructions [BCC $0000]', async () => {
  const assembler: Assembler = new Assembler('BCC $0000');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'relative',
      label: undefined,
      mnemonic: 'BCC',
      position: 0,
      value: new Uint8Array([0x00, 0x00]),
    },
  ]);
});

test('#toInstructions [LDA temp]', async () => {
  const assembler: Assembler = new Assembler('LDA temp');

  const result = assembler.toInstructions();

  expect(result).toStrictEqual([
    {
      addressingMode: 'absolute',
      label: undefined,
      mnemonic: 'LDA',
      position: 0,
      value: new Uint8Array([0x00, 0x00]),
    },
  ]);
});

test('#assemble', async () => {
  const src: string = fs.readFileSync('data/code-1.asm', 'utf-8');

  const assembler: Assembler = new Assembler(src);

  const result = assembler.assemble();

  expect(result).toStrictEqual(
    new Uint8Array([
      ...new Uint8Array(0x6000).fill(0xea),

      // LDX #$00
      0xa2,
      0x00,

      // LDA #$00
      0xa9,
      0x00,

      // STA fib1 (at $602E)
      0x8d,
      0x2e,
      0x60,

      // LDA #$01
      0xa9,
      0x01,

      // STA fib2 (at $602F)
      0x8d,
      0x2f,
      0x60,

      // LDA fib1
      0xad,
      0x2e,
      0x60,

      // STA $8000
      0x8d,
      0x00,
      0x80,

      // LDA fib1
      0xad,
      0x2e,
      0x60,

      // CLC
      0x18,

      // ADC fib2
      0x6d,
      0x2f,
      0x60,

      // STA temp (at $6030)
      0x8d,
      0x30,
      0x60,

      // LDA fib2
      0xad,
      0x2f,
      0x60,

      // STA fib1
      0x8d,
      0x2e,
      0x60,

      // LDA temp
      0xad,
      0x30,
      0x60,

      // STA fib2
      0x8d,
      0x2f,
      0x60,

      // INX
      0xe8,

      // CPX #$0A
      0xe0,
      0x0a,

      // BNE print_loop
      0xd0,
      0xdf,

      // BRK
      0x00,

      // .byte data (fib1, fib2, temp)
      0x00,
      0x00,
      0x00,

      ...new Uint8Array(0xfffc - 0x6031).fill(0xea),

      // Reset vector points to $6000
      0x00,
      0x60,

      ...new Uint8Array(2).fill(0xea),
    ]),
  );
});
