export interface ServerToClientEvents {
    "user-joined": (data: { alias: string; participantId: string; publicKey: string }) => void;
    "receive-message": (data: { senderId: string; senderAlias: string; ciphertext: string; iv: string; createdAt: Date }) => void;
    "key-exchange": (data: { publicKey: string }) => void;
    "typing": (data: { alias: string }) => void;
    "stop-typing": () => void;
    "user-left": (data: { alias: string }) => void;
    "chat-ended": (data: { message: string }) => void;
    "match-found": (data: { roomId: string; partnerAlias: string; partnerId: string }) => void;
    "partner-disconnected": () => void;
    "room-users-update": (data: { count: number }) => void;
    error: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
    "join-room": (data: { roomId: string; alias: string; publicKey: string }) => void;
    "send-message": (data: { roomId: string; senderId: string; senderAlias: string; ciphertext: string; iv: string }) => void;
    "request-key-exchange": (data: { roomId: string; publicKey: string }) => void;
    "typing": (data: { roomId: string; alias: string }) => void;
    "stop-typing": (data: { roomId: string }) => void;
    "end-chat": (data: { roomId: string }) => void;
    "start-random-chat": (data: { alias: string }) => void;
    "skip-user": () => void;
    "join-public-room": (data: { roomId: string; alias: string }) => void;
}

export interface InterServerEvents {
    ping: () => void;
}

export interface SocketData {
    alias: string;
    roomId: string;
    partnerAlias?: string;
}
