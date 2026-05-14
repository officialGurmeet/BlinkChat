import { create } from 'zustand';
import { Socket } from 'socket.io-client';

export interface Message {
    id: string;
    senderId: string;
    senderAlias: string;
    content: string;
    timestamp: string;
    isSelf: boolean;
    iv?: string; // Added for persistence retrieval
}

interface ChatStore {
    socket: Socket | null;
    roomId: string | null;
    roomName: string | null;
    alias: string | null;
    participants: number;
    messages: Message[];
    isConnected: boolean;
    keyPair: CryptoKeyPair | null;
    sharedSecret: CryptoKey | null;
    typingUser: string | null;

    // Pagination state
    hasMoreMessages: boolean;
    nextCursor: string | null;
    isLoadingHistory: boolean;
    shareLink: string | null;
    isRandomChat: boolean;
    isPublicRoom: boolean;
    partnerAlias: string | null;
    matching: boolean;

    setSocket: (socket: Socket | null) => void;
    setRoom: (data: { roomId: string; roomName: string; alias: string; shareLink?: string; isRandomChat?: boolean; isPublicRoom?: boolean; partnerAlias?: string | null }) => void;
    setShareLink: (link: string | null) => void;
    setMatching: (matching: boolean) => void;
    addMessage: (message: Message) => void;
    setMessages: (messages: Message[]) => void;
    prependMessages: (messages: Message[]) => void;
    setParticipants: (count: number) => void;
    setKeyPair: (keyPair: CryptoKeyPair) => void;
    setSharedSecret: (secret: CryptoKey) => void;
    setTypingUser: (alias: string | null) => void;
    setPagination: (data: { hasMoreMessages: boolean; nextCursor: string | null }) => void;
    setIsLoadingHistory: (loading: boolean) => void;
    resetChat: () => void;
}

export const useChatStore = create<ChatStore>((set) => ({
    socket: null,
    roomId: null,
    roomName: null,
    alias: null,
    participants: 1,
    messages: [],
    isConnected: false,
    keyPair: null,
    sharedSecret: null,
    typingUser: null,
    hasMoreMessages: true,
    nextCursor: null,
    isLoadingHistory: false,
    shareLink: null,
    isRandomChat: false,
    isPublicRoom: false,
    partnerAlias: null,
    matching: false,

    setSocket: (socket) => set({ socket, isConnected: !!socket }),
    setRoom: (data) => set({ ...data }),
    setShareLink: (shareLink) => set({ shareLink }),
    setMatching: (matching) => set({ matching }),
    addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
    setMessages: (messages) => set({ messages }),
    prependMessages: (messages) => set((state) => ({ messages: [...messages, ...state.messages] })),
    setParticipants: (participants) => set({ participants }),
    setKeyPair: (keyPair) => set({ keyPair }),
    setSharedSecret: (sharedSecret) => set({ sharedSecret }),
    setTypingUser: (typingUser) => set({ typingUser }),
    setPagination: (data) => set({ ...data }),
    setIsLoadingHistory: (isLoadingHistory) => set({ isLoadingHistory }),
    resetChat: () => set({
        roomId: null,
        roomName: null,
        messages: [],
        participants: 1,
        keyPair: null,
        sharedSecret: null,
        typingUser: null,
        hasMoreMessages: true,
        nextCursor: null,
        isLoadingHistory: false,
        shareLink: null,
        isRandomChat: false,
        isPublicRoom: false,
        partnerAlias: null,
        matching: false,
    }),
}));
