import * as fs from 'node:fs';
import { argv } from 'node:process';
import { Assembler } from './assembler';
import { Emulator } from './emulator';

const inputFile = argv[2] || 'fibonacci.asm';
const outputFile = argv[3] || 'fibonacci.bin';

// Step 1: Read the assembly source code
const src: string = fs.readFileSync(inputFile, 'utf-8');

console.log(`Assembling ${inputFile}...`);

// Step 2: Assemble the source code into machine code (bytecode)
const assembler: Assembler = new Assembler(src);
const memory = assembler.assemble();

// Step 3: Write the machine code to a binary file
fs.writeFileSync(outputFile, memory);

console.log(`Wrote ${memory.length} bytes to ${outputFile}`);
console.log('');
console.log('Running program...');
console.log('--- Output ---');

// Step 4: Load the machine code into the emulator and run it
const emulator: Emulator = new Emulator(memory);

emulator.initialize();

while (emulator.tick()) {}

console.log('--------------');
console.log('Program finished.');
