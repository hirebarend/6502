import { Emulator } from './emulator';

const emulator = new Emulator(
  new Uint32Array([
    // LDX #0x00
    0xa2, 0x00,

    // INX
    0xe8,

    // CPX #0x0A
    0xe0, 0x0a,

    // BNE $0x02
    0xd0, 0xfb,

    // BRK
    0x00,
  ]),
);

while (emulator.tick()) {}

emulator.state();
