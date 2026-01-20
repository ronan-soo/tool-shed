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

// Key derivation function
const getSecretKey = (
  password: string,
  salt: Uint8Array
): Promise<CryptoKey> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  const passwordBuffer = enc.encode(password);
  return window.crypto.subtle
    .importKey('raw', passwordBuffer, { name: 'PBKDF2' }, false, ['deriveKey'])
    .then((key) =>
      window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: 100000,
          hash: 'SHA-256',
        },
        key,
        { name: 'AES-GCM', length: 256 },
        true,
        ['encrypt', 'decrypt']
      )
    );
};

// Encrypt function
export const encryptText = async (
  text: string,
  secret: string
): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  if (!text) throw new CryptoError('Input text cannot be empty.');
  if (!secret) throw new CryptoError('Secret phrase cannot be empty.');

  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await getSecretKey(secret, salt);
  const plaintext = enc.encode(text);

  const ciphertext = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    plaintext
  );

  const saltB64 = arrayBufferToBase64(salt);
  const ivB64 = arrayBufferToBase64(iv);
  const cipherB64 = arrayBufferToBase64(ciphertext);

  return `${saltB64}:${ivB64}:${cipherB64}`;
};

// Decrypt function
export const decryptText = async (
  encryptedData: string,
  secret: string
): Promise<string> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  if (!encryptedData) throw new CryptoError('Encrypted data cannot be empty.');
  if (!secret) throw new CryptoError('Secret phrase cannot be empty.');

  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new CryptoError(
      'Invalid encrypted data format. Expected salt:iv:ciphertext.'
    );
  }
  const [saltB64, ivB64, cipherB64] = parts;

  try {
    const salt = new Uint8Array(base64ToArrayBuffer(saltB64));
    const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
    const ciphertext = new Uint8Array(base64ToArrayBuffer(cipherB64));

    const key = await getSecretKey(secret, salt);

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
      'Decryption failed. This is often caused by an incorrect secret phrase or corrupted data.'
    );
  }
};
