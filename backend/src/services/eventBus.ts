import { EventEmitter } from 'events';
import { ParsedMessage } from '../types/whatsapp';
import { logger } from '../utils/logger';

export const EVENTS = {
  MESSAGE_RECEIVED: 'message:received',
  MESSAGE_PARSE_ERROR: 'message:parse_error',
} as const;

class MessageEventBus extends EventEmitter {
  constructor() {
    super();
    this.setMaxListeners(50);
  }

  emitMessage(message: ParsedMessage): void {
    logger.info(
      { from: message.from, message_id: message.message_id, type: message.type },
      'Emitting parsed WhatsApp message'
    );
    this.emit(EVENTS.MESSAGE_RECEIVED, message);
  }

  emitParseError(error: Error, rawPayload: unknown): void {
    logger.error({ error: error.message, rawPayload }, 'Message parse error');
    this.emit(EVENTS.MESSAGE_PARSE_ERROR, { error, rawPayload });
  }

  onMessage(handler: (message: ParsedMessage) => void): void {
    this.on(EVENTS.MESSAGE_RECEIVED, handler);
  }

  onParseError(handler: (data: { error: Error; rawPayload: unknown }) => void): void {
    this.on(EVENTS.MESSAGE_PARSE_ERROR, handler);
  }
}

export const eventBus = new MessageEventBus();
