export function littleEndianToNumber(bytes: Array<number>): number {
  let value = 0;

  for (let i = bytes.length - 1; i >= 0; i--) {
    value = (value << 8) | bytes[i];
  }

  return value;
}

export function numberToLittleEndian(
  value: number,
  count: number = 2,
): Array<number> {
  const bytes: Array<number> = [];

  for (let i = 0; i < count; i++) {
    bytes.push(value & 0xff);
    value >>>= 8;
  }

  return bytes;
}
