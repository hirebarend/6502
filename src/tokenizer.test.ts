import * as fs from 'node:fs';
import { Tokenizer } from './tokenizer';

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('; this is a comment');

  expect(result).toStrictEqual([
    { type: 'comment', value: 'this is a comment' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('BRK ; this is a comment');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'BRK' },
    { type: 'comment', value: 'this is a comment' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('.org $8000');

  expect(result).toStrictEqual([
    { type: 'directive', value: 'org' },
    { type: 'address', value: 32768 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('start:');

  expect(result).toStrictEqual([{ type: 'label', value: 'start' }]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('BRK');

  expect(result).toStrictEqual([{ type: 'mnemonic', value: 'BRK' }]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ASL A');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ASL' },
    { type: 'literal', value: 'A' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC #$00');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'number', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $00000');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'address', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $0000, X');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'address', value: 0 },
    { type: 'comma', value: undefined },
    { type: 'literal', value: 'X' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $0000, Y');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'address', value: 0 },
    { type: 'comma', value: undefined },
    { type: 'literal', value: 'Y' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('JMP ($0000)');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'JMP' },
    { type: 'parentheses', value: undefined },
    { type: 'address', value: 0 },
    { type: 'parentheses', value: undefined },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $00');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'address', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC $00, X');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'address', value: 0 },
    { type: 'comma', value: undefined },
    { type: 'literal', value: 'X' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('LDX $00, Y');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'LDX' },
    { type: 'address', value: 0 },
    { type: 'comma', value: undefined },
    { type: 'literal', value: 'Y' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC ($00, X)');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'parentheses', value: undefined },
    { type: 'address', value: 0 },
    { type: 'comma', value: undefined },
    { type: 'literal', value: 'X' },
    { type: 'parentheses', value: undefined },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('ADC ($00), Y');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'ADC' },
    { type: 'parentheses', value: undefined },
    { type: 'address', value: 0 },
    { type: 'parentheses', value: undefined },
    { type: 'comma', value: undefined },
    { type: 'literal', value: 'Y' },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('BCC $0000');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'BCC' },
    { type: 'address', value: 0 },
  ]);
});

test('#tokenizeLine', async () => {
  const tokenizer: Tokenizer = new Tokenizer('');

  const result = tokenizer.tokenizeLine('LDA temp');

  expect(result).toStrictEqual([
    { type: 'mnemonic', value: 'LDA' },
    { type: 'literal', value: 'temp' },
  ]);
});

test('#tokenize', async () => {
  const src: string = fs.readFileSync('data/code-1.asm', 'utf-8');

  const tokenizer: Tokenizer = new Tokenizer(src);

  const result = tokenizer.tokenize();

  expect(result).toStrictEqual([
    { type: 'directive', value: 'org' },
    { type: 'address', value: 32768 },
    { type: 'comment', value: 'Start address' },
    { type: 'label', value: 'start' },
    { type: 'mnemonic', value: 'LDX' },
    { type: 'number', value: 0 },
    { type: 'comment', value: 'Counter = 0' },
    { type: 'mnemonic', value: 'LDA' },
    { type: 'number', value: 0 },
    { type: 'comment', value: 'A = 0 (fib0)' },
    { type: 'mnemonic', value: 'STA' },
    { type: 'literal', value: 'fib1' },
    { type: 'mnemonic', value: 'LDA' },
    { type: 'number', value: 1 },
    { type: 'comment', value: 'A = 1 (fib1)' },
    { type: 'mnemonic', value: 'STA' },
    { type: 'literal', value: 'fib2' },
    { type: 'label', value: 'print_loop' },
    { type: 'comment', value: 'Print fib1' },
    { type: 'mnemonic', value: 'LDA' },
    { type: 'literal', value: 'fib1' },
    { type: 'mnemonic', value: 'STA' },
    { type: 'address', value: 24576 },
    { type: 'comment', value: 'Output to I/O register' },
    { type: 'comment', value: 'Calculate next Fibonacci number' },
    { type: 'mnemonic', value: 'LDA' },
    { type: 'literal', value: 'fib1' },
    { type: 'comment', value: 'A = fib1' },
    { type: 'mnemonic', value: 'CLC' },
    { type: 'mnemonic', value: 'ADC' },
    { type: 'literal', value: 'fib2' },
    { type: 'comment', value: 'A = fib1 + fib2' },
    { type: 'mnemonic', value: 'STA' },
    { type: 'literal', value: 'temp' },
    { type: 'comment', value: 'Store new value temporarily' },
    {
      type: 'comment',
      value: 'Shift values: fib2 -> fib1, temp -> fib2',
    },
    { type: 'mnemonic', value: 'LDA' },
    { type: 'literal', value: 'fib2' },
    { type: 'mnemonic', value: 'STA' },
    { type: 'literal', value: 'fib1' },
    { type: 'mnemonic', value: 'LDA' },
    { type: 'literal', value: 'temp' },
    { type: 'mnemonic', value: 'STA' },
    { type: 'literal', value: 'fib2' },
    { type: 'comment', value: 'Increment counter' },
    { type: 'mnemonic', value: 'INX' },
    { type: 'mnemonic', value: 'CPX' },
    { type: 'number', value: 16 },
    { type: 'comment', value: 'Have we printed 10 numbers?' },
    { type: 'mnemonic', value: 'BNE' },
    { type: 'literal', value: 'print_loop' },
    { type: 'comment', value: 'If not, repeat' },
    { type: 'mnemonic', value: 'BRK' },
    { type: 'comment', value: 'End program' },
    { type: 'comment', value: '--- Data ---' },
    { type: 'label', value: 'fib1' },
    { type: 'label', value: 'fib2' },
    { type: 'label', value: 'temp' },
  ]);
});
