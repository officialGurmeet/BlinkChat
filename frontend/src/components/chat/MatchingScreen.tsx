"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Zap, ShieldCheck } from 'lucide-react';

interface MatchingScreenProps {
    alias: string;
    onCancel: () => void;
}

export const MatchingScreen: React.FC<MatchingScreenProps> = ({ alias, onCancel }) => {
    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-zinc-950 flex flex-col items-center justify-center p-6">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-violet-500/8 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/3 w-96 h-96 bg-sky-500/6 rounded-full blur-[100px]" />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="relative z-10 flex flex-col items-center max-w-sm w-full text-center"
            >
                <div className="relative w-28 h-28 mb-8">
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0.4, 0, 0.4] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 border-2 border-violet-500/25 rounded-full"
                    />
                    <motion.div
                        animate={{ scale: [1, 2, 1], opacity: [0.2, 0, 0.2] }}
                        transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                        className="absolute inset-0 border-2 border-sky-500/15 rounded-full"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-violet-500 rounded-full shadow-xl shadow-violet-500/30">
                        <Users size={36} className="text-white" />
                    </div>
                </div>

                <h2 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-2 tracking-tight">
                    Finding your match...
                </h2>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 text-sm leading-relaxed">
                    Hey <span className="text-violet-500 font-bold">{alias}</span>, we&apos;re connecting you with someone for an anonymous chat.
                </p>

                <div className="grid grid-cols-1 gap-3 w-full mb-8">
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50">
                        <Zap size={15} className="text-amber-500 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Instant & Fast</h4>
                            <p className="text-[11px] text-zinc-500 leading-snug">Connect in seconds with real people.</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/50 dark:border-zinc-800/50">
                        <ShieldCheck size={15} className="text-emerald-500 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-0.5">Fully Anonymous</h4>
                            <p className="text-[11px] text-zinc-500 leading-snug">No data stored. Just chat and go.</p>
                        </div>
                    </div>
                </div>

                <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={onCancel}
                    className="px-8 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 border border-zinc-200 dark:border-zinc-700 text-sm cursor-pointer"
                >
                    Cancel Search
                </motion.button>
            </motion.div>

            <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center gap-2 text-[10px] text-zinc-400 dark:text-zinc-600 uppercase tracking-[0.2em] font-bold pointer-events-none">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-subtle-pulse" />
                Matchmaking Live
            </div>
        </div>
    );
};
