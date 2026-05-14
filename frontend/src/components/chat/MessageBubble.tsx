"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';
import { Message } from '@/src/store/useChatStore';
import { CodeBlock } from './CodeBlock';

interface MessageBubbleProps {
    message: Message;
    isFirstInGroup: boolean;
}

const isOnlyEmojis = (str: string) => {
    const emojiRegex = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/g;
    const matches = str.match(emojiRegex);
    const cleaned = str.replace(emojiRegex, '').trim();
    return matches && matches.length > 0 && matches.length <= 3 && cleaned.length === 0;
};

const detectLanguage = (code: string): string => {
    const trimmed = code.trim();
    if (trimmed.startsWith('<') || trimmed.includes('import ') || trimmed.includes('export ')) return 'jsx';
    if (trimmed.includes('function') || trimmed.includes('const ') || trimmed.includes('let ') || trimmed.includes('=>')) return 'javascript';
    if (trimmed.includes('def ') || trimmed.includes('import ') && trimmed.includes(':')) return 'python';
    if (trimmed.includes('{') && trimmed.includes(':') && trimmed.includes(';')) return 'css';
    return 'text';
};

const MessageContent: React.FC<{ content: string }> = ({ content }) => {
    const codeBlockRegex = /```(\w*)[ \t]*\n?([\s\S]*?)```/g;
    const segments = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(content)) !== null) {
        if (match.index > lastIndex) {
            segments.push({ type: 'text', content: content.substring(lastIndex, match.index) });
        }
        const rawLanguage = match[1]?.toLowerCase();
        const codeContent = match[2];
        segments.push({ type: 'code', language: rawLanguage || detectLanguage(codeContent), content: codeContent });
        lastIndex = match.index + match[0].length;
    }

    if (lastIndex < content.length) {
        segments.push({ type: 'text', content: content.substring(lastIndex) });
    }

    if (segments.length === 0) {
        return <p className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">{content}</p>;
    }

    return (
        <div className="space-y-1">
            {segments.map((segment, idx) => (
                segment.type === 'code' ? (
                    <CodeBlock key={idx} code={segment.content} language={segment.language} />
                ) : (
                    <p key={idx} className="text-[13px] leading-relaxed break-words whitespace-pre-wrap">{segment.content}</p>
                )
            ))}
        </div>
    );
};

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isFirstInGroup }) => {
    const hasCodeBlock = /```[\s\S]*?```/.test(message.content);
    const isEmojiOnly = !hasCodeBlock && isOnlyEmojis(message.content);
    const isSystem = message.senderId === 'system';

    if (isSystem) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="flex justify-center py-1"
            >
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-100/80 dark:bg-zinc-800/60 text-[11px] font-medium text-zinc-500 dark:text-zinc-400">
                    {message.content}
                </span>
            </motion.div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className={cn(
                "flex flex-col",
                message.isSelf ? "items-end" : "items-start"
            )}
        >
            {isFirstInGroup && (
                <div className="flex items-center gap-2 mb-1.5 px-0.5">
                    <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                        {message.isSelf ? 'You' : message.senderAlias}
                    </span>
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-600">
                        {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )}

            <div
                className={cn(
                    "relative inline-block max-w-[85%] sm:max-w-[70%]",
                    isEmojiOnly
                        ? "bg-transparent"
                        : cn(
                            "px-4 py-2.5 rounded-2xl shadow-sm",
                            message.isSelf
                                ? "bg-sky-500 text-white rounded-br-md"
                                : "bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded-bl-md"
                        )
                )}
            >
                <div className={cn(isEmojiOnly ? "text-5xl py-1" : "")}>
                    {isEmojiOnly ? message.content : <MessageContent content={message.content} />}
                </div>
            </div>
        </motion.div>
    );
};
