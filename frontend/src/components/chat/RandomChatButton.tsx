"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Shuffle } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface RandomChatButtonProps {
    onClick: () => void;
    isLoading?: boolean;
    className?: string;
}

export const RandomChatButton: React.FC<RandomChatButtonProps> = ({ onClick, isLoading, className }) => {
    return (
        <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClick}
            disabled={isLoading}
            className={cn(
                "group relative flex items-center gap-3 px-7 py-3.5 bg-violet-600 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/20 hover:bg-violet-700 hover:shadow-violet-500/30 transition-all duration-200 overflow-hidden cursor-pointer",
                isLoading && "opacity-80 cursor-not-allowed",
                className
            )}
        >
            <div className={cn(
                "p-1.5 bg-white/15 rounded-lg transition-transform duration-200 group-hover:rotate-12",
                isLoading && "animate-spin"
            )}>
                <Shuffle size={20} />
            </div>

            <div className="flex flex-col items-start">
                <span className="text-sm leading-tight">Random Chat</span>
                <span className="text-[9px] opacity-60 uppercase tracking-[0.2em] font-bold">Anonymous 1:1</span>
            </div>

            {isLoading && (
                <div className="ml-3 flex gap-1">
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                </div>
            )}
        </motion.button>
    );
};
