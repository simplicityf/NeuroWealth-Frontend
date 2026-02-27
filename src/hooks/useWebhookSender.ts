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

    const sendMessage = useCallback(
        async (id: string, text: string) => {
            updateStatus(id, "sending");
            try {
                const res = await fetch(`${WEBHOOK_SERVER}/api/message/send`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        to: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER,
                        text,
                        useTemplate: false,
                    }),
                });
                updateStatus(id, res.ok ? "sent" : "failed");
                addLog(res.ok ? `✓ Sent: "${text}"` : `✗ Failed (${res.status}): "${text}"`);
            } catch (err) {
                updateStatus(id, "failed");
                addLog(`✗ Network error: "${text}"`);
            }
        },
        [updateStatus, addLog]
    );

    const retryMessage = useCallback(
        (msg: Message) => {
            addLog(`↺ Retrying: "${msg.body}"`);
            sendMessage(msg.id, msg.body);
        },
        [sendMessage, addLog]
    );

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

    return { sendMessage, retryMessage, simulateReply };
}