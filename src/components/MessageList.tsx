"use client";

import { useEffect, useRef } from "react";
import { Message } from "../types";
import { MessageBubble } from "./MessageBubble";

interface MessageListProps {
    messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    return (
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 16px" }}>
            {messages.length === 0 ? (
                <div
                    style={{
                        textAlign: "center",
                        color: "#3d6b52",
                        marginTop: 60,
                        fontSize: 14,
                        lineHeight: 1.8,
                    }}
                >
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📨</div>
                    Type a message below to simulate an incoming
                    <br />
                    WhatsApp message hitting your webhook server.
                </div>
            ) : (
                messages.map((msg) => <MessageBubble key={msg.id} msg={msg} />)
            )}
            <div ref={bottomRef} />
        </div>
    );
}