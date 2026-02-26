import crypto from 'crypto';

/**
 * Verifies the X-Hub-Signature-256 header sent by Meta.
 * The signature is computed as: HMAC-SHA256(rawBody, appSecret)
 * Header format: "sha256=<hex_digest>"
 */
export function verifySignature(
  rawBody: Buffer,
  signature: string | undefined,
  appSecret: string
): boolean {
  if (!signature) return false;

  const [algorithm, hash] = signature.split('=');
  if (algorithm !== 'sha256' || !hash) return false;

  const expectedHash = crypto
    .createHmac('sha256', appSecret)
    .update(rawBody)
    .digest('hex');

  // Use timingSafeEqual to prevent timing attacks
  const expectedBuffer = Buffer.from(expectedHash, 'hex');
  const receivedBuffer = Buffer.from(hash, 'hex');

  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
