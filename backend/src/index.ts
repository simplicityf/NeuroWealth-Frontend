import 'dotenv/config';
import { createApp } from './app';
import { logger } from './utils/logger';
import { eventBus, EVENTS } from './services/eventBus';
import { ParsedMessage } from './types/whatsapp';
import { initSocket } from './services/socket';

const PORT = parseInt(process.env.PORT || '3000', 10);

const app = createApp();

eventBus.onMessage((message: ParsedMessage) => {
  logger.info(
    {
      from: message.from,
      message_id: message.message_id,
      text: message.text.body,
      timestamp: message.timestamp,
    },
    'New WhatsApp message received'
  );
  // TODO: hand off to AI agent / Stellar blockchain handler
});

eventBus.onParseError(({ error }) => {
  logger.error({ error: error.message }, 'Failed to process webhook message');
});

// ── Start server ───────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  logger.info(`NeuroWealth webhook server listening on port ${PORT}`);
});

// ── Graceful shutdown ──────────────────────────────────────────────────────
const shutdown = (signal: string) => {
  logger.info(`${signal} received — shutting down gracefully`);
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });

  // Force exit after 10s
  setTimeout(() => {
    logger.error('Force exit after timeout');
    process.exit(1);
  }, 10_000);
};

// Initialize WebSocket
initSocket(server);

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
