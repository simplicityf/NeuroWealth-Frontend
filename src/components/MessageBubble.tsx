import { Message } from "../types";
import { StatusDot } from "./StatusDot";
import { formatTime } from "../utils/webhook";

interface MessageBubbleProps {
    msg: Message;
}

export function MessageBubble({ msg }: MessageBubbleProps) {
    const isOut = msg.direction === "outgoing";

    return (
        <div
            style={{
                display: "flex",
                justifyContent: isOut ? "flex-end" : "flex-start",
                marginBottom: 12,
                animation: "fadeSlide 0.25s ease",
            }}
        >
            <div
                style={{
                    maxWidth: "70%",
                    padding: "10px 14px",
                    borderRadius: isOut ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    background: isOut
                        ? "linear-gradient(135deg, #075e54, #128c7e)"
                        : "#1e2a24",
                    color: "#e8f5e2",
                    fontSize: 14,
                    lineHeight: 1.5,
                    fontFamily: "'DM Sans', sans-serif",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                }}
            >
                <div style={{ fontWeight: 500 }}>{msg.body}</div>
                <div
                    style={{
                        fontSize: 11,
                        color: "#86b09a",
                        marginTop: 4,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: 5,
                    }}
                >
                    {formatTime(msg.timestamp)}
                    <StatusDot status={msg.status} />
                </div>
            </div>
        </div>
    );
}