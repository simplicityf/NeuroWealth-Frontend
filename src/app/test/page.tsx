"use client";

import { useState } from "react";
import { useServerStatus } from "../../hooks/useServerStatus";
import { useMessages } from "../../hooks/useMessages";
import { useRequestLog } from "../../hooks/useRequestLog";
import { useWebhookSender } from "../../hooks/useWebhookSender";
import { GlobalStyles } from "../../components/GlobalStyles";
import { ChatHeader } from "../../components/ChatHeader";
import { MessageList } from "../../components/MessageList";
import { ChatInput } from "../../components/ChatInput";
import { QuickActions } from "../../components/QuickActions";
import { RequestLog } from "../../components/RequestLog";
import { useSocket } from "@/hooks/useSocket";

const WEBHOOK_SERVER = process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:2000";

export default function WebhookTestPage() {
    const serverStatus = useServerStatus();
    const { messages, addMessage, updateStatus, clear } = useMessages();
    console.log("Current messages:", messages);
    const { log, addLog, clearLog } = useRequestLog();
    const { simulateReply } = useWebhookSender({
        addMessage,
        updateStatus,
        addLog,
    });

    const [prefill, setPrefill] = useState<string | undefined>(undefined);

    function handleQuickMessage(text: string) {
        setPrefill(text);
    }

    function handleSend(text: string) {
        setPrefill(undefined);
        if (!text.trim()) return;

        const id = `outgoing_${Date.now()}`;

        addMessage({
            id,
            direction: "outgoing",
            body: text,
            from: "You",
            timestamp: Math.floor(Date.now() / 1000),
            status: "sending",
        });

        fetch(`${WEBHOOK_SERVER}/api/message/send`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ to: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER, text, useTemplate: false }),
        })
            .then(res => updateStatus(id, res.ok ? "sent" : "failed"))
            .catch(() => updateStatus(id, "failed"));
    }

    useSocket(addMessage);

    return (
        <>
            <GlobalStyles />

            <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", height: "100vh" }}>

                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        borderRight: "1px solid #1a2e22",
                    }}
                >
                    <ChatHeader serverStatus={serverStatus} />

                    <MessageList messages={messages} />

                    <ChatInput
                        onSend={handleSend}
                        prefillValue={prefill}
                        onPrefillConsumed={() => setPrefill(undefined)}
                    />
                </div>
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        background: "#080e0a",
                        overflow: "hidden",
                    }}
                >
                    <QuickActions
                        onQuickMessage={handleQuickMessage}
                        onBotReply={simulateReply}
                    />

                    <RequestLog log={log} onClear={clearLog} />

                    {/* Info footer */}
                    <div
                        style={{
                            margin: 12,
                            padding: 12,
                            background: "#0f1e14",
                            borderRadius: 8,
                            border: "1px solid #1e3a2e",
                            fontSize: 11,
                            color: "#3d6b52",
                            lineHeight: 1.7,
                        }}
                    >
                        <strong style={{ color: "#4a7a5a" }}>Tip:</strong> Set{" "}
                        <code style={{ color: "#86b09a" }}>WHATSAPP_APP_SECRET=</code>{" "}
                        (empty) in your <code style={{ color: "#86b09a" }}>.env</code> to
                        skip signature checks during local testing.
                    </div>
                </div>
            </div>
        </>
    );
}