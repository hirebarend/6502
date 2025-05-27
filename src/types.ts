export type AddressingMode =
  | 'absolute'
  | 'absolute_indirect'
  | 'absolute_x'
  | 'absolute_y'
  | 'accumulator'
  | 'immediate'
  | 'implied'
  | 'relative'
  | 'zeropage'
  | 'zeropage_x'
  | 'zeropage_y'
  | 'zeropage_x_indirect'
  | 'zeropage_y_indirect';

export type Token = {
  bits: number | undefined;
  type: string;
  value: number | string | undefined;
};
