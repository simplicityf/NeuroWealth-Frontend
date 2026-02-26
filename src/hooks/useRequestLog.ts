"use client";

import { useState, useCallback } from "react";
import { LogEntry } from "../types";
import { classifyLog } from "../utils/webhook";

const MAX_LOG_ENTRIES = 50;

export function useRequestLog() {
    const [log, setLog] = useState<LogEntry[]>([]);

    const addLog = useCallback((text: string) => {
        const entry: LogEntry = {
            timestamp: new Date().toLocaleTimeString(),
            text,
            type: classifyLog(text),
        };
        setLog((prev) => [entry, ...prev].slice(0, MAX_LOG_ENTRIES));
    }, []);

    const clearLog = useCallback(() => setLog([]), []);

    return { log, addLog, clearLog };
}