import * as fs from 'node:fs';
import { Assembler } from './assembler';

// test('#assemble [; this is a comment]', async () => {
//   const assembler: Assembler = new Assembler('; this is a comment');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([]);
// });

// test('#assemble [BRK ; this is a comment]', async () => {
//   const assembler: Assembler = new Assembler('BRK ; this is a comment');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'implied',
//       label: undefined,
//       mnemonic: 'BRK',
//       position: 0,
//       value: undefined,
//     },
//   ]);
// });

// test('#assemble [.org $8000]', async () => {
//   const assembler: Assembler = new Assembler('.org $8000');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([]);
// });

// test('#assemble [start:]', async () => {
//   const assembler: Assembler = new Assembler('start:');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([]);
// });

// test('#assemble [BRK]', async () => {
//   const assembler: Assembler = new Assembler('BRK');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'implied',
//       label: undefined,
//       mnemonic: 'BRK',
//       position: 0,
//       value: undefined,
//     },
//   ]);
// });

// test('#assemble [ASL A]', async () => {
//   const assembler: Assembler = new Assembler('ASL A');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'accumulator',
//       label: undefined,
//       mnemonic: 'ASL',
//       position: 0,
//       value: undefined,
//     },
//   ]);
// });

// test('#assemble [ADC #$00]', async () => {
//   const assembler: Assembler = new Assembler('ADC #$00');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'immediate',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0]),
//     },
//   ]);
// });

// test('#assemble [ADC $0000]', async () => {
//   const assembler: Assembler = new Assembler('ADC $0000');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'absolute',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0, 0]),
//     },
//   ]);
// });

// test('#assemble [ADC $0000, X]', async () => {
//   const assembler: Assembler = new Assembler('ADC $0000, X');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'absolute_x',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0, 0]),
//     },
//   ]);
// });

// test('#assemble [ADC $0000, Y]', async () => {
//   const assembler: Assembler = new Assembler('ADC $0000, Y');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'absolute_y',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0, 0]),
//     },
//   ]);
// });

// test('#assemble [JMP ($0000)]', async () => {
//   const assembler: Assembler = new Assembler('JMP ($0000)');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'absolute_indirect',
//       label: undefined,
//       mnemonic: 'JMP',
//       position: 0,
//       value: new Uint8Array([0, 0]),
//     },
//   ]);
// });

// test('#assemble [ADC $00]', async () => {
//   const assembler: Assembler = new Assembler('ADC $00');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'zeropage',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0]),
//     },
//   ]);
// });

// test('#assemble [ADC $00, X]', async () => {
//   const assembler: Assembler = new Assembler('ADC $00, X');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'zeropage_x',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0]),
//     },
//   ]);
// });

// test('#assemble [LDX $00, Y]', async () => {
//   const assembler: Assembler = new Assembler('LDX $00, Y');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'zeropage_y',
//       label: undefined,
//       mnemonic: 'LDX',
//       position: 0,
//       value: new Uint8Array([0]),
//     },
//   ]);
// });

// test('#assemble [ADC ($00, X)]', async () => {
//   const assembler: Assembler = new Assembler('ADC ($00, X)');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'zeropage_x_indirect',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0]),
//     },
//   ]);
// });

// test('#assemble [ADC ($00, Y)]', async () => {
//   const assembler: Assembler = new Assembler('ADC ($00, Y)');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'zeropage_y_indirect',
//       label: undefined,
//       mnemonic: 'ADC',
//       position: 0,
//       value: new Uint8Array([0]),
//     },
//   ]);
// });

// test('#assemble [BCC $0000]', async () => {
//   const assembler: Assembler = new Assembler('BCC $0000');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'relative',
//       label: undefined,
//       mnemonic: 'BCC',
//       position: 0,
//       value: new Uint8Array([0, 0]),
//     },
//   ]);
// });

// test('#assemble [LDA temp]', async () => {
//   const assembler: Assembler = new Assembler('LDA temp');

//   const result = assembler.assemble();

//   expect(result).toStrictEqual([
//     {
//       addressingMode: 'absolute',
//       label: undefined,
//       mnemonic: 'LDA',
//       position: 0,
//       value: undefined,
//     },
//   ]);
// });

test('#assemble', async () => {
  const src: string = fs.readFileSync('data/code-1.asm', 'utf-8');

  const assembler: Assembler = new Assembler(src);

  const result = assembler.assemble();

  expect(result).toStrictEqual(
    new Uint8Array([
      // LDX #$00
      0xa2, 0x00,

      // LDA #$00
      0xa9, 0x00,

      // STA fib1
      0x8d, 0xff, 0xff,

      // LDA #$01
      0xa9, 0x01,

      // STA fib2
      0x8d, 0xfe, 0xff,

      // LDA fib1
      0xad, 0xff, 0xff,

      // STA $6000
      0x8d, 0x00, 0x60,

      // LDA fib1
      0xad, 0xff, 0xff,

      // CLC
      0x18,

      // ADC fib2
      0x6d, 0xfe, 0xff,

      // STA temp
      0x8d, 0xfd, 0xff,

      // LDA fib2
      0xad, 0xfe, 0xff,

      // STA fib1
      0x8d, 0xff, 0xff,

      // LDA temp
      0xad, 0xfd, 0xff,

      // STA fib2
      0x8d, 0xfe, 0xff,

      // INX
      0xe8,

      // CPX #$10
      0xe0, 0x10,

      // BNE print_loop
      0xd0, 0x61,

      // BRK
      0x00,
    ]),
  );
});
