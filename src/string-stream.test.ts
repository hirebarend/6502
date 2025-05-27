import { StringStream } from './string-stream';

test('#end', async () => {
  const stringStream = new StringStream('LDA $#00 ; this is a comment');

  const result = stringStream.end();

  expect(result).toBe('LDA $#00 ; this is a comment');
});

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

test('#peek', async () => {
  const stringStream = new StringStream('LDA $#00 ; this is a comment');

  const result = stringStream.peek(1);

  expect(result).toBe('D');
});
