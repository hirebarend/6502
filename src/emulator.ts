import { OPCODES_TRANSFORMED } from './opcodes';
import { AddressingMode } from './types';

export class Emulator {
  protected PC: number = 0x6000; // TODO

  protected A: number = 0x00;
  protected X: number = 0x00;
  protected Y: number = 0x00;

  protected C: boolean = false;
  protected I: boolean = false;
  protected N: boolean = false;
  protected V: boolean = false;
  protected Z: boolean = false;

  constructor(protected memory: Uint8Array) {}

  protected readByte(address: number): number {
    return this.memory[address & 0xffff];
  }

  protected readWord(address: number): number {
    const low = this.readByte(address);
    const high = this.readByte((address + 1) & 0xffff);
    return (high << 8) | low;
  }

  protected resolveAddress(addressingMode: AddressingMode): number {
    switch (addressingMode) {
      case 'zeropage': {
        return this.readByte(this.PC++);
      }

      case 'zeropage_x': {
        const base = this.readByte(this.PC++);
        return (base + this.X) & 0xff;
      }

      case 'absolute': {
        const addr = this.readWord(this.PC);
        this.PC += 2;
        return addr;
      }

      case 'absolute_x': {
        const base = this.readWord(this.PC);
        this.PC += 2;
        return (base + this.X) & 0xffff;
      }

      case 'zeropage_x_indirect': {
        const zp = (this.readByte(this.PC++) + this.X) & 0xff;
        const low = this.readByte(zp);
        const high = this.readByte((zp + 1) & 0xff);
        return (high << 8) | low;
      }

      case 'zeropage_y_indirect': {
        const zp = this.readByte(this.PC++);
        const low = this.readByte(zp);
        const high = this.readByte((zp + 1) & 0xff);
        const base = (high << 8) | low;
        return (base + this.Y) & 0xffff;
      }

      default:
        throw new Error(
          `Unsupported addressing mode for STA: ${addressingMode}`,
        );
    }
  }

  protected resolveOperand(addressingMode: AddressingMode): number {
    switch (addressingMode) {
      case 'immediate': {
        return this.readByte(this.PC++);
      }

      case 'zeropage': {
        const addr = this.readByte(this.PC++);
        return this.readByte(addr);
      }

      case 'zeropage_x': {
        const base = this.readByte(this.PC++);
        const addr = (base + this.X) & 0xff;
        return this.readByte(addr);
      }

      case 'absolute': {
        const addr = this.readWord(this.PC);
        this.PC += 2;
        return this.readByte(addr);
      }

      case 'absolute_x': {
        const base = this.readWord(this.PC);
        this.PC += 2;
        const addr = (base + this.X) & 0xffff;
        return this.readByte(addr);
      }

      case 'zeropage_x_indirect': {
        const zp = (this.readByte(this.PC++) + this.X) & 0xff;
        const low = this.readByte(zp);
        const high = this.readByte((zp + 1) & 0xff);
        const addr = (high << 8) | low;
        return this.readByte(addr);
      }

      case 'zeropage_y_indirect': {
        const zp = this.readByte(this.PC++);
        const low = this.readByte(zp);
        const high = this.readByte((zp + 1) & 0xff);
        const base = (high << 8) | low;
        const addr = (base + this.Y) & 0xffff;
        return this.readByte(addr);
      }

      default:
        throw new Error(`Unsupported addressing mode: ${addressingMode}`);
    }
  }

  protected setC(carry: boolean) {
    this.C = carry;
  }

  protected setN(value: number) {
    this.N = (value & 0x80) !== 0;
  }

  protected setZ(value: number) {
    this.Z = value === 0;
  }

  public initialize() {
    this.PC = this.readWord(0xfffe);
  }

  public tick() {
    if (this.I) {
      return false;
    }

    const opcode = this.readByte(this.PC++);

    const mnemonic = OPCODES_TRANSFORMED[opcode].mnemonic;

    const addressingMode: AddressingMode =
      OPCODES_TRANSFORMED[opcode].addressingMode;

    const handlers: Record<
      string,
      (addressingMode: AddressingMode) => boolean
    > = {
      ADC: this.handleAdc,
      BNE: this.handleBne,
      BRK: this.handleBrk,
      CLC: this.handleClc,
      CPX: this.handleCpx,
      INX: this.handleInx,
      LDA: this.handleLda,
      LDX: this.handleLdx,
      STA: this.handleSta,
    };

    const handler = handlers[mnemonic];

    if (!handler) {
      throw new Error(`${mnemonic}`);
    }

    return handler.call(this, addressingMode);
  }

  protected handleAdc(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);

    const carryIn = this.C ? 1 : 0;
    const sum = this.A + value + carryIn;
    const result = sum & 0xff;

    this.setC(sum > 0xff);
    this.setN(result);
    this.V = !!(~(this.A ^ value) & (this.A ^ result) & 0x80);
    this.setZ(result);

    this.A = result;

    return true;
  }

  protected handleBne(addressingMode: AddressingMode): boolean {
    if (addressingMode !== 'relative') {
      throw new Error(`unexpected addressing mode: ${addressingMode}`);
    }

    const offset = this.readByte(this.PC++);

    const signedOffset = offset < 0x80 ? offset : offset - 0x100;

    if (!this.Z) {
      this.PC = (this.PC + signedOffset) & 0xffff;
    }

    return true;
  }

  protected handleBrk(addressingMode: AddressingMode): boolean {
    if (addressingMode !== 'implied') {
      throw new Error(`unexpected addressing mode: ${addressingMode}`);
    }

    this.I = true;

    return true;
  }

  protected handleClc(addressingMode: AddressingMode): boolean {
    if (addressingMode !== 'implied') {
      throw new Error(`unexpected addressing mode: ${addressingMode}`);
    }

    this.setC(false);

    return true;
  }

  protected handleCpx(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);

    const result = this.X - value;

    this.setC(this.X >= value);
    this.setN(result & 0x80);
    this.setZ(result);

    return true;
  }

  protected handleInx(addressingMode: AddressingMode): boolean {
    if (addressingMode !== 'implied') {
      throw new Error(`unexpected addressing mode: ${addressingMode}`);
    }

    this.X++;

    this.setN(this.X);
    this.setZ(this.X);

    return true;
  }

  protected handleLda(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);

    this.A = value;

    this.setN(this.A);
    this.setZ(this.A);

    return true;
  }

  protected handleLdx(addressingMode: AddressingMode): boolean {
    this.X = this.resolveOperand(addressingMode);

    this.setN(this.X);
    this.setZ(this.X);

    return true;
  }

  protected handleSta(addressingMode: AddressingMode): boolean {
    const addr = this.resolveAddress(addressingMode);

    this.memory[addr] = this.A;

    if (addr === 0x8000) {
      console.log(this.A);
    }

    return true;
  }
}
