import { ServerStatus } from "../types";

const STATUS_COLORS: Record<ServerStatus["state"], string> = {
    checking: "#facc15",
    online: "#4ade80",
    offline: "#f87171",
};

interface ChatHeaderProps {
    serverStatus: ServerStatus;
}

export function ChatHeader({ serverStatus }: ChatHeaderProps) {
    const color = STATUS_COLORS[serverStatus.state];
    const isPulsing = serverStatus.state === "checking";

    return (
        <div
            style={{
                padding: "16px 20px",
                background: "#0d1a12",
                borderBottom: "1px solid #1a2e22",
                display: "flex",
                alignItems: "center",
                gap: 12,
            }}
        >
            <div
                style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #075e54, #25d366)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 20,
                    flexShrink: 0,
                }}
            >
                💬
            </div>

            <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>
                    WhatsApp Webhook Tester
                </div>
                <div
                    style={{
                        fontSize: 12,
                        color: "#86b09a",
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                    }}
                >
                    <span
                        style={{
                            display: "inline-block",
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: color,
                            animation: isPulsing ? "pulse 1.5s infinite" : "none",
                        }}
                    />
                    Express server: {serverStatus.state}
                    <span style={{ color: "#3d6b52" }}>{serverStatus.url}</span>
                </div>
            </div>
        </div>
    );
}