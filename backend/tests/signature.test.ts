// tests/signature.test.ts
import crypto from 'crypto';
import { verifySignature } from '../src/utils/signature';

const APP_SECRET = 'test-app-secret-12345';

function makeSignature(body: string, secret: string): string {
  const hash = crypto.createHmac('sha256', secret).update(Buffer.from(body)).digest('hex');
  return `sha256=${hash}`;
}

describe('verifySignature', () => {
  it('returns true for a valid signature', () => {
    const body = JSON.stringify({ test: 'payload' });
    const sig = makeSignature(body, APP_SECRET);
    expect(verifySignature(Buffer.from(body), sig, APP_SECRET)).toBe(true);
  });

  it('returns false when signature is undefined', () => {
    const body = Buffer.from('{}');
    expect(verifySignature(body, undefined, APP_SECRET)).toBe(false);
  });

  it('returns false when signature has wrong algorithm prefix', () => {
    const body = JSON.stringify({ foo: 'bar' });
    const hash = crypto.createHmac('sha256', APP_SECRET).update(body).digest('hex');
    expect(verifySignature(Buffer.from(body), `md5=${hash}`, APP_SECRET)).toBe(false);
  });

  it('returns false when signature was signed with a different secret', () => {
    const body = JSON.stringify({ foo: 'bar' });
    const sig = makeSignature(body, 'wrong-secret');
    expect(verifySignature(Buffer.from(body), sig, APP_SECRET)).toBe(false);
  });

  it('returns false when body has been tampered', () => {
    const originalBody = JSON.stringify({ amount: 100 });
    const sig = makeSignature(originalBody, APP_SECRET);
    const tamperedBody = JSON.stringify({ amount: 9999 });
    expect(verifySignature(Buffer.from(tamperedBody), sig, APP_SECRET)).toBe(false);
  });

  it('returns false for malformed signature (no = separator)', () => {
    const body = Buffer.from('{}');
    expect(verifySignature(body, 'badsignature', APP_SECRET)).toBe(false);
  });

  it('handles binary body correctly', () => {
    const body = Buffer.from([0x01, 0x02, 0x03, 0xff]);
    const hash = crypto.createHmac('sha256', APP_SECRET).update(body).digest('hex');
    const sig = `sha256=${hash}`;
    expect(verifySignature(body, sig, APP_SECRET)).toBe(true);
  });
});
