import * as fs from 'node:fs';
import { Tokenizer } from './tokenizer';

test('#tokenizeLine [; this is a comment]', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('; this is a comment');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'comment', value: 'this is a comment' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('BRK ; this is a comment');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'BRK' },
    { bits: undefined, type: 'comment', value: 'this is a comment' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('.org $8000');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'directive', value: 'org' },
    { bits: 16, type: 'address', value: 32768 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('start:');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'label', value: 'start' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('BRK');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'BRK' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ASL A');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ASL' },
    { bits: undefined, type: 'literal', value: 'A' },
  ]);
});

test('#tokenizeLine [ADC #$00]', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC #$00');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: 8, type: 'number', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $0000');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: 16, type: 'address', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $0000, X');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: 16, type: 'address', value: 0 },
    { bits: undefined, type: 'comma', value: undefined },
    { bits: undefined, type: 'literal', value: 'X' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $0000, Y');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: 16, type: 'address', value: 0 },
    { bits: undefined, type: 'comma', value: undefined },
    { bits: undefined, type: 'literal', value: 'Y' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('JMP ($0000)');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'JMP' },
    { bits: undefined, type: 'parentheses', value: undefined },
    { bits: 16, type: 'address', value: 0 },
    { bits: undefined, type: 'parentheses', value: undefined },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $00');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: 8, type: 'address', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $00, X');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: 8, type: 'address', value: 0 },
    { bits: undefined, type: 'comma', value: undefined },
    { bits: undefined, type: 'literal', value: 'X' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('LDX $00, Y');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'LDX' },
    { bits: 8, type: 'address', value: 0 },
    { bits: undefined, type: 'comma', value: undefined },
    { bits: undefined, type: 'literal', value: 'Y' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC ($00, X)');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: undefined, type: 'parentheses', value: undefined },
    { bits: 8, type: 'address', value: 0 },
    { bits: undefined, type: 'comma', value: undefined },
    { bits: undefined, type: 'literal', value: 'X' },
    { bits: undefined, type: 'parentheses', value: undefined },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC ($00), Y');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: undefined, type: 'parentheses', value: undefined },
    { bits: 8, type: 'address', value: 0 },
    { bits: undefined, type: 'parentheses', value: undefined },
    { bits: undefined, type: 'comma', value: undefined },
    { bits: undefined, type: 'literal', value: 'Y' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('BCC $0000');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'BCC' },
    { bits: 16, type: 'address', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('LDA temp');

  expect(result).toStrictEqual([
    { bits: undefined, type: 'mnemonic', value: 'LDA' },
    { bits: undefined, type: 'literal', value: 'temp' },
  ]);
});

test('#tokenize', async () => {
  const src: string = fs.readFileSync('data/code-1.asm', 'utf-8');

  const tokenizer: Tokenizer = new Tokenizer(src);

  const result = tokenizer.tokenize();

  expect(result).toStrictEqual([
    { bits: undefined, type: 'directive', value: 'org' },
    { bits: 16, type: 'address', value: 24576 },
    { bits: undefined, type: 'comment', value: 'Start address' },
    { bits: undefined, type: 'label', value: 'start' },
    { bits: undefined, type: 'mnemonic', value: 'LDX' },
    { bits: 8, type: 'number', value: 0 },
    { bits: undefined, type: 'comment', value: 'Counter = 0' },
    { bits: undefined, type: 'mnemonic', value: 'LDA' },
    { bits: 8, type: 'number', value: 0 },
    { bits: undefined, type: 'comment', value: 'A = 0 (fib0)' },
    { bits: undefined, type: 'mnemonic', value: 'STA' },
    { bits: undefined, type: 'literal', value: 'fib1' },
    { bits: undefined, type: 'mnemonic', value: 'LDA' },
    { bits: 8, type: 'number', value: 1 },
    { bits: undefined, type: 'comment', value: 'A = 1 (fib1)' },
    { bits: undefined, type: 'mnemonic', value: 'STA' },
    { bits: undefined, type: 'literal', value: 'fib2' },
    { bits: undefined, type: 'label', value: 'print_loop' },
    { bits: undefined, type: 'comment', value: 'Print fib1' },
    { bits: undefined, type: 'mnemonic', value: 'LDA' },
    { bits: undefined, type: 'literal', value: 'fib1' },
    { bits: undefined, type: 'mnemonic', value: 'STA' },
    { bits: 16, type: 'address', value: 32768 },
    { bits: undefined, type: 'comment', value: 'Output to I/O register' },
    {
      bits: undefined,
      type: 'comment',
      value: 'Calculate next Fibonacci number',
    },
    { bits: undefined, type: 'mnemonic', value: 'LDA' },
    { bits: undefined, type: 'literal', value: 'fib1' },
    { bits: undefined, type: 'comment', value: 'A = fib1' },
    { bits: undefined, type: 'mnemonic', value: 'CLC' },
    { bits: undefined, type: 'mnemonic', value: 'ADC' },
    { bits: undefined, type: 'literal', value: 'fib2' },
    { bits: undefined, type: 'comment', value: 'A = fib1 + fib2' },
    { bits: undefined, type: 'mnemonic', value: 'STA' },
    { bits: undefined, type: 'literal', value: 'temp' },
    { bits: undefined, type: 'comment', value: 'Store new value temporarily' },
    {
      bits: undefined,
      type: 'comment',
      value: 'Shift values: fib2 -> fib1, temp -> fib2',
    },
    { bits: undefined, type: 'mnemonic', value: 'LDA' },
    { bits: undefined, type: 'literal', value: 'fib2' },
    { bits: undefined, type: 'mnemonic', value: 'STA' },
    { bits: undefined, type: 'literal', value: 'fib1' },
    { bits: undefined, type: 'mnemonic', value: 'LDA' },
    { bits: undefined, type: 'literal', value: 'temp' },
    { bits: undefined, type: 'mnemonic', value: 'STA' },
    { bits: undefined, type: 'literal', value: 'fib2' },
    { bits: undefined, type: 'comment', value: 'Increment counter' },
    { bits: undefined, type: 'mnemonic', value: 'INX' },
    { bits: undefined, type: 'mnemonic', value: 'CPX' },
    { bits: 8, type: 'number', value: 10 },
    { bits: undefined, type: 'comment', value: 'Have we printed 10 numbers?' },
    { bits: undefined, type: 'mnemonic', value: 'BNE' },
    { bits: undefined, type: 'literal', value: 'print_loop' },
    { bits: undefined, type: 'comment', value: 'If not, repeat' },
    { bits: undefined, type: 'mnemonic', value: 'BRK' },
    { bits: undefined, type: 'comment', value: 'End program' },
    { bits: undefined, type: 'comment', value: '--- Data ---' },
    { bits: undefined, type: 'label', value: 'fib1' },
    { bits: undefined, type: 'label', value: 'fib2' },
    { bits: undefined, type: 'label', value: 'temp' },
  ]);
});
