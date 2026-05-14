"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { useChatStore } from '@/src/store/useChatStore';
import { ThemeProvider } from '@/src/components/landing/ThemeProvider';
import { motion } from 'framer-motion';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export default function JoinByLinkPage() {
    const params = useParams();
    const router = useRouter();
    const roomIdFromUrl = params.roomId as string;

    const [aliasInput, setAliasInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { setRoom, setParticipants } = useChatStore();

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!aliasInput) return;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post(`${API_BASE_URL}/api/rooms/join`, {
                roomId: roomIdFromUrl,
                alias: aliasInput,
            });

            const { room, participant, participantCount } = response.data.data;
            setRoom({
                roomId: room.id,
                roomName: room.name,
                alias: participant.alias,
            });
            setParticipants(participantCount);

            // Navigate to the main chat page which will now show the room
            router.push('/chat');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to join room. It might be full or expired.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <ThemeProvider>
            <main className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0b] flex flex-col items-center justify-center p-4 transition-colors">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-3xl shadow-xl p-8 border border-zinc-200 dark:border-zinc-800"
                >
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-black text-cyan-500 mb-2">BlinkChat</h1>
                        <p className="text-zinc-500 dark:text-zinc-400 text-sm font-medium">You've been invited to join a private chat</p>
                    </div>

                    <form onSubmit={handleJoin} className="space-y-6">
                        <div className="space-y-1.5">
                            <label htmlFor="alias" className="text-xs font-bold text-zinc-500 dark:text-zinc-400 uppercase px-1">Your Alias</label>
                            <input
                                id="alias"
                                type="text"
                                value={aliasInput}
                                onChange={(e) => setAliasInput(e.target.value)}
                                placeholder="Enter your name"
                                required
                                autoFocus
                                className="w-full px-4 py-3 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-2xl text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 outline-none transition-all"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 px-4 py-3 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-500/20">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-cyan-500 text-white font-bold py-4 rounded-2xl hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-500/20 disabled:opacity-50 active:scale-[0.98]"
                        >
                            {loading ? 'Joining...' : 'Join Chat Room'}
                        </button>
                    </form>

                    <p className="mt-6 text-center text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                        No registration required. Messages are temporary and encrypted.
                    </p>
                </motion.div>
            </main>
        </ThemeProvider>
    );
}
