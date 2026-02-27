import { formatTime } from "@/utils/webhook";
import { StatusDot } from "./StatusDot";
import { Message } from "@/types";

interface MessageBubbleProps {
    msg: Message;
    onRetry?: (msg: Message) => void;
}

export function MessageBubble({ msg, onRetry }: MessageBubbleProps) {
    const isOut = msg.direction === "outgoing";
    const isFailed = msg.status === "failed";

    return (
        <div
            className={`flex mb-3 animate-fade-slide ${isOut ? "justify-end" : "justify-start"}`}
        >
            <div className={`flex flex-col gap-1 max-w-[70%] ${isOut ? "items-end" : "items-start"}`}>

                {/* Bubble */}
                <div
                    className={`px-3.5 py-2.5 text-[#e8f5e2] text-sm leading-relaxed
                                ${isFailed
                            ? "bg-bubble-failed border border-red-400/25 shadow-[0_2px_8px_rgba(248,113,113,0.15)]"
                            : isOut
                                ? "bg-bubble-out shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                                : "bg-bubble-in shadow-[0_2px_8px_rgba(0,0,0,0.3)]"
                        }
                                ${isOut ? "bubble-radius-out" : "bubble-radius-in"}`}
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                    <div className="font-medium">{msg.body}</div>
                    <div className={`text-[11px] mt-1 flex items-center justify-end gap-1.5
                                    ${isFailed ? "text-red-400" : "text-[#86b09a]"}`}>
                        {isFailed ? "Failed to send" : formatTime(msg.timestamp)}
                        <StatusDot status={msg.status} />
                    </div>
                </div>

                {/* Retry button */}
                {isFailed && isOut && onRetry && (
                    <button
                        onClick={() => onRetry(msg)}
                        className="flex items-center gap-1 px-2.5 py-0.5 rounded-xl
                                   text-[11px] font-semibold text-red-400
                                   border border-red-400/40 bg-transparent
                                   hover:bg-red-400/15 transition-colors duration-150 cursor-pointer"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                    >
                        ↺ Retry
                    </button>
                )}
            </div>
        </div>
    );
}