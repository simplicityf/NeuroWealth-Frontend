"use client";

import { useState } from "react";
import { useServerStatus } from "../../hooks/useServerStatus";
import { useMessages } from "../../hooks/useMessages";
import { useRequestLog } from "../../hooks/useRequestLog";
import { useWebhookSender } from "../../hooks/useWebhookSender";
import { useSocket } from "@/hooks/useSocket";
import { ChatHeader } from "@/components/whatsapp/ChatHeader";
import { ChatInput } from "@/components/whatsapp/ChatInput";
import { GlobalStyles } from "@/components/whatsapp/GlobalStyles";
import { MessageList } from "@/components/whatsapp/MessageList";
import { QuickActions } from "@/components/whatsapp/QuickActions";
import { RequestLog } from "@/components/whatsapp/RequestLog";
import { SandboxSkeleton } from "@/components/whatsapp/Sandboxskeleton";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function WebhookTestPage() {
    const serverStatus = useServerStatus();
    const { messages, addMessage, updateStatus } = useMessages();
    const { log, addLog, clearLog } = useRequestLog();
    const { sendMessage, retryMessage, simulateReply } = useWebhookSender({ addMessage, updateStatus, addLog });

    const [prefill, setPrefill] = useState<string | undefined>(undefined);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isMobile = useMediaQuery("(max-width: 767px)");

    function handleSend(text: string) {
        setPrefill(undefined);
        if (!text.trim()) return;
        const id = `outgoing_${Date.now()}`;
        addMessage({ id, direction: "outgoing", body: text, from: "You", timestamp: Math.floor(Date.now() / 1000), status: "sending" });
        sendMessage(id, text);
    }

    function handleQuickMessage(text: string) {
        setPrefill(text);
        handleSend(text);
        setSidebarOpen(false);
    }

    function handleBotReply(text: string) {
        simulateReply(text);
        setSidebarOpen(false);
    }

    useSocket(addMessage);

    if (serverStatus.state === "checking") {
        return (
            <>
                <GlobalStyles />
                <SandboxSkeleton />
            </>
        );
    }

    return (
        <>
            <GlobalStyles />

            <div className="flex h-screen overflow-hidden bg-[#0a0f0c] text-[#e8f5e2]">

                {/* ── Chat panel ── */}
                <div className="flex flex-col flex-1 min-w-0 border-r border-[#1a2e22] overflow-hidden">
                    <ChatHeader serverStatus={serverStatus} />
                    <MessageList messages={messages} onRetry={retryMessage} />
                    <ChatInput
                        onSend={handleSend}
                        prefillValue={prefill}
                        onPrefillConsumed={() => setPrefill(undefined)}
                    />
                </div>

                {/* Mobile backdrop */}
                {isMobile && sidebarOpen && (
                    <div
                        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm animate-fade-in"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ── Sidebar ──
                    Desktop: static flex column, always visible (no transform at all).
                    Mobile:  fixed drawer controlled via inline style transform.
                    Root cause of the bug: mixing CSS class .closed (translateX 100%)
                    with Tailwind md:translate-x-0 — CSS specificity meant .closed
                    always won. Solution: apply slide transform via JS/inline only on mobile.
                ── */}
                <aside
                    className="flex flex-col bg-[#080e0a] border-l border-[#1a2e22] overflow-hidden w-80 flex-shrink-0"
                    style={isMobile ? {
                        position: "fixed",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: "min(320px, 85vw)",
                        zIndex: 50,
                        transform: sidebarOpen ? "translateX(0)" : "translateX(100%)",
                        transition: "transform 0.28s cubic-bezier(0.4, 0, 0.2, 1)",
                    } : undefined}
                >
                    <div className="flex-1 overflow-y-auto min-h-0">
                        <QuickActions
                            onQuickMessage={handleQuickMessage}
                            onBotReply={handleBotReply}
                        />
                        <RequestLog log={log} onClear={clearLog} />
                    </div>

                    <div className="flex-shrink-0 m-3 p-3 bg-[#0f1e14] rounded-lg border border-[#1e3a2e]
                                    text-[11px] text-[#3d6b52] leading-relaxed">
                        <strong className="text-[#4a7a5a]">Tip:</strong>{" "}
                        Set <code className="text-[#86b09a]">WHATSAPP_APP_SECRET=</code> (empty) in your{" "}
                        <code className="text-[#86b09a]">.env</code> to skip signature checks during local testing.
                    </div>
                </aside>

                {/* Mobile sidebar toggle */}
                {isMobile && (
                    <button
                        onClick={() => setSidebarOpen((o) => !o)}
                        className="fixed bottom-20 right-4 z-30
                                   w-11 h-11 rounded-full flex items-center justify-center
                                   bg-[#0d1a12] border border-[#1e3a2e] text-[#86b09a]
                                   shadow-lg transition-colors hover:bg-[#1a2e22]"
                        aria-label="Toggle sidebar"
                    >
                        {sidebarOpen ? "✕" : "⚙"}
                    </button>
                )}
            </div>
        </>
    );
}