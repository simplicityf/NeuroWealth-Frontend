"use client";

import { useState, useCallback } from "react";
import { Message } from "../types";

export function useMessages() {
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessage = useCallback((msg: Message) => {
        setMessages((prev) => [...prev, msg]);
    }, []);

    const updateStatus = useCallback(
        (id: string, status: Message["status"]) => {
            setMessages((prev) =>
                prev.map((m) => (m.id === id ? { ...m, status } : m))
            );
        },
        []
    );

    const clear = useCallback(() => setMessages([]), []);

    return { messages, addMessage, updateStatus, clear };
}