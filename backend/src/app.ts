import express, { Application, Request, Response, NextFunction } from 'express';
import cors from "cors";
import pinoHttp from 'pino-http';
import { logger } from './utils/logger';
import { verifySignatureMiddleware } from './middleware/verifySignature';
import { isValidWebhookPayload, parseWebhookPayload } from './utils/messageParser';
import { eventBus } from './services/eventBus';
import sendRouter from "./routes/message";

export function createApp(): Application {
  const app = express();

  app.use(cors());
  app.use((req, res, next) => {
    if (req.path === '/webhook') return next();
    express.json()(req, res, next);
  });

  // ── Request logging ────────────────────────────────────────────────────────
  app.use(
    pinoHttp({
      logger,
      customLogLevel: (_req, res) => (res.statusCode >= 400 ? 'warn' : 'info'),
    })
  );

  // ── Health check ───────────────────────────────────────────────────────────
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'neurowealth-webhook', ts: Date.now() });
  });

  // ── GET /webhook — Meta verification (no body needed) ─────────────────────
  app.get('/webhook', (req: Request, res: Response): void => {
    const mode = req.query['hub.mode'] as string;
    const token = req.query['hub.verify_token'] as string;
    const challenge = req.query['hub.challenge'] as string;

    const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN || '';

    if (mode === 'subscribe' && token === verifyToken) {
      logger.info('Meta webhook verification successful');
      res.status(200).send(challenge);
      return;
    }

    logger.warn({ mode, token }, 'Meta webhook verification failed');
    res.status(403).json({ error: 'Verification failed' });
  });

  // ── POST /webhook — Raw body required for HMAC verification ───────────────
  app.post(
    '/webhook',
    express.raw({ type: 'application/json', limit: '5mb' }),
    verifySignatureMiddleware,
    (req: Request, res: Response): void => {
      // ✅ Respond immediately — Meta requires 200 within 5 seconds
      res.status(200).send('EVENT_RECEIVED');

      // 🔄 Process asynchronously after response
      setImmediate(() => {
        try {
          const body = (req as Request & { parsedBody: unknown }).parsedBody;

          if (!isValidWebhookPayload(body)) {
            logger.debug({ body }, 'Non-message webhook payload received (status update etc.)');
            return;
          }

          const messages = parseWebhookPayload(body);

          if (messages.length === 0) {
            logger.debug('Webhook had no processable text messages');
            return;
          }

          for (const message of messages) {
            eventBus.emitMessage(message);
          }
        } catch (err) {
          eventBus.emitParseError(
            err as Error,
            (req as Request & { parsedBody: unknown }).parsedBody
          );
        }
      });
    }
  );

  // Routes 
  app.use("/api/message", sendRouter);

  // ── Global error handler ───────────────────────────────────────────────────
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err }, 'Unhandled error');
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
