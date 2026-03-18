import { OPCODES_TRANSFORMED } from './opcodes';
import { AddressingMode } from './types';

export class Emulator {
  protected PC: number = 0x0000;

  protected A: number = 0x00;
  protected X: number = 0x00;
  protected Y: number = 0x00;
  protected SP: number = 0xff;

  protected C: boolean = false;
  protected D: boolean = false;
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

  protected writeByte(address: number, value: number): void {
    this.memory[address & 0xffff] = value & 0xff;

    if (address === 0x8000) {
      console.log(value & 0xff);
    }
  }

  protected pushByte(value: number): void {
    this.memory[0x0100 + this.SP] = value & 0xff;
    this.SP = (this.SP - 1) & 0xff;
  }

  protected pushWord(value: number): void {
    this.pushByte((value >> 8) & 0xff);
    this.pushByte(value & 0xff);
  }

  protected pullByte(): number {
    this.SP = (this.SP + 1) & 0xff;
    return this.memory[0x0100 + this.SP];
  }

  protected pullWord(): number {
    const low = this.pullByte();
    const high = this.pullByte();
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

      case 'zeropage_y': {
        const base = this.readByte(this.PC++);
        return (base + this.Y) & 0xff;
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

      case 'absolute_y': {
        const base = this.readWord(this.PC);
        this.PC += 2;
        return (base + this.Y) & 0xffff;
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
        throw new Error(`Unsupported addressing mode: ${addressingMode}`);
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

      case 'zeropage_y': {
        const base = this.readByte(this.PC++);
        const addr = (base + this.Y) & 0xff;
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

      case 'absolute_y': {
        const base = this.readWord(this.PC);
        this.PC += 2;
        const addr = (base + this.Y) & 0xffff;
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

  protected setN(value: number) {
    this.N = (value & 0x80) !== 0;
  }

  protected setZ(value: number) {
    this.Z = (value & 0xff) === 0;
  }

  protected getStatusByte(): number {
    let status = 0x20;
    if (this.C) status |= 0x01;
    if (this.Z) status |= 0x02;
    if (this.I) status |= 0x04;
    if (this.D) status |= 0x08;
    if (this.N) status |= 0x80;
    if (this.V) status |= 0x40;
    return status;
  }

  protected setStatusByte(value: number): void {
    this.C = (value & 0x01) !== 0;
    this.Z = (value & 0x02) !== 0;
    this.I = (value & 0x04) !== 0;
    this.D = (value & 0x08) !== 0;
    this.V = (value & 0x40) !== 0;
    this.N = (value & 0x80) !== 0;
  }

  public initialize() {
    // Read program start address from the reset vector at $FFFC/$FFFD
    this.PC = this.readWord(0xfffc);
  }

  public tick() {
    if (this.I) {
      return false;
    }

    const opcode = this.readByte(this.PC++);

    const entry = OPCODES_TRANSFORMED[opcode];

    if (!entry) {
      throw new Error(`Unknown opcode: 0x${opcode.toString(16)}`);
    }

    const mnemonic = entry.mnemonic;
    const addressingMode: AddressingMode = entry.addressingMode;

    const handlers: Record<
      string,
      (addressingMode: AddressingMode, mnemonic?: string) => boolean
    > = {
      // Load/Store
      LDA: this.handleLda,
      LDX: this.handleLdx,
      LDY: this.handleLdy,
      STA: this.handleSta,
      STX: this.handleStx,
      STY: this.handleSty,

      // Transfer
      TAX: this.handleTax,
      TAY: this.handleTay,
      TXA: this.handleTxa,
      TYA: this.handleTya,
      TSX: this.handleTsx,
      TXS: this.handleTxs,

      // Arithmetic
      ADC: this.handleAdc,
      SBC: this.handleSbc,

      // Logic
      AND: this.handleAnd,
      ORA: this.handleOra,
      EOR: this.handleEor,

      // Shift/Rotate
      ASL: this.handleAsl,
      LSR: this.handleLsr,
      ROL: this.handleRol,
      ROR: this.handleRor,

      // Compare
      CMP: this.handleCmp,
      CPX: this.handleCpx,
      CPY: this.handleCpy,

      // Branch
      BCC: this.handleBranch,
      BCS: this.handleBranch,
      BEQ: this.handleBranch,
      BMI: this.handleBranch,
      BNE: this.handleBranch,
      BPL: this.handleBranch,
      BVC: this.handleBranch,
      BVS: this.handleBranch,

      // Jump/Subroutine
      JMP: this.handleJmp,
      JSR: this.handleJsr,
      RTS: this.handleRts,

      // Stack
      PHA: this.handlePha,
      PHP: this.handlePhp,
      PLA: this.handlePla,
      PLP: this.handlePlp,

      // Flags
      CLC: this.handleClc,
      CLD: this.handleCld,
      CLI: this.handleCli,
      CLV: this.handleClv,
      SEC: this.handleSec,
      SED: this.handleSed,
      SEI: this.handleSei,

      // Increment/Decrement
      INC: this.handleInc,
      INX: this.handleInx,
      INY: this.handleIny,
      DEC: this.handleDec,
      DEX: this.handleDex,
      DEY: this.handleDey,

      // Bit Test
      BIT: this.handleBit,

      // System
      BRK: this.handleBrk,
      NOP: this.handleNop,
      RTI: this.handleRti,
    };

    const handler = handlers[mnemonic];

    if (!handler) {
      throw new Error(`No handler for ${mnemonic}`);
    }

    return handler.call(this, addressingMode, mnemonic);
  }

  // --- Load/Store ---

  protected handleLda(addressingMode: AddressingMode): boolean {
    this.A = this.resolveOperand(addressingMode);

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

  protected handleLdy(addressingMode: AddressingMode): boolean {
    this.Y = this.resolveOperand(addressingMode);

    this.setN(this.Y);
    this.setZ(this.Y);

    return true;
  }

  protected handleSta(addressingMode: AddressingMode): boolean {
    const addr = this.resolveAddress(addressingMode);
    this.writeByte(addr, this.A);

    return true;
  }

  protected handleStx(addressingMode: AddressingMode): boolean {
    const addr = this.resolveAddress(addressingMode);
    this.writeByte(addr, this.X);

    return true;
  }

  protected handleSty(addressingMode: AddressingMode): boolean {
    const addr = this.resolveAddress(addressingMode);
    this.writeByte(addr, this.Y);

    return true;
  }

  // --- Transfer ---

  protected handleTax(): boolean {
    this.X = this.A;
    this.setN(this.X);
    this.setZ(this.X);
    return true;
  }

  protected handleTay(): boolean {
    this.Y = this.A;
    this.setN(this.Y);
    this.setZ(this.Y);
    return true;
  }

  protected handleTxa(): boolean {
    this.A = this.X;
    this.setN(this.A);
    this.setZ(this.A);
    return true;
  }

  protected handleTya(): boolean {
    this.A = this.Y;
    this.setN(this.A);
    this.setZ(this.A);
    return true;
  }

  protected handleTsx(): boolean {
    this.X = this.SP;
    this.setN(this.X);
    this.setZ(this.X);
    return true;
  }

  protected handleTxs(): boolean {
    this.SP = this.X;
    return true;
  }

  // --- Arithmetic ---

  protected handleAdc(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);

    const carryIn = this.C ? 1 : 0;
    const sum = this.A + value + carryIn;
    const result = sum & 0xff;

    this.C = sum > 0xff;
    this.setN(result);
    this.V = !!(~(this.A ^ value) & (this.A ^ result) & 0x80);
    this.setZ(result);

    this.A = result;

    return true;
  }

  protected handleSbc(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);

    const borrowIn = this.C ? 0 : 1;
    const diff = this.A - value - borrowIn;
    const result = diff & 0xff;

    this.C = diff >= 0;
    this.setN(result);
    this.V = !!((this.A ^ value) & (this.A ^ result) & 0x80);
    this.setZ(result);

    this.A = result;

    return true;
  }

  // --- Logic ---

  protected handleAnd(addressingMode: AddressingMode): boolean {
    this.A = this.A & this.resolveOperand(addressingMode);

    this.setN(this.A);
    this.setZ(this.A);

    return true;
  }

  protected handleOra(addressingMode: AddressingMode): boolean {
    this.A = this.A | this.resolveOperand(addressingMode);

    this.setN(this.A);
    this.setZ(this.A);

    return true;
  }

  protected handleEor(addressingMode: AddressingMode): boolean {
    this.A = this.A ^ this.resolveOperand(addressingMode);

    this.setN(this.A);
    this.setZ(this.A);

    return true;
  }

  // --- Shift/Rotate ---

  protected handleAsl(addressingMode: AddressingMode): boolean {
    if (addressingMode === 'accumulator') {
      this.C = (this.A & 0x80) !== 0;
      this.A = (this.A << 1) & 0xff;
      this.setN(this.A);
      this.setZ(this.A);
    } else {
      const addr = this.resolveAddress(addressingMode);
      let value = this.readByte(addr);
      this.C = (value & 0x80) !== 0;
      value = (value << 1) & 0xff;
      this.writeByte(addr, value);
      this.setN(value);
      this.setZ(value);
    }

    return true;
  }

  protected handleLsr(addressingMode: AddressingMode): boolean {
    if (addressingMode === 'accumulator') {
      this.C = (this.A & 0x01) !== 0;
      this.A = this.A >> 1;
      this.setN(this.A);
      this.setZ(this.A);
    } else {
      const addr = this.resolveAddress(addressingMode);
      let value = this.readByte(addr);
      this.C = (value & 0x01) !== 0;
      value = value >> 1;
      this.writeByte(addr, value);
      this.setN(value);
      this.setZ(value);
    }

    return true;
  }

  protected handleRol(addressingMode: AddressingMode): boolean {
    const oldCarry = this.C ? 1 : 0;

    if (addressingMode === 'accumulator') {
      this.C = (this.A & 0x80) !== 0;
      this.A = ((this.A << 1) | oldCarry) & 0xff;
      this.setN(this.A);
      this.setZ(this.A);
    } else {
      const addr = this.resolveAddress(addressingMode);
      let value = this.readByte(addr);
      this.C = (value & 0x80) !== 0;
      value = ((value << 1) | oldCarry) & 0xff;
      this.writeByte(addr, value);
      this.setN(value);
      this.setZ(value);
    }

    return true;
  }

  protected handleRor(addressingMode: AddressingMode): boolean {
    const oldCarry = this.C ? 0x80 : 0;

    if (addressingMode === 'accumulator') {
      this.C = (this.A & 0x01) !== 0;
      this.A = (this.A >> 1) | oldCarry;
      this.setN(this.A);
      this.setZ(this.A);
    } else {
      const addr = this.resolveAddress(addressingMode);
      let value = this.readByte(addr);
      this.C = (value & 0x01) !== 0;
      value = (value >> 1) | oldCarry;
      this.writeByte(addr, value);
      this.setN(value);
      this.setZ(value);
    }

    return true;
  }

  // --- Compare ---

  protected handleCmp(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);
    const result = this.A - value;

    this.C = this.A >= value;
    this.setN(result & 0xff);
    this.setZ(result & 0xff);

    return true;
  }

  protected handleCpx(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);
    const result = this.X - value;

    this.C = this.X >= value;
    this.setN(result & 0xff);
    this.setZ(result & 0xff);

    return true;
  }

  protected handleCpy(addressingMode: AddressingMode): boolean {
    const value: number = this.resolveOperand(addressingMode);
    const result = this.Y - value;

    this.C = this.Y >= value;
    this.setN(result & 0xff);
    this.setZ(result & 0xff);

    return true;
  }

  // --- Branch ---

  protected handleBranch(
    addressingMode: AddressingMode,
    mnemonic?: string,
  ): boolean {
    if (addressingMode !== 'relative') {
      throw new Error(`unexpected addressing mode: ${addressingMode}`);
    }

    const offset = this.readByte(this.PC++);
    const signedOffset = offset < 0x80 ? offset : offset - 0x100;

    let takeBranch = false;

    switch (mnemonic) {
      case 'BCC':
        takeBranch = !this.C;
        break;
      case 'BCS':
        takeBranch = this.C;
        break;
      case 'BEQ':
        takeBranch = this.Z;
        break;
      case 'BMI':
        takeBranch = this.N;
        break;
      case 'BNE':
        takeBranch = !this.Z;
        break;
      case 'BPL':
        takeBranch = !this.N;
        break;
      case 'BVC':
        takeBranch = !this.V;
        break;
      case 'BVS':
        takeBranch = this.V;
        break;
    }

    if (takeBranch) {
      this.PC = (this.PC + signedOffset) & 0xffff;
    }

    return true;
  }

  // --- Jump/Subroutine ---

  protected handleJmp(addressingMode: AddressingMode): boolean {
    if (addressingMode === 'absolute') {
      this.PC = this.readWord(this.PC);
    } else if (addressingMode === 'absolute_indirect') {
      const addr = this.readWord(this.PC);
      this.PC = this.readWord(addr);
    }

    return true;
  }

  protected handleJsr(): boolean {
    const target = this.readWord(this.PC);
    this.PC += 2;
    this.pushWord(this.PC - 1);
    this.PC = target;

    return true;
  }

  protected handleRts(): boolean {
    this.PC = this.pullWord() + 1;

    return true;
  }

  // --- Stack ---

  protected handlePha(): boolean {
    this.pushByte(this.A);
    return true;
  }

  protected handlePhp(): boolean {
    this.pushByte(this.getStatusByte() | 0x10);
    return true;
  }

  protected handlePla(): boolean {
    this.A = this.pullByte();
    this.setN(this.A);
    this.setZ(this.A);
    return true;
  }

  protected handlePlp(): boolean {
    this.setStatusByte(this.pullByte());
    return true;
  }

  // --- Flags ---

  protected handleClc(): boolean {
    this.C = false;
    return true;
  }

  protected handleCld(): boolean {
    this.D = false;
    return true;
  }

  protected handleCli(): boolean {
    this.I = false;
    return true;
  }

  protected handleClv(): boolean {
    this.V = false;
    return true;
  }

  protected handleSec(): boolean {
    this.C = true;
    return true;
  }

  protected handleSed(): boolean {
    this.D = true;
    return true;
  }

  protected handleSei(): boolean {
    this.I = true;
    return true;
  }

  // --- Increment/Decrement ---

  protected handleInc(addressingMode: AddressingMode): boolean {
    const addr = this.resolveAddress(addressingMode);
    const result = (this.readByte(addr) + 1) & 0xff;
    this.writeByte(addr, result);
    this.setN(result);
    this.setZ(result);
    return true;
  }

  protected handleInx(): boolean {
    this.X = (this.X + 1) & 0xff;
    this.setN(this.X);
    this.setZ(this.X);
    return true;
  }

  protected handleIny(): boolean {
    this.Y = (this.Y + 1) & 0xff;
    this.setN(this.Y);
    this.setZ(this.Y);
    return true;
  }

  protected handleDec(addressingMode: AddressingMode): boolean {
    const addr = this.resolveAddress(addressingMode);
    const result = (this.readByte(addr) - 1) & 0xff;
    this.writeByte(addr, result);
    this.setN(result);
    this.setZ(result);
    return true;
  }

  protected handleDex(): boolean {
    this.X = (this.X - 1) & 0xff;
    this.setN(this.X);
    this.setZ(this.X);
    return true;
  }

  protected handleDey(): boolean {
    this.Y = (this.Y - 1) & 0xff;
    this.setN(this.Y);
    this.setZ(this.Y);
    return true;
  }

  // --- Bit Test ---

  protected handleBit(addressingMode: AddressingMode): boolean {
    const value = this.resolveOperand(addressingMode);
    this.setZ(this.A & value);
    this.N = (value & 0x80) !== 0;
    this.V = (value & 0x40) !== 0;
    return true;
  }

  // --- System ---

  protected handleBrk(): boolean {
    this.I = true;
    return true;
  }

  protected handleNop(): boolean {
    return true;
  }

  protected handleRti(): boolean {
    this.setStatusByte(this.pullByte());
    this.PC = this.pullWord();
    return true;
  }
}
