import * as fs from 'node:fs';
import { Assembler } from './assembler';
import { numberToLittleEndian } from './misc';

test('LDX #$00', async () => {
  const assembler = new Assembler('LDX #$00');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0xa2, 0x00]));
});

test('LDA #$00', async () => {
  const assembler = new Assembler('LDA #$00');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0xa9, 0x00]));
});

test('STA fib1', async () => {
  const assembler = new Assembler('STA fib1');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0x8d, 0x00, 0x00]));
});

test('LDA #$01', async () => {
  const assembler = new Assembler('LDA #$01');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0xa9, 0x01]));
});

test('STA fib2', async () => {
  const assembler = new Assembler('STA fib2');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0x8d, 0x00, 0x00]));
});

//

test('LDA fib1', async () => {
  const assembler = new Assembler('LDA fib1');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0xad, 0x00, 0x00]));
});

test('STA $6000', async () => {
  const assembler = new Assembler('STA $6000');

  const result = assembler.assemble();

  expect(result).toStrictEqual(
    new Uint32Array([0x8d, ...numberToLittleEndian(0x6000)]),
  );
});

test('LDA fib1', async () => {
  const assembler = new Assembler('LDA fib1');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0xad, 0x00, 0x00]));
});

test('CLC', async () => {
  const assembler = new Assembler('CLC');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0x18]));
});

test('ADC fib2', async () => {
  const assembler = new Assembler('ADC fib2');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0x6d, 0x00, 0x00]));
});

test('STA temp', async () => {
  const assembler = new Assembler('STA temp');

  const result = assembler.assemble();

  expect(result).toStrictEqual(new Uint32Array([0x8d, 0x00, 0x00]));
});

// test('#assemble', async () => {
//   const src = fs.readFileSync('data/code-1.asm', 'utf-8');

//   const assembler = new Assembler(src);

//   const result = assembler.assemble();

//   expect(result).toBe('');
// });
