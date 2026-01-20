'use client';

// Custom Error for crypto operations
export class CryptoError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CryptoError';
  }
}

// Text encoder/decoder
const enc = new TextEncoder();
const dec = new TextDecoder();

// Base64 helpers
const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Import key from base64 secret
const getSecretKey = async (secret: string): Promise<CryptoKey> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }

  let secretRaw: ArrayBuffer;
  try {
    secretRaw = base64ToArrayBuffer(secret);
  } catch (e) {
    throw new CryptoError('Secret key is not a valid Base64 string.');
  }

  // The .NET implementation uses a 256-bit key.
  if (secretRaw.byteLength !== 32) {
    throw new CryptoError(
      'Secret key must be 32 bytes (256 bits) when Base64 decoded.'
    );
  }

  return window.crypto.subtle.importKey(
    'raw',
    secretRaw,
    { name: 'AES-CBC', length: 256 },
    false, // not extractable
    ['encrypt', 'decrypt']
  );
};

// Encrypt function using AES-CBC
export const encryptText = async (
  text: string,
  secret: string
): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  if (!text) throw new CryptoError('Input text cannot be empty.');
  if (!secret) throw new CryptoError('Secret key cannot be empty.');

  const key = await getSecretKey(secret);
  const iv = window.crypto.getRandomValues(new Uint8Array(16)); // 128-bit IV for AES-CBC
  const plaintext = enc.encode(text);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: iv,
    },
    key,
    plaintext
  );

  const ivB64 = arrayBufferToBase64(iv);
  const cipherB64 = arrayBufferToBase64(ciphertext);

  // We store the IV and ciphertext together, separated by a colon.
  // This is a common and reliable method.
  return `${ivB64}:${cipherB64}`;
};

// Decrypt function using AES-CBC
export const decryptText = async (
  encryptedData: string,
  secret: string
): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  if (!encryptedData) throw new CryptoError('Encrypted data cannot be empty.');
  if (!secret) throw new CryptoError('Secret key cannot be empty.');

  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    // The C# implementation has a data format of `iv_string + base64_ciphertext`
    // which is insecure and difficult to parse reliably. This implementation
    // only supports the `base64(iv):base64(ciphertext)` format.
    throw new CryptoError(
      'Invalid encrypted data format. Expected format: iv_base64:ciphertext_base64'
    );
  }
  const [ivB64, cipherB64] = parts;

  try {
    const key = await getSecretKey(secret);
    const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
    const ciphertext = new Uint8Array(base64ToArrayBuffer(cipherB64));

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-CBC',
        iv: iv,
      },
      key,
      ciphertext
    );

    return dec.decode(decrypted);
  } catch (err) {
    // This error is often thrown for incorrect keys or corrupted data.
    throw new CryptoError(
      'Decryption failed. This is often caused by an incorrect secret key or corrupted data.'
    );
  }
};
