const FAKE_BUBBLES = [
    { out: false, w: "w-48" },
    { out: true, w: "w-36" },
    { out: false, w: "w-56" },
    { out: true, w: "w-44" },
    { out: false, w: "w-32" },
    { out: true, w: "w-52" },
];

const FAKE_QUICK = ["w-28", "w-36", "w-24", "w-32"];
const FAKE_REPLY = ["w-40", "w-32", "w-44"];
const FAKE_LOG = ["w-48", "w-56", "w-36", "w-44", "w-52"];

export function SandboxSkeleton() {
    return (
        <div className="flex h-screen overflow-hidden bg-[#0a0f0c] text-[#e8f5e2]">

            {/* ── Left: chat panel ── */}
            <div className="flex flex-col flex-1 min-w-0 border-r border-[#1a2e22] overflow-hidden">

                {/* Header skeleton */}
                <div className="flex items-center gap-3 px-5 py-4 bg-[#0d1a12] border-b border-[#1a2e22] flex-shrink-0">
                    <div className="skeleton w-10 h-10 rounded-full flex-shrink-0" />
                    <div className="flex flex-col gap-1.5">
                        <div className="skeleton w-40 h-3.5 rounded" />
                        <div className="skeleton w-28 h-2.5 rounded" />
                    </div>
                </div>

                {/* Message bubbles skeleton */}
                <div className="flex-1 overflow-hidden px-4 py-5 flex flex-col gap-3">
                    {FAKE_BUBBLES.map((b, i) => (
                        <div key={i} className={`flex ${b.out ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`skeleton h-12 ${b.w}
                                    ${b.out ? "skeleton-bubble-out" : "skeleton-bubble-in"}`}
                                style={{ animationDelay: `${i * 0.1}s` }}
                            />
                        </div>
                    ))}
                </div>

                {/* Input skeleton */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-[#0d1a12] border-t border-[#1a2e22] flex-shrink-0">
                    <div className="skeleton flex-1 h-10 rounded-3xl" />
                    <div className="skeleton w-20 h-10 rounded-3xl" />
                </div>
            </div>

            {/* ── Right: sidebar skeleton (hidden on mobile) ── */}
            <div className="hidden md:flex flex-col w-80 bg-[#080e0a] border-l border-[#1a2e22] overflow-hidden">

                {/* Quick test messages */}
                <div className="p-4 border-b border-[#1a2e22]">
                    <div className="skeleton w-36 h-2.5 rounded mb-4" />
                    {FAKE_QUICK.map((w, i) => (
                        <div
                            key={i}
                            className={`skeleton ${w} h-8 rounded-lg mb-1.5`}
                            style={{ animationDelay: `${i * 0.08}s` }}
                        />
                    ))}
                </div>

                {/* Simulate bot reply */}
                <div className="p-4 border-b border-[#1a2e22]">
                    <div className="skeleton w-36 h-2.5 rounded mb-4" />
                    {FAKE_REPLY.map((w, i) => (
                        <div
                            key={i}
                            className={`skeleton ${w} h-8 rounded-lg mb-1.5`}
                            style={{ animationDelay: `${i * 0.08}s` }}
                        />
                    ))}
                </div>

                {/* Request log */}
                <div className="p-4 flex-1">
                    <div className="skeleton w-24 h-2.5 rounded mb-4" />
                    {FAKE_LOG.map((w, i) => (
                        <div
                            key={i}
                            className={`skeleton ${w} h-2.5 rounded mb-2.5`}
                            style={{ animationDelay: `${i * 0.06}s` }}
                        />
                    ))}
                </div>

                {/* Tip footer */}
                <div className="m-3 p-3 bg-[#0f1e14] rounded-lg border border-[#1e3a2e]">
                    <div className="skeleton w-full h-2.5 rounded mb-2" />
                    <div className="skeleton w-3/4 h-2.5 rounded" />
                </div>
            </div>
        </div>
    );
}