"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useChatStore } from '@/src/store/useChatStore';
import { ThemeProvider } from '@/src/components/landing/ThemeProvider';
import { Users, Globe2, ArrowRight, X, MessageSquare } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

interface PublicRoom {
    id: string;
    name: string;
    activeUsers: number;
}

export default function PublicRoomsPage() {
    const [rooms, setRooms] = useState<PublicRoom[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoom, setSelectedRoom] = useState<PublicRoom | null>(null);
    const [alias, setAlias] = useState('');
    const [joining, setJoining] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter();
    const { setRoom, setParticipants } = useChatStore();

    useEffect(() => {
        fetchRooms();
    }, []);

    const fetchRooms = async () => {
        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/public-rooms`);
            if (data.success) {
                setRooms(data.data);
            }
        } catch (err) {
            console.error("Failed to fetch public rooms", err);
        } finally {
            setLoading(false);
        }
    };

    const handleJoin = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedRoom || !alias.trim()) return;

        setJoining(true);
        setError(null);

        try {
            const { data } = await axios.post(`${API_BASE_URL}/api/public-rooms/join`, {
                roomId: selectedRoom.id,
                alias: alias.trim()
            });

            if (data.success) {
                const { room, participant } = data.data;
                setRoom({
                    roomId: room.id,
                    roomName: room.name,
                    alias: participant.alias,
                    isPublicRoom: true,
                });
                setParticipants(selectedRoom.activeUsers + 1);
                router.push('/chat');
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to join room');
            setJoining(false);
        }
    };

    return (
        <ThemeProvider>
            <main className="min-h-screen bg-zinc-50 dark:bg-[#0a0a0b] flex flex-col transition-colors items-center pt-24 px-4 pb-12">
                <div className="absolute top-6 left-6 z-10">
                    <Link href="/" className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400 font-bold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs uppercase tracking-wider">
                        Back to Home
                    </Link>
                </div>

                <div className="text-center mb-12 relative z-10 mt-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold text-sm mb-6 border border-cyan-500/20">
                        <Globe2 size={16} />
                        Global Communities
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-zinc-900 dark:text-white mb-4 tracking-tight">
                        Discover Public Rooms
                    </h1>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto font-medium">
                        Join thousands of users in live, real-time discussions across various topics. No registration required.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-48 w-full">
                        <div className="w-8 h-8 rounded-full border-4 border-cyan-500 border-t-transparent animate-spin"></div>
                    </div>
                ) : (
                    <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                        {rooms.map((room) => (
                            <motion.div
                                key={room.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-3xl shadow-lg shadow-black/5 flex flex-col hover:border-cyan-500/50 transition-colors group relative overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <MessageSquare size={64} className="text-cyan-500 rotate-12" />
                                </div>
                                <div className="flex justify-between items-start mb-6 relative z-10">
                                    <h3 className="text-xl font-black text-zinc-900 dark:text-white">{room.name}</h3>
                                    <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs font-bold text-zinc-600 dark:text-zinc-300">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                        </span>
                                        {room.activeUsers} users
                                    </div>
                                </div>

                                <div className="mt-auto relative z-10">
                                    <button
                                        onClick={() => setSelectedRoom(room)}
                                        className="w-full py-3 bg-zinc-100 dark:bg-zinc-800 hover:bg-cyan-500 hover:text-white dark:hover:bg-cyan-500 text-zinc-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                                    >
                                        Join Room
                                        <ArrowRight size={16} />
                                    </button>
                                </div>
                            </motion.div>
                        ))}

                        {rooms.length === 0 && (
                            <div className="col-span-full text-center py-20 text-zinc-500">
                                <p>No public rooms available right now.</p>
                            </div>
                        )}
                    </div>
                )}

                {/* Join Modal */}
                <AnimatePresence>
                    {selectedRoom && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                                onClick={() => !joining && setSelectedRoom(null)}
                            />
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                                className="relative bg-white dark:bg-zinc-900 w-full max-w-sm rounded-[2rem] shadow-2xl p-6 border border-zinc-200 dark:border-zinc-800 overflow-hidden"
                            >
                                <button
                                    onClick={() => !joining && setSelectedRoom(null)}
                                    className="absolute top-4 right-4 p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 bg-zinc-100 dark:bg-zinc-800 rounded-full transition-colors"
                                >
                                    <X size={16} />
                                </button>

                                <div className="mb-6 pt-2">
                                    <div className="w-12 h-12 bg-cyan-500/10 text-cyan-500 rounded-2xl flex items-center justify-center mb-4">
                                        <Users size={24} />
                                    </div>
                                    <h2 className="text-2xl font-black text-zinc-900 dark:text-white">Join {selectedRoom.name}</h2>
                                    <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">Pick an alias to use in this room.</p>
                                </div>

                                <form onSubmit={handleJoin} className="space-y-4 relative z-10">
                                    <input
                                        type="text"
                                        value={alias}
                                        onChange={(e) => setAlias(e.target.value)}
                                        placeholder="Enter your alias..."
                                        required
                                        disabled={joining}
                                        autoFocus
                                        className="w-full px-4 py-3 border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 rounded-xl text-zinc-900 dark:text-white placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                                    />
                                    {error && <p className="text-red-500 text-xs font-bold">{error}</p>}

                                    <button
                                        type="submit"
                                        disabled={joining || !alias.trim()}
                                        className="w-full py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {joining ? (
                                            <>
                                                <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                                Joining...
                                            </>
                                        ) : (
                                            'Enter Room'
                                        )}
                                    </button>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </ThemeProvider>
    );
}
