"use client";

import { useCallback } from "react";
import { Message } from "../types";
import { buildFakeWhatsAppPayload } from "../utils/webhook";

const WEBHOOK_SERVER =
    process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:2000";

interface UseSenderOptions {
    addMessage: (msg: Message) => void;
    updateStatus: (id: string, status: Message["status"]) => void;
    addLog: (text: string) => void;
}

export function useWebhookSender({
    addMessage,
    updateStatus,
    addLog,
}: UseSenderOptions) {

    const simulateReply = useCallback(
        (text: string) => {
            addMessage({
                id: `reply_${Date.now()}`,
                direction: "outgoing",
                body: text,
                from: "NeuroWealth Bot",
                timestamp: Math.floor(Date.now() / 1000),
                status: "sent",
            });
            addLog(`← Bot reply simulated: "${text}"`);
        },
        [addMessage, addLog]
    );

    return { simulateReply };
}