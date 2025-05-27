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
