
const ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
const ALPHABET_MAP: Record<string, bigint> = {};
for (let i = 0; i < ALPHABET.length; i++) {
  ALPHABET_MAP[ALPHABET.charAt(i)] = BigInt(i);
}

/**
 * 将字符串编码为 Base58
 */
export const encode = (input: string): string => {
  if (!input) return '';

  const bytes = new TextEncoder().encode(input);
  let x = BigInt(0);
  for (const b of bytes) {
    x = x * 256n + BigInt(b);
  }

  let output = '';
  while (x > 0n) {
    output = ALPHABET[Number(x % 58n)] + output;
    x /= 58n;
  }

  // 处理输入开头的 0 字节（Base58 约定用字母表的第一个字符表示）
  for (let i = 0; i < bytes.length && bytes[i] === 0; i++) {
    output = ALPHABET[0] + output;
  }

  return output;
};

/**
 * 将 Base58 字符串解码回原始字符串
 */
export const decode = (input: string): string => {
  if (!input) return '';

  let x = BigInt(0);
  for (const char of input) {
    const val = ALPHABET_MAP[char];
    if (val === undefined) {
      throw new Error(`包含无效的 Base58 字符: ${char}`);
    }
    x = x * 58n + val;
  }

  const bytes: number[] = [];
  while (x > 0n) {
    bytes.push(Number(x % 256n));
    x /= 256n;
  }

  // 处理前导 '1'（代表 0 字节）
  for (let i = 0; i < input.length && input[i] === ALPHABET[0]; i++) {
    bytes.push(0);
  }

  return new TextDecoder().decode(new Uint8Array(bytes.reverse()));
};

export const isValidBase58 = (input: string): boolean => {
  return /^[1-9A-HJ-NP-Za-km-z]+$/.test(input);
};
