import { LogEntry } from "@/types";

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
        <div className="flex flex-col p-4 min-h-0 flex-1">
            {/* Header */}
            <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-semibold text-[#3d6b52] tracking-widest uppercase">
                    Request Log
                </span>
                {log.length > 0 && (
                    <button
                        onClick={onClear}
                        className="text-[11px] text-[#3d6b52] bg-transparent border-none
                                   cursor-pointer hover:text-[#86b09a] transition-colors"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                    >
                        clear
                    </button>
                )}
            </div>

            {/* Log entries */}
            <div
                className="flex-1 overflow-y-auto text-[11px] leading-7 min-h-0"
                style={{ fontFamily: "'DM Mono', monospace" }}
            >
                {log.length === 0 ? (
                    <p className="text-[#2a4030]">No activity yet...</p>
                ) : (
                    log.map((entry, i) => (
                        <div
                            key={i}
                            className={i === 0 ? "animate-fade-slide" : ""}
                            style={{ color: LOG_COLORS[entry.type] }}
                        >
                            [{entry.timestamp}] {entry.text}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}