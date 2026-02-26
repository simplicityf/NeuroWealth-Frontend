export type MessageDirection = "incoming" | "outgoing";

export type MessageStatus = "received" | "sent" | "delivered" | "failed" | "sending";

export interface Message {
    id: string;
    direction: MessageDirection;
    body: string;
    from: string;
    timestamp: number;
    status: MessageStatus;
}

export interface LogEntry {
    timestamp: string;
    text: string;
    type: "success" | "error" | "info";
}

export interface ServerStatus {
    state: "checking" | "online" | "offline";
    url: string;
}