# 6502 Assembler & Emulator

A minimal assembler and emulator for the classic [6502 CPU](https://en.wikipedia.org/wiki/MOS_Technology_6502) — built from scratch in TypeScript for learning how assembly code is converted into machine code (bytecode) and then executed by a processor.

![](/images/screenshot.png)

## What This Project Does

This project demonstrates the three steps that happen when you run an assembly program:

1. **Tokenizing** — The assembler reads your `.asm` source code and breaks it into tokens (instructions, addresses, labels, etc.)
2. **Assembling** — The tokens are converted into machine code (bytecode) — the raw bytes that the CPU understands
3. **Executing** — The emulator loads the bytecode into memory and executes it instruction by instruction, just like a real 6502 CPU would

## Quick Start

```bash
git clone https://github.com/hirebarend/6502.git

cd 6502

npm install

# Assemble and run the Fibonacci example
npm run dev -- fibonacci.asm fibonacci.bin
```

You should see the first 10 Fibonacci numbers printed:

```
0 1 1 2 3 5 8 13 21 34
```

Try the countdown example too:

```bash
npm run dev -- countdown.asm countdown.bin
```

## How It Works

### Step 1: Write Assembly Code

Here's a simple example (`countdown.asm`) that counts down from 10 to 0:

```asm
        .org $6000           ; Start address

start:
        LDA #$0A             ; Load 10 into the accumulator

loop:
        STA $8000            ; Output the current number
        SEC                  ; Set carry flag before subtraction
        SBC #$01             ; Subtract 1
        BNE loop             ; If not zero, keep going

        STA $8000            ; Output the final 0
        BRK                  ; End program
```

### Step 2: Assemble into Bytecode

The assembler converts each instruction into its corresponding opcode byte:

| Assembly      | Bytecode (hex) | What it does                     |
| ------------- | -------------- | -------------------------------- |
| `LDA #$0A`   | `A9 0A`        | Load the value 10 into register A |
| `STA $8000`   | `8D 00 80`     | Store register A to address $8000 |
| `SEC`         | `38`           | Set the carry flag               |
| `SBC #$01`    | `E9 01`        | Subtract 1 from register A       |
| `BNE loop`    | `D0 F7`        | Branch back if result ≠ 0        |
| `BRK`         | `00`           | Stop the program                 |

### Step 3: Execute

The emulator loads the bytecode into a 64KB memory space and executes it one instruction at a time, updating the CPU registers and flags after each step.

## Project Structure

```
src/
├── main.ts           # Entry point — reads .asm, assembles, and runs
├── tokenizer.ts      # Breaks assembly source into tokens
├── assembler.ts      # Converts tokens into machine code
├── emulator.ts       # Executes machine code (CPU simulation)
├── opcodes.ts        # Lookup table of all 6502 opcodes
├── types.ts          # TypeScript type definitions
├── string-stream.ts  # Helper for reading characters one by one
├── token-stream.ts   # Helper for reading tokens one by one
└── misc.ts           # Utility functions (byte conversion)
```

## The 6502 CPU

The [MOS 6502](https://en.wikipedia.org/wiki/MOS_Technology_6502) is an 8-bit processor from 1975 that powered the Apple II, Commodore 64, and the original Nintendo (NES). It has:

- **3 registers**: A (accumulator), X, and Y (8-bit each)
- **A stack pointer** (SP) pointing into page $0100-$01FF
- **A program counter** (PC) — 16-bit, points to the next instruction
- **Status flags**: Carry, Zero, Negative, Overflow, Interrupt, Decimal

This implementation supports all 56 standard instructions including:

| Category              | Instructions                                      |
| --------------------- | ------------------------------------------------- |
| **Load/Store**        | LDA, LDX, LDY, STA, STX, STY                     |
| **Transfer**          | TAX, TAY, TXA, TYA, TSX, TXS                     |
| **Arithmetic**        | ADC, SBC                                          |
| **Logic**             | AND, ORA, EOR                                     |
| **Shift/Rotate**      | ASL, LSR, ROL, ROR                                |
| **Compare**           | CMP, CPX, CPY                                     |
| **Branch**            | BCC, BCS, BEQ, BMI, BNE, BPL, BVC, BVS           |
| **Jump/Subroutine**   | JMP, JSR, RTS                                     |
| **Stack**             | PHA, PHP, PLA, PLP                                |
| **Flags**             | CLC, CLD, CLI, CLV, SEC, SED, SEI                 |
| **Inc/Dec**           | INC, INX, INY, DEC, DEX, DEY                      |
| **System**            | BRK, NOP, RTI, BIT                                |

## Running Tests

```bash
npm test
```

## Links

- [6502 Instruction Set Reference](https://www.masswerk.at/6502/6502_instruction_set.html)
- [6502 Family CPU Reference](https://www.pagetable.com/c64ref/6502)
- [6502 Disassembler](https://www.masswerk.at/6502/disassembler.html)
- [Easy 6502 Tutorial](https://skilldrick.github.io/easy6502/)

## Contributing

We love our contributors! Here's how you can contribute:

- [Open an issue](https://github.com/hirebarend/6502/issues) if you believe you've encountered a bug.
- Make a [pull request](https://github.com/hirebarend/6502/pull) to add new features/make quality-of-life improvements/fix bugs.

<a href="https://github.com/hirebarend/6502/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=hirebarend/6502" />
</a>

## License

6502 is open-source under the MIT License. You can [find it here](https://github.com/hirebarend/6502/blob/main/LICENSE).
