import CryptoJS from 'crypto-js';

const HMAC_SECRET = import.meta.env.VITE_HMAC_SECRET || '';
const API_BASE = import.meta.env.VITE_API_BASE ?? 'http://localhost:3000';

export function signRequest(method: string, path: string, body?: any) {
  const timestamp = Math.floor(Date.now() / 1000);
  const bodyStr = body ? JSON.stringify(body) : '';
  const message = `${timestamp}${method}${path}${bodyStr}`;
  const signature = CryptoJS.HmacSHA256(message, HMAC_SECRET).toString(CryptoJS.enc.Hex);

  return {
    timestamp,
    signature,
    headers: {
      'Content-Type': 'application/json',
      'X-Hmac-Timestamp': String(timestamp),
      'X-Hmac-Signature': signature,
    },
  };
}

export async function hmacFetch(method: string, path: string, body?: any) {
  const { headers } = signRequest(method, path, body);
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  return res;
}

export { API_BASE };
