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

// Key derivation function
const getKey = async (secret: string, salt: Uint8Array): Promise<CryptoKey> => {
  if (typeof window === 'undefined') {
    throw new CryptoError('Web Crypto API is not available.');
  }
  const secretKey = await window.crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256',
    },
    secretKey,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
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
  const key = await getKey(secret, salt);
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
    throw new CryptoError('Invalid encrypted data format.');
  }
  const [saltB64, ivB64, cipherB64] = parts;

  const salt = new Uint8Array(base64ToArrayBuffer(saltB64));
  const iv = new Uint8Array(base64ToArrayBuffer(ivB64));
  const ciphertext = new Uint8Array(base64ToArrayBuffer(cipherB64));

  const key = await getKey(secret, salt);

  try {
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
      'Decryption failed. Check the secret phrase or data integrity.'
    );
  }
};
