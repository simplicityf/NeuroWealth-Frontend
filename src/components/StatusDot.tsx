import { MessageStatus } from "../types";

const STATUS_COLORS: Record<MessageStatus, string> = {
    received: "#4ade80",
    sent: "#60a5fa",
    delivered: "#a78bfa",
    failed: "#f87171",
    sending: "#fbbf24",
};

interface StatusDotProps {
    status: MessageStatus;
}

export function StatusDot({ status }: StatusDotProps) {
    const color = STATUS_COLORS[status];
    return (
        <span
            style={{
                display: "inline-block",
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: color,
                boxShadow: `0 0 6px ${color}`,
                flexShrink: 0,
            }}
        />
    );
}