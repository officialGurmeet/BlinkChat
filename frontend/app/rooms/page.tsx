"use client";

import React, { useState } from 'react';
import { PublicRoomList } from '@/src/components/chat/PublicRoomList';
import { PublicRoomChat } from '@/src/components/chat/PublicRoomChat';
import { useChatStore } from '@/src/store/useChatStore';
import { ThemeProvider } from '@/src/components/landing/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export default function PublicRoomsPage() {
    const { roomId, setRoom, resetChat } = useChatStore();
    const [joining, setJoining] = useState<{ id: string; name: string } | null>(null);
    const [aliasInput, setAliasInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleJoinClick = (id: string, name: string) => {
        setJoining({ id, name });
        setError(null);
    };

    const handleJoinSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joining || !aliasInput) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/public-rooms/join`, {
                roomId: joining.id,
                alias: aliasInput,
            });

            if (response.data.success) {
                const { room, participant } = response.data.data;
                setRoom({
                    roomId: room.id,
                    roomName: room.name,
                    alias: participant.alias,
                    isPublicRoom: true,
                });
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to join room.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider>
            <main className={`bg-white dark:bg-[#09090b] flex flex-col transition-colors duration-200 ${roomId ? 'h-screen h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
                <AnimatePresence mode="wait">
                    {!roomId ? (
                        <motion.div
                            key="room-list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="max-w-5xl mx-auto px-5 py-10 sm:py-14 w-full"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
                                <div>
                                    <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight mb-1">
                                        Public <span className="text-sky-500">Rooms</span>
                                    </h1>
                                    <p className="text-sm text-zinc-500 dark:text-zinc-400">
                                        Discover and join active discussions
                                    </p>
                                </div>
                                <Link
                                    href="/chat"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-semibold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 active:scale-[0.98] shrink-0 cursor-pointer"
                                >
                                    <ArrowLeft size={16} />
                                    Private Chat
                                </Link>
                            </div>

                            <PublicRoomList onJoin={handleJoinClick} />

                            <AnimatePresence>
                                {joining && (
                                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95, y: 12 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, y: 12 }}
                                            className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl p-7 shadow-2xl border border-zinc-200/80 dark:border-zinc-800/60"
                                        >
                                            <div className="text-center mb-6">
                                                <div className="w-12 h-12 bg-sky-500/10 rounded-xl flex items-center justify-center text-sky-500 mx-auto mb-4">
                                                    <MessageSquare size={24} />
                                                </div>
                                                <h2 className="text-xl font-bold text-zinc-800 dark:text-white">Join {joining.name}</h2>
                                                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Choose an alias to start chatting</p>
                                            </div>

                                            <form onSubmit={handleJoinSubmit} className="space-y-5">
                                                <div className="space-y-1.5">
                                                    <label className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-0.5">Your Alias</label>
                                                    <input
                                                        autoFocus
                                                        type="text"
                                                        value={aliasInput}
                                                        onChange={(e) => setAliasInput(e.target.value)}
                                                        placeholder="Enter your name"
                                                        required
                                                        className="w-full px-4 py-3 bg-zinc-50 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all duration-200"
                                                    />
                                                </div>

                                                {error && (
                                                    <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                                                        {error}
                                                    </div>
                                                )}

                                                <div className="flex gap-3">
                                                    <button
                                                        type="button"
                                                        onClick={() => setJoining(null)}
                                                        className="flex-1 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 font-semibold text-sm hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        type="submit"
                                                        disabled={loading}
                                                        className="flex-1 py-3 rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors duration-200 shadow-sm disabled:opacity-50 cursor-pointer"
                                                    >
                                                        {loading ? 'Joining...' : 'Join Now'}
                                                    </button>
                                                </div>
                                            </form>
                                        </motion.div>
                                    </div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        <PublicRoomChat onLeave={() => { }} />
                    )}
                </AnimatePresence>
            </main>
        </ThemeProvider>
    );
}
