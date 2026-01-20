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
export const base64ToArrayBuffer = (base64: string) => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

export const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// Key import function
const getSecretKey = (secretB64: string): Promise<CryptoKey> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  try {
    const secretBytes = base64ToArrayBuffer(secretB64);
    // AES-GCM supports 128, 192, 256 bit keys
    if (![16, 24, 32].includes(secretBytes.byteLength)) {
      throw new Error(); // Will be caught and wrapped
    }
    return window.crypto.subtle.importKey('raw', secretBytes, 'AES-GCM', true, [
      'encrypt',
      'decrypt',
    ]);
  } catch (e) {
    throw new CryptoError(
      'Invalid Secret Key. Please provide a 128, 192, or 256-bit key, encoded in Base64.'
    );
  }
};

// Encrypt function
export const encryptText = async (
  text: string,
  secretB64: string
): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  if (!text) throw new CryptoError('Input text cannot be empty.');
  if (!secretB64) throw new CryptoError('Secret key cannot be empty.');

  const iv = window.crypto.getRandomValues(new Uint8Array(12)); // 96-bits is recommended for GCM
  const key = await getSecretKey(secretB64);
  const plaintext = enc.encode(text);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    plaintext
  );

  const ivB64 = arrayBufferToBase64(iv);
  const cipherB64 = arrayBufferToBase64(ciphertext);

  return `${ivB64}:${cipherB64}`;
};

// Decrypt function
export const decryptText = async (
  encryptedData: string,
  secretB64: string
): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  if (!encryptedData) throw new CryptoError('Encrypted data cannot be empty.');
  if (!secretB64) throw new CryptoError('Secret key cannot be empty.');

  const parts = encryptedData.split(':');
  if (parts.length !== 2) {
    throw new CryptoError(
      'Invalid encrypted data format. Expected iv:ciphertext.'
    );
  }
  const [ivB64, cipherB64] = parts;

  try {
    const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
    const ciphertext = new Uint8Array(base64ToArrayBuffer(cipherB64));

    const key = await getSecretKey(secretB64);

    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv,
      },
      key,
      ciphertext
    );

    return dec.decode(decrypted);
  } catch (err) {
    throw new CryptoError(
      'Decryption failed. This is often caused by an incorrect secret key or corrupted data.'
    );
  }
};
