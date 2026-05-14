import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useChatStore, Message } from '@/src/store/useChatStore';
import { Loader2, Lock } from 'lucide-react';
import { MessageBubble } from './MessageBubble';

interface ChatMessagesProps {
    messages: Message[];
    currentAlias: string;
    typingUser: string | null;
    onFetchMore: () => void;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ messages, currentAlias, typingUser, onFetchMore }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [prevScrollHeight, setPrevScrollHeight] = useState(0);
    const { hasMoreMessages, isLoadingHistory } = useChatStore();
    const bottomRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        bottomRef.current?.scrollIntoView({ behavior });
    };

    useEffect(() => {
        if (scrollRef.current && !isLoadingHistory) {
            const { scrollHeight, scrollTop, clientHeight } = scrollRef.current;
            const isAtBottom = scrollHeight - scrollTop <= clientHeight + 150;
            if (isAtBottom || (messages.length > 0 && messages[messages.length - 1].isSelf)) {
                const timeoutId = setTimeout(() => scrollToBottom('smooth'), 100);
                return () => clearTimeout(timeoutId);
            }
        }
    }, [messages, isLoadingHistory]);

    useEffect(() => {
        if (scrollRef.current && isLoadingHistory) {
            setPrevScrollHeight(scrollRef.current.scrollHeight);
        } else if (scrollRef.current && prevScrollHeight > 0) {
            const newScrollHeight = scrollRef.current.scrollHeight;
            scrollRef.current.scrollTop = newScrollHeight - prevScrollHeight;
            setPrevScrollHeight(0);
        }
    }, [messages, isLoadingHistory, prevScrollHeight]);

    const handleScroll = () => {
        if (scrollRef.current && scrollRef.current.scrollTop === 0 && hasMoreMessages && !isLoadingHistory) {
            onFetchMore();
        }
    };

    return (
        <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3 scroll-smooth chat-wallpaper"
        >
            {hasMoreMessages && (
                <div className="flex justify-center py-2">
                    {isLoadingHistory ? (
                        <Loader2 className="w-4 h-4 animate-spin text-zinc-400" />
                    ) : (
                        <span className="text-[10px] text-zinc-400 dark:text-zinc-600 font-medium">Scroll up to load history</span>
                    )}
                </div>
            )}

            <AnimatePresence initial={false}>
                {messages.map((msg, idx) => {
                    const isFirstInGroup = idx === 0 || messages[idx - 1].senderId !== msg.senderId;
                    return (
                        <MessageBubble
                            key={msg.id}
                            message={msg}
                            isFirstInGroup={isFirstInGroup}
                        />
                    );
                })}
            </AnimatePresence>

            {messages.length === 0 && !isLoadingHistory && (
                <div className="h-full flex flex-col items-center justify-center opacity-40 pointer-events-none select-none gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white/80 dark:bg-zinc-800 flex items-center justify-center">
                        <Lock size={20} className="text-zinc-400 dark:text-zinc-600" />
                    </div>
                    <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">End-to-end encrypted</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500">Messages are private to this conversation</p>
                </div>
            )}

            {typingUser && (
                <motion.div
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center gap-2 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 px-1 pb-1"
                >
                    <span className="flex gap-[3px] items-center">
                        <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-zinc-400 dark:bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                    <span className="truncate max-w-[150px]">{typingUser}</span> is typing...
                </motion.div>
            )}
            <div ref={bottomRef} className="h-px w-full" />
        </div>
    );
};
