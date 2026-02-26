import { LogEntry } from "../types";

const LOG_COLORS: Record<LogEntry["type"], string> = {
    success: "#4ade80",
    error: "#f87171",
    info: "#4a7a5a",
};

interface RequestLogProps {
    log: LogEntry[];
    onClear: () => void;
}

export function RequestLog({ log, onClear }: RequestLogProps) {
    return (
        <div
            style={{
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
                padding: 16,
            }}
        >
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                }}
            >
                <div
                    style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: "#3d6b52",
                        letterSpacing: 1,
                        textTransform: "uppercase",
                    }}
                >
                    Request Log
                </div>
                {log.length > 0 && (
                    <button
                        onClick={onClear}
                        style={{
                            fontSize: 11,
                            color: "#3d6b52",
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontFamily: "'DM Mono', monospace",
                        }}
                    >
                        clear
                    </button>
                )}
            </div>

            <div
                style={{
                    flex: 1,
                    overflowY: "auto",
                    fontFamily: "'DM Mono', monospace",
                    fontSize: 11,
                    lineHeight: 1.8,
                }}
            >
                {log.length === 0 ? (
                    <div style={{ color: "#2a4030" }}>No activity yet...</div>
                ) : (
                    log.map((entry, i) => (
                        <div
                            key={i}
                            style={{
                                color: LOG_COLORS[entry.type],
                                animation: i === 0 ? "fadeSlide 0.2s ease" : "none",
                            }}
                        >
                            [{entry.timestamp}] {entry.text}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}