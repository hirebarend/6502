import { StringStream } from './string-stream';

test('#next', async () => {
  const stringStream = new StringStream('LDA $#00 ; this is a comment');

  const result = stringStream.next();

  expect(result).toBe('L');
});

test('#peek', async () => {
  const stringStream = new StringStream('LDA $#00 ; this is a comment');

  const result = stringStream.peek();

  expect(result).toBe('L');
});

test('#skipWhitespace', async () => {
  const stringStream = new StringStream('     LDA #$00 ; this is a comment');

  const result = stringStream.skipWhitespace();

  expect(result).toBe('     ');
});
