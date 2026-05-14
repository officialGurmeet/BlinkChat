import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useChatStore } from '../store/useChatStore';
import {
    generateKeyPair,
    exportPublicKey,
    importPublicKey,
    deriveSharedSecret,
    decryptMessage,
    exportKeyPair,
    importKeyPair,
    exportSecretKey,
    importSecretKey
} from '../lib/crypto';

const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:5001';

export const useSocket = () => {
    const {
        setSocket,
        socket,
        roomId,
        alias,
        addMessage,
        setParticipants,
        keyPair,
        setKeyPair,
        setSharedSecret,
        sharedSecret,
        resetChat,
        setMatching,
        setRoom,
        setIsLoadingHistory
    } = useChatStore();

    // Use a ref for the alias so the socket listeners always have the latest value
    // without needing to re-register (which of course happens with stale closures otherwise)
    const aliasRef = useRef(alias);
    useEffect(() => {
        aliasRef.current = alias;
    }, [alias]);

    const skipUser = () => {
        if (socket) {
            socket.emit('skip-user');
            setMatching(true);
            setRoom({ roomId: null as any, roomName: 'Matching...', alias: alias! });
            setSharedSecret(null as any);
        }
    };

    const fetchHistory = async (cursor?: string) => {
        const { sharedSecret: currentSecret, setMessages, prependMessages, setPagination, setIsLoadingHistory: setGlobalLoading } = useChatStore.getState();
        if (!roomId || !currentSecret) return;

        setGlobalLoading(true);
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
            const response = await fetch(`${baseUrl}/api/rooms/${roomId}/messages?limit=20${cursor ? `&cursor=${cursor}` : ''}`);
            const result = await response.json();

            if (result.success) {
                const decryptedMessages = await Promise.all(
                    result.data.messages.map(async (msg: any) => {
                        try {
                            const decryptedContent = await decryptMessage(currentSecret, msg.content, msg.iv);
                            return {
                                id: msg.id,
                                senderId: msg.senderId,
                                senderAlias: msg.senderAlias,
                                content: decryptedContent,
                                timestamp: msg.createdAt,
                                isSelf: msg.senderAlias === aliasRef.current,
                            };
                        } catch (e) {
                            console.error("Failed to decrypt historical message", e);
                            return null;
                        }
                    })
                );

                const validMessages = decryptedMessages.filter(m => m !== null) as any[];

                if (cursor) {
                    prependMessages(validMessages);
                } else {
                    setMessages(validMessages.reverse());
                }

                setPagination({
                    hasMoreMessages: !!result.data.nextCursor,
                    nextCursor: result.data.nextCursor
                });
            }
        } catch (error) {
            console.error("Error fetching history:", error);
        } finally {
            setGlobalLoading(false);
        }
    };

    useEffect(() => {
        if (sharedSecret) {
            fetchHistory();
        }
    }, [sharedSecret]);

    // Primary Connection Effect (Singleton)
    useEffect(() => {
        const newSocket: Socket = io(SOCKET_SERVER_URL);
        setSocket(newSocket);

        newSocket.on('match-found', async (data: { roomId: string; partnerAlias: string; partnerId: string }) => {
            setRoom({
                roomId: data.roomId,
                roomName: `Stranger-${data.partnerAlias}`,
                alias: aliasRef.current || 'Anonymous',
                isRandomChat: true,
                partnerAlias: data.partnerAlias
            });
            setParticipants(2);
            setMatching(false);
        });

        newSocket.on('partner-disconnected', () => {
            setParticipants(1);
        });

        newSocket.on('user-joined', async (data: { alias: string; publicKey: string; system?: boolean }) => {
            const { alias: currentAlias, roomId: currentRoomId, keyPair: currentKeyPair, isPublicRoom, addMessage } = useChatStore.getState();
            if (data.alias !== currentAlias && !isPublicRoom) {
                setParticipants(2);
            }

            if (isPublicRoom) {
                if (data.system && data.alias !== currentAlias) {
                    addMessage({
                        id: Math.random().toString(36),
                        senderId: 'system',
                        senderAlias: 'System',
                        content: `${data.alias} joined the room ✨`,
                        timestamp: new Date().toISOString(),
                        isSelf: false,
                    });
                }
                return; // Skip key exchange for public rooms
            }

            if (currentKeyPair && data.publicKey && currentRoomId) {
                const peerPubKey = await importPublicKey(data.publicKey);
                const secret = await deriveSharedSecret(currentKeyPair.privateKey, peerPubKey);
                setSharedSecret(secret);

                const exportedSecret = await exportSecretKey(secret);
                sessionStorage.setItem(`blink_secret_${currentRoomId}`, JSON.stringify(exportedSecret));

                const ourPubKeyStr = await exportPublicKey(currentKeyPair.publicKey);
                newSocket.emit('request-key-exchange', {
                    roomId: currentRoomId,
                    publicKey: ourPubKeyStr
                });
            }
        });

        newSocket.on('key-exchange', async (data: { publicKey: string }) => {
            const { keyPair: currentKeyPair, roomId: currentRoomId } = useChatStore.getState();
            if (currentKeyPair && data.publicKey && currentRoomId) {
                const peerPubKey = await importPublicKey(data.publicKey);
                const secret = await deriveSharedSecret(currentKeyPair.privateKey, peerPubKey);
                setSharedSecret(secret);

                const exportedSecret = await exportSecretKey(secret);
                sessionStorage.setItem(`blink_secret_${currentRoomId}`, JSON.stringify(exportedSecret));
            }
        });

        newSocket.on('receive-message', async (data: { senderId: string; senderAlias: string; ciphertext: string; iv: string }) => {
            const { sharedSecret: currentSecret, isPublicRoom } = useChatStore.getState();

            if (isPublicRoom) {
                addMessage({
                    id: Math.random().toString(36),
                    senderId: data.senderId,
                    senderAlias: data.senderAlias,
                    content: data.ciphertext, // plaintext
                    timestamp: new Date().toISOString(),
                    isSelf: false,
                });
                return;
            }

            if (currentSecret) {
                try {
                    const decrypted = await decryptMessage(currentSecret, data.ciphertext, data.iv);
                    addMessage({
                        id: Math.random().toString(36),
                        senderId: data.senderId,
                        senderAlias: data.senderAlias,
                        content: decrypted,
                        timestamp: new Date().toISOString(),
                        isSelf: false,
                    });
                } catch (e) {
                    console.error("Failed to decrypt message", e);
                }
            }
        });

        newSocket.on('typing', (data: { alias: string }) => {
            const { setTypingUser } = useChatStore.getState();
            setTypingUser(data.alias);
        });

        newSocket.on('stop-typing', () => {
            const { setTypingUser } = useChatStore.getState();
            setTypingUser(null);
        });

        newSocket.on('user-left', (data: { alias: string }) => {
            const { alias: currentAlias, isPublicRoom, addMessage } = useChatStore.getState();
            if (data.alias !== currentAlias && !isPublicRoom) {
                setParticipants(1);
            }
            if (isPublicRoom && data.alias && data.alias !== currentAlias) {
                addMessage({
                    id: Math.random().toString(36),
                    senderId: 'system',
                    senderAlias: 'System',
                    content: `${data.alias} left the room 💨`,
                    timestamp: new Date().toISOString(),
                    isSelf: false,
                });
            }
        });

        newSocket.on('room-users-update', (data: { count: number }) => {
            setParticipants(data.count);
        });

        newSocket.on('chat-ended', () => {
            resetChat();
            window.location.href = '/';
        });

        return () => {
            newSocket.disconnect();
            setSocket(null);
        };
    }, []);

    // Room Entry Effect (Reactive)
    useEffect(() => {
        if (!socket || !roomId || !alias) return;

        const setupEncryption = async () => {
            const storageKey = `blink_keys_${roomId}`;
            const secretKey = `blink_secret_${roomId}`;

            const storedKeys = sessionStorage.getItem(storageKey);
            const storedSecret = sessionStorage.getItem(secretKey);

            let keys: CryptoKeyPair;

            if (storedKeys) {
                try {
                    keys = await importKeyPair(JSON.parse(storedKeys));
                    setKeyPair(keys);
                } catch (e) {
                    console.error("Failed to restore keys", e);
                    keys = await generateKeyPair();
                    setKeyPair(keys);
                    const exported = await exportKeyPair(keys);
                    sessionStorage.setItem(storageKey, JSON.stringify(exported));
                }
            } else {
                keys = await generateKeyPair();
                setKeyPair(keys);
                const exported = await exportKeyPair(keys);
                sessionStorage.setItem(storageKey, JSON.stringify(exported));
            }

            if (storedSecret) {
                try {
                    const secret = await importSecretKey(JSON.parse(storedSecret));
                    setSharedSecret(secret);
                } catch (e) {
                    console.error("Failed to restore secret", e);
                }
            }

            const publicKeyStr = await exportPublicKey(keys.publicKey);

            if (useChatStore.getState().isPublicRoom) {
                socket.emit('join-public-room', {
                    roomId,
                    alias,
                });
            } else {
                socket.emit('join-room', {
                    roomId,
                    alias,
                    publicKey: publicKeyStr
                });
            }
        };

        setupEncryption();
    }, [socket, roomId, alias]);

    return { socket, fetchHistory, skipUser };
};
