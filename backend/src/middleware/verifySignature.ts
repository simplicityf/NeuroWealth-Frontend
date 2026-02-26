import { Request, Response, NextFunction } from 'express';
import { verifySignature } from '../utils/signature';
import { logger } from '../utils/logger';

export function verifySignatureMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const signature = req.headers['x-hub-signature-256'] as string | undefined;
  const appSecret = process.env.WHATSAPP_APP_SECRET || '';

  if (!appSecret) {
    logger.warn('WHATSAPP_APP_SECRET not set — skipping signature verification');
    next();
    return;
  }

  const rawBody = req.body as Buffer;

  const isValid = verifySignature(rawBody, signature, appSecret);

  if (!isValid) {
    logger.warn(
      { ip: req.ip, signature },
      'Invalid X-Hub-Signature-256 — rejecting request'
    );
    res.status(403).json({ error: 'Invalid signature' });
    return;
  }

  try {
    (req as Request & { parsedBody: unknown }).parsedBody = JSON.parse(
      rawBody.toString('utf8')
    );
  } catch {
    res.status(400).json({ error: 'Invalid JSON body' });
    return;
  }

  next();
}
