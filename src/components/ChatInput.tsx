"use client";

import { useState } from "react";

interface ChatInputProps {
    onSend?: (text: string) => void;
    prefillValue?: string;
    onPrefillConsumed?: () => void;
}

export function ChatInput({ prefillValue, onPrefillConsumed, onSend }: ChatInputProps) {
    const [input, setInput] = useState("");

    const displayValue = prefillValue !== undefined ? prefillValue : input;

    function handleChange(val: string) {
        if (prefillValue !== undefined) onPrefillConsumed?.();
        setInput(val);
    }

    const handleSend = (text: string) => {
        if (!text.trim()) return;
        onSend?.(text);
        setInput("");
    };

    return (
        <div
            style={{
                padding: "12px 16px",
                background: "#0d1a12",
                borderTop: "1px solid #1a2e22",
                display: "flex",
                gap: 10,
            }}
        >
            <input
                value={displayValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(displayValue)}
                placeholder="Type a WhatsApp message to test..."
                style={{
                    flex: 1,
                    background: "#152018",
                    border: "1px solid #1e3a2e",
                    borderRadius: 24,
                    padding: "10px 16px",
                    color: "#e8f5e2",
                    fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    outline: "none",
                }}
            />
            <button
                onClick={() => handleSend(displayValue)}
                disabled={!displayValue.trim()}
                style={{
                    background: displayValue.trim()
                        ? "linear-gradient(135deg, #075e54, #25d366)"
                        : "#1a2e22",
                    border: "none",
                    borderRadius: 24,
                    padding: "10px 20px",
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: 14,
                    cursor: displayValue.trim() ? "pointer" : "not-allowed",
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans', sans-serif",
                    whiteSpace: "nowrap",
                }}
            >
                Send →
            </button>
        </div>
    );
}