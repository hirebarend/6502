import * as fs from 'node:fs';
import { argv } from 'node:process';
import { Assembler } from './assembler';

const src: string = fs.readFileSync(argv[2], 'utf-8');

const assembler: Assembler = new Assembler(src);

const result = assembler.assemble();

fs.writeFileSync(argv[3], result);
