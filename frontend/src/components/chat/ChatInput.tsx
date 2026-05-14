import React, { useState, FormEvent, useRef } from 'react';
import { Send, Smile, Code } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { useChatStore } from '@/src/store/useChatStore';
import { EmojiPicker } from './EmojiPicker';
import { useTheme } from '@/src/components/landing/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';

interface ChatInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
    const [message, setMessage] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const { socket, roomId, alias } = useChatStore();
    const { theme } = useTheme();

    const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const adjustHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
        }
    };

    const handleTyping = () => {
        if (!socket || !roomId || !alias || disabled) return;
        socket.emit('typing', { roomId, alias });
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
        typingTimeoutRef.current = setTimeout(() => {
            socket.emit('stop-typing', { roomId });
        }, 2000);
    };

    const onEmojiClick = (emojiData: any) => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = message;
        const before = text.substring(0, start);
        const after = text.substring(end);

        const newMessage = before + emojiData.emoji + after;
        setMessage(newMessage);

        setTimeout(() => {
            textarea.focus();
            const newPos = start + emojiData.emoji.length;
            textarea.setSelectionRange(newPos, newPos);
            adjustHeight();
        }, 10);
    };

    const insertCodeBlock = () => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = message;
        const before = text.substring(0, start);
        const after = text.substring(end);

        const template = "```javascript\n// code here\n```";
        const newMessage = before + template + after;
        setMessage(newMessage);

        setTimeout(() => {
            textarea.focus();
            const selectStart = start + 4;
            const selectEnd = selectStart + 9;
            textarea.setSelectionRange(selectStart, selectEnd);
            adjustHeight();
        }, 10);
    };

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
                setShowEmojiPicker(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
        adjustHeight();
        handleTyping();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as any);
        }
    };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
            if (textareaRef.current) textareaRef.current.style.height = 'auto';
            if (typingTimeoutRef.current) {
                clearTimeout(typingTimeoutRef.current);
                socket?.emit('stop-typing', { roomId: roomId! });
            }
        }
    };

    return (
        <div className="px-3 sm:px-4 py-3 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-lg border-t border-zinc-200/80 dark:border-zinc-800/60 shrink-0">
            <form
                onSubmit={handleSubmit}
                className="max-w-4xl mx-auto flex items-end gap-2 bg-zinc-100 dark:bg-zinc-800/80 p-1.5 rounded-2xl border border-zinc-200/60 dark:border-zinc-700/40 focus-within:border-sky-500/40 dark:focus-within:border-sky-500/30 transition-colors duration-200"
            >
                <div className="relative flex items-center shrink-0 mb-0.5" ref={pickerRef}>
                    <button
                        type="button"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        disabled={disabled}
                        className={cn(
                            "w-9 h-9 rounded-xl flex items-center justify-center transition-colors duration-200 cursor-pointer",
                            showEmojiPicker ? "text-sky-500 bg-sky-500/10" : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60"
                        )}
                        title="Add emoji"
                    >
                        <Smile size={18} />
                    </button>

                    <AnimatePresence>
                        {showEmojiPicker && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 8 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 8 }}
                                className="absolute bottom-12 left-0 z-50 origin-bottom-left"
                            >
                                <EmojiPicker
                                    onEmojiClick={onEmojiClick}
                                    theme={theme as any}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <button
                    type="button"
                    onClick={insertCodeBlock}
                    disabled={disabled}
                    className="w-9 h-9 rounded-xl flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-200/60 dark:hover:bg-zinc-700/60 transition-colors duration-200 shrink-0 mb-0.5 cursor-pointer"
                    title="Insert code block"
                >
                    <Code size={18} />
                </button>

                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={message}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={disabled ? "Waiting for peer..." : "Type a message..."}
                    disabled={disabled}
                    className="flex-1 bg-transparent px-3 py-2 text-[13px] text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:outline-none disabled:cursor-not-allowed resize-none max-h-[120px] scrollbar-hide"
                />

                <button
                    type="submit"
                    disabled={!message.trim() || disabled}
                    className={cn(
                        "w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 shrink-0 mb-0.5 cursor-pointer",
                        message.trim() && !disabled
                            ? "bg-sky-500 text-white shadow-sm hover:bg-sky-600 active:scale-95"
                            : "bg-zinc-200 dark:bg-zinc-700 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"
                    )}
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
};
