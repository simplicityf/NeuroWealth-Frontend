export function formatTime(ts: number): string {
    return new Date(ts * 1000).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export function buildFakeWhatsAppPayload(text: string) {
    return {
        object: "whatsapp_business_account",
        entry: [
            {
                id: "ENTRY_TEST",
                changes: [
                    {
                        field: "messages",
                        value: {
                            messaging_product: "whatsapp",
                            metadata: {
                                display_phone_number: "+1 555 000 0000",
                                phone_number_id: "TEST_PHONE_ID",
                            },
                            contacts: [
                                { profile: { name: "You (Test)" }, wa_id: "15550000000" },
                            ],
                            messages: [
                                {
                                    from: "15550000000",
                                    id: `wamid.TEST_${Date.now()}`,
                                    timestamp: String(Math.floor(Date.now() / 1000)),
                                    type: "text",
                                    text: { body: text },
                                },
                            ],
                        },
                    },
                ],
            },
        ],
    };
}

export function classifyLog(text: string): "success" | "error" | "info" {
    if (text.includes("❌")) return "error";
    if (text.includes("✅")) return "success";
    return "info";
}