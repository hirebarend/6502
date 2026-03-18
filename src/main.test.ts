import { Assembler } from './assembler';
import { Emulator } from './emulator';

test('fibonacci program produces correct output', async () => {
  const src = `
        .org $6000
start:
        LDX #$00
        LDA #$00
        STA fib1
        LDA #$01
        STA fib2
print_loop:
        LDA fib1
        STA $8000
        LDA fib1
        CLC
        ADC fib2
        STA temp
        LDA fib2
        STA fib1
        LDA temp
        STA fib2
        INX
        CPX #$0A
        BNE print_loop
        BRK
fib1:   .byte 0
fib2:   .byte 0
temp:   .byte 0
`;

  const assembler = new Assembler(src);
  const memory = assembler.assemble();

  const output: Array<number> = [];
  const originalLog = console.log;
  console.log = (value: number) => output.push(value);

  const emulator = new Emulator(memory);
  emulator.initialize();
  while (emulator.tick()) {}

  console.log = originalLog;

  expect(output).toStrictEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
});
