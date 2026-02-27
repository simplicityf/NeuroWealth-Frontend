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

    function handleSend(text: string) {
        if (!text.trim()) return;
        onSend?.(text);
        setInput("");
    }

    return (
        <div className="flex gap-2.5 px-4 py-3 bg-[#0d1a12] border-t border-[#1a2e22] flex-shrink-0">
            <input
                value={displayValue}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend(displayValue)}
                placeholder="Type a WhatsApp message to test..."
                className="flex-1 bg-[#152018] border border-[#1e3a2e] rounded-3xl px-4 py-2.5
                           text-[#e8f5e2] text-sm font-sans outline-none
                           placeholder:text-[#3d6b52] focus:border-[#25d366]
                           transition-colors duration-150"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
            />
            <button
                onClick={() => handleSend(displayValue)}
                disabled={!displayValue.trim()}
                className={`rounded-3xl px-5 py-2.5 text-white font-semibold text-sm
                            whitespace-nowrap transition-all duration-200 flex-shrink-0
                            ${displayValue.trim()
                        ? "bg-send-btn cursor-pointer hover:opacity-90"
                        : "bg-[#1a2e22] cursor-not-allowed opacity-60"
                    }`}
                style={displayValue.trim()
                    ? { background: "linear-gradient(135deg, #075e54, #25d366)" }
                    : undefined}
            >
                Send →
            </button>
        </div>
    );
}