const QUICK_MESSAGES = [
    "check balance",
    "deposit 100 XLM",
    "withdraw 50 XLM",
    "help",
];

const BOT_REPLIES = [
    "Your balance: 250 XLM",
    "✅ Deposit confirmed!",
    "❌ Insufficient funds",
];

interface QuickActionsProps {
    onQuickMessage: (text: string) => void;
    onBotReply: (text: string) => void;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
    return (
        <div
            style={{
                fontSize: 11,
                fontWeight: 600,
                color: "#3d6b52",
                letterSpacing: 1,
                marginBottom: 10,
                textTransform: "uppercase" as const,
            }}
        >
            {children}
        </div>
    );
}

function QuickButton({
    label,
    color,
    onClick,
}: {
    label: string;
    color: string;
    onClick: () => void;
}) {
    return (
        <button
            onClick={onClick}
            style={{
                display: "block",
                width: "100%",
                marginBottom: 6,
                padding: "8px 12px",
                background: "#0f1e14",
                border: `1px solid #1e3a2e`,
                borderRadius: 8,
                color,
                fontSize: 13,
                fontFamily: "'DM Mono', monospace",
                cursor: "pointer",
                textAlign: "left" as const,
                transition: "border-color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = "#1e3a2e")}
        >
            {label}
        </button>
    );
}

export function QuickActions({ onQuickMessage, onBotReply }: QuickActionsProps) {
    return (
        <>
            <div style={{ padding: "16px", borderBottom: "1px solid #1a2e22" }}>
                <SectionLabel>Quick Test Messages</SectionLabel>
                {QUICK_MESSAGES.map((cmd) => (
                    <QuickButton
                        key={cmd}
                        label={cmd}
                        color="#86b09a"
                        onClick={() => onQuickMessage(cmd)}
                    />
                ))}
            </div>

            <div style={{ padding: "16px", borderBottom: "1px solid #1a2e22" }}>
                <SectionLabel>Simulate Bot Reply</SectionLabel>
                {BOT_REPLIES.map((reply) => (
                    <QuickButton
                        key={reply}
                        label={reply}
                        color="#4ade80"
                        onClick={() => onBotReply(reply)}
                    />
                ))}
            </div>
        </>
    );
}