"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";
import { Message } from "../types";

const WEBHOOK_SERVER = process.env.NEXT_PUBLIC_WEBHOOK_URL || "http://localhost:2000";

export function useSocket(addMessage: (msg: Message) => void) {
    useEffect(() => {
        const socket = io(WEBHOOK_SERVER);

        socket.on("connect", () => console.log("✅ Socket.IO connected"));

        socket.on("disconnect", (reason) => {
            console.warn("⚠️ Socket.IO disconnected:", reason);
        });

        socket.on("connect_error", (err) => {
            console.error("❌ Socket.IO connect error:", err.message);
        });

        socket.on("message", (raw: any) => {
            console.log("📨 Received from server:", raw);

            const msg: Message = {
                id: raw.message_id ?? `ws_${Date.now()}`,
                direction: "incoming",
                body: raw.text?.body ?? "",
                from: raw.contact_name ?? raw.from,
                timestamp: raw.timestamp,
                status: "received",
            };

            addMessage(msg);
        });

        socket.onAny((event, ...args) => {
            console.log("🔌 Socket event:", event, args);
        });

        return () => { socket.disconnect(); };
    }, [addMessage]);
}