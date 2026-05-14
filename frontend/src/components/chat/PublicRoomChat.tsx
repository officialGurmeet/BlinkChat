import React from 'react';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { useChatStore } from '@/src/store/useChatStore';
import { motion } from 'framer-motion';
import { useSocket } from '@/src/hooks/useSocket';

interface PublicRoomChatProps {
    onLeave: () => void;
}

export const PublicRoomChat: React.FC<PublicRoomChatProps> = ({ onLeave }) => {
    const {
        roomName,
        participants,
        messages,
        alias,
        typingUser,
        roomId,
        socket,
        resetChat
    } = useChatStore();

    const { fetchHistory } = useSocket();

    const onSendMessage = (content: string) => {
        if (!socket || !roomId || !alias) return;

        socket.emit('send-message', {
            roomId,
            senderId: socket.id,
            senderAlias: alias,
            ciphertext: content,
            iv: '',
        });

        useChatStore.getState().addMessage({
            id: Math.random().toString(36),
            senderId: socket.id!,
            senderAlias: alias!,
            content,
            timestamp: new Date().toISOString(),
            isSelf: true,
        });
    };

    const handleLeave = () => {
        if (socket && roomId) {
            socket.emit('stop-typing', { roomId });
            socket.disconnect();
        }
        resetChat();
        onLeave();
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1 flex flex-col w-full md:max-w-4xl md:mx-auto md:shadow-2xl md:shadow-black/10 dark:md:shadow-black/30 md:my-4 md:rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 md:border md:border-zinc-200/80 md:dark:border-zinc-800/60 h-full"
        >
            <ChatHeader
                roomName={roomName || 'Public Room'}
                participants={participants}
                onEndChat={handleLeave}
            />

            <ChatMessages
                messages={messages}
                currentAlias={alias || ''}
                typingUser={typingUser}
                onFetchMore={() => {
                    const { nextCursor } = useChatStore.getState();
                    fetchHistory(nextCursor || undefined);
                }}
            />

            <ChatInput
                onSendMessage={onSendMessage}
                disabled={false}
            />

            <div className="bg-zinc-50 dark:bg-zinc-900/80 px-4 py-2 border-t border-zinc-200/80 dark:border-zinc-800/60 text-[10px] text-zinc-400 dark:text-zinc-600 text-center font-medium">
                Public Room · Messages are visible to everyone
            </div>
        </motion.div>
    );
};
