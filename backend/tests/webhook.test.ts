import request from 'supertest';
import crypto from 'crypto';
import { createApp } from '../src/app';
import { eventBus, EVENTS } from '../src/services/eventBus';
import { ParsedMessage } from '../src/types/whatsapp';

const APP_SECRET = 'test-secret-abc';
const VERIFY_TOKEN = 'test-verify-token-xyz';

// Set env before app creation
process.env.WHATSAPP_APP_SECRET = APP_SECRET;
process.env.WHATSAPP_VERIFY_TOKEN = VERIFY_TOKEN;

const app = createApp();

function sign(body: string): string {
  const hash = crypto.createHmac('sha256', APP_SECRET).update(Buffer.from(body)).digest('hex');
  return `sha256=${hash}`;
}

const validPayload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'ENTRY_123',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: { display_phone_number: '+1000000000', phone_number_id: 'PID' },
            contacts: [{ profile: { name: 'Bob' }, wa_id: '15550001111' }],
            messages: [
              {
                from: '15550001111',
                id: 'wamid.TEST001',
                timestamp: '1700000000',
                type: 'text',
                text: { body: 'deposit 50' },
              },
            ],
          },
        },
      ],
    },
  ],
};

// ─── GET /webhook ─────────────────────────────────────────────────────────────

describe('GET /webhook — Meta verification', () => {
  it('responds 200 and echoes challenge on valid verify token', async () => {
    const res = await request(app).get('/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': 'CHALLENGE_ABC',
    });
    expect(res.status).toBe(200);
    expect(res.text).toBe('CHALLENGE_ABC');
  });

  it('responds 403 on wrong verify token', async () => {
    const res = await request(app).get('/webhook').query({
      'hub.mode': 'subscribe',
      'hub.verify_token': 'wrong-token',
      'hub.challenge': 'CHALLENGE_XYZ',
    });
    expect(res.status).toBe(403);
  });

  it('responds 403 when mode is not subscribe', async () => {
    const res = await request(app).get('/webhook').query({
      'hub.mode': 'unsubscribe',
      'hub.verify_token': VERIFY_TOKEN,
      'hub.challenge': 'CHALLENGE',
    });
    expect(res.status).toBe(403);
  });
});

// ─── POST /webhook ────────────────────────────────────────────────────────────

describe('POST /webhook — incoming messages', () => {
  it('returns 403 when X-Hub-Signature-256 is missing', async () => {
    const body = JSON.stringify(validPayload);
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .send(body);
    expect(res.status).toBe(403);
  });

  it('returns 403 when signature is incorrect', async () => {
    const body = JSON.stringify(validPayload);
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', 'sha256=badhash')
      .send(body);
    expect(res.status).toBe(403);
  });

  it('returns 200 for a valid signed request', async () => {
    const body = JSON.stringify(validPayload);
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', sign(body))
      .send(body);
    expect(res.status).toBe(200);
    expect(res.text).toBe('EVENT_RECEIVED');
  });

  it('emits a parsed message event for valid payload', (done) => {
    const body = JSON.stringify(validPayload);

    eventBus.once(EVENTS.MESSAGE_RECEIVED, (message: ParsedMessage) => {
      expect(message.from).toBe('15550001111');
      expect(message.message_id).toBe('wamid.TEST001');
      expect(message.text.body).toBe('deposit 50');
      expect(message.timestamp).toBe(1700000000);
      expect(message.contact_name).toBe('Bob');
      done();
    });

    request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', sign(body))
      .send(body)
      .then(() => {/* fire and forget */ });
  });

  it('returns 200 for status-only payloads (no message emitted)', async () => {
    const statusPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'e1',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '+1', phone_number_id: 'pid' },
                statuses: [{ id: 's1', status: 'delivered', timestamp: '17000', recipient_id: '111' }],
              },
            },
          ],
        },
      ],
    };
    const body = JSON.stringify(statusPayload);
    const res = await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', sign(body))
      .send(body);
    expect(res.status).toBe(200);
  });

  it('responds quickly (within 500ms) under valid load', async () => {
    const body = JSON.stringify(validPayload);
    const start = Date.now();
    await request(app)
      .post('/webhook')
      .set('Content-Type', 'application/json')
      .set('X-Hub-Signature-256', sign(body))
      .send(body);
    expect(Date.now() - start).toBeLessThan(500);
  });
});

// ─── Health check ─────────────────────────────────────────────────────────────
describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
