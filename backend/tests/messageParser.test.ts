import { parseWebhookPayload, isValidWebhookPayload } from '../src/utils/messageParser';
import { WhatsAppWebhookPayload } from '../src/types/whatsapp';

const validPayload: WhatsAppWebhookPayload = {
  object: 'whatsapp_business_account',
  entry: [
    {
      id: 'ENTRY_ID',
      changes: [
        {
          field: 'messages',
          value: {
            messaging_product: 'whatsapp',
            metadata: {
              display_phone_number: '+1234567890',
              phone_number_id: 'PHONE_ID_001',
            },
            contacts: [
              { profile: { name: 'Alice' }, wa_id: '19876543210' },
            ],
            messages: [
              {
                from: '19876543210',
                id: 'wamid.abc123',
                timestamp: '1700000000',
                type: 'text',
                text: { body: 'check balance' },
              },
            ],
          },
        },
      ],
    },
  ],
};

describe('isValidWebhookPayload', () => {
  it('returns true for a valid payload', () => {
    expect(isValidWebhookPayload(validPayload)).toBe(true);
  });

  it('returns false for null', () => {
    expect(isValidWebhookPayload(null)).toBe(false);
  });

  it('returns false for wrong object type', () => {
    expect(isValidWebhookPayload({ object: 'page', entry: [{}] })).toBe(false);
  });

  it('returns false when entry is empty', () => {
    expect(isValidWebhookPayload({ object: 'whatsapp_business_account', entry: [] })).toBe(false);
  });

  it('returns false for non-object', () => {
    expect(isValidWebhookPayload('string')).toBe(false);
    expect(isValidWebhookPayload(42)).toBe(false);
  });
});

describe('parseWebhookPayload', () => {
  it('correctly parses a text message', () => {
    const messages = parseWebhookPayload(validPayload);
    expect(messages).toHaveLength(1);
    const msg = messages[0];
    expect(msg.from).toBe('19876543210');
    expect(msg.message_id).toBe('wamid.abc123');
    expect(msg.timestamp).toBe(1700000000);
    expect(msg.text.body).toBe('check balance');
    expect(msg.type).toBe('text');
    expect(msg.phone_number_id).toBe('PHONE_ID_001');
    expect(msg.display_phone_number).toBe('+1234567890');
    expect(msg.contact_name).toBe('Alice');
  });

  it('returns empty array for non-whatsapp_business_account payloads', () => {
    const payload = { ...validPayload, object: 'page' } as unknown as WhatsAppWebhookPayload;
    expect(parseWebhookPayload(payload)).toHaveLength(0);
  });

  it('skips non-text message types', () => {
    const payload: WhatsAppWebhookPayload = {
      ...validPayload,
      entry: [
        {
          id: 'e1',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '+1', phone_number_id: 'pid' },
                messages: [
                  { from: '111', id: 'wamid.img', timestamp: '1700000001', type: 'image', image: { id: 'imgid', mime_type: 'image/jpeg', sha256: 'abc' } },
                ],
              },
            },
          ],
        },
      ],
    };
    expect(parseWebhookPayload(payload)).toHaveLength(0);
  });

  it('skips status update changes (field !== messages)', () => {
    const payload: WhatsAppWebhookPayload = {
      ...validPayload,
      entry: [
        {
          id: 'e1',
          changes: [
            {
              field: 'account_alerts',
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '+1', phone_number_id: 'pid' },
              },
            },
          ],
        },
      ],
    };
    expect(parseWebhookPayload(payload)).toHaveLength(0);
  });

  it('parses multiple messages from multiple entries', () => {
    const payload: WhatsAppWebhookPayload = {
      object: 'whatsapp_business_account',
      entry: [
        {
          id: 'e1',
          changes: [
            {
              field: 'messages',
              value: {
                messaging_product: 'whatsapp',
                metadata: { display_phone_number: '+1', phone_number_id: 'pid1' },
                messages: [
                  { from: '111', id: 'wamid.1', timestamp: '1700000001', type: 'text', text: { body: 'deposit 10' } },
                  { from: '222', id: 'wamid.2', timestamp: '1700000002', type: 'text', text: { body: 'withdraw 5' } },
                ],
              },
            },
          ],
        },
      ],
    };
    const messages = parseWebhookPayload(payload);
    expect(messages).toHaveLength(2);
    expect(messages[0].text.body).toBe('deposit 10');
    expect(messages[1].text.body).toBe('withdraw 5');
  });

  it('returns empty array when messages array is absent', () => {
    const payload: WhatsAppWebhookPayload = {
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
    expect(parseWebhookPayload(payload)).toHaveLength(0);
  });
});
