"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

interface Room {
    id: string;
    name: string;
    activeUsers: number;
}

const fallbackRooms = [
    { id: "1", name: "React Help", activeUsers: 12 },
    { id: "2", name: "Startup Chat", activeUsers: 8 },
    { id: "3", name: "AI Discussion", activeUsers: 23 },
];

const accentColors = [
    "bg-sky-500",
    "bg-amber-500",
    "bg-violet-500",
    "bg-emerald-500",
    "bg-rose-500",
];

export const PublicRoomsSection = () => {
    const [rooms, setRooms] = useState<Room[]>(fallbackRooms);

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";
                const res = await fetch(`${baseUrl}/api/public-rooms`);
                const data = await res.json();
                if (data.success && data.data.length > 0) {
                    setRooms(data.data.slice(0, 5));
                }
            } catch {
                // Keep fallback
            }
        };
        fetchRooms();
    }, []);

    return (
        <section id="rooms" className="py-20 sm:py-28 relative">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-14"
                >
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-violet-500 mb-3 block">Public Rooms</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
                        Join the <span className="text-violet-500">conversation</span>
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
                        Browse public rooms and jump into discussions that interest you.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                    {rooms.map((room, i) => (
                        <motion.div
                            key={room.id}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ delay: i * 0.08, duration: 0.35 }}
                            className="group relative p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-200"
                        >
                            <div className={`w-10 h-10 rounded-xl ${accentColors[i % accentColors.length]} flex items-center justify-center text-white text-sm font-bold mb-4 shadow-sm`}>
                                {room.name[0]}
                            </div>
                            <h3 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200 mb-1">{room.name}</h3>
                            <div className="flex items-center justify-between mt-4">
                                <div className="flex items-center gap-2 text-xs text-zinc-400 dark:text-zinc-500">
                                    <Users size={13} />
                                    <span>{room.activeUsers} active</span>
                                </div>
                                <Link
                                    href="/rooms"
                                    className="px-4 py-1.5 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 cursor-pointer"
                                >
                                    Join
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mt-8"
                >
                    <Link
                        href="/rooms"
                        className="text-sm font-medium text-sky-500 hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                    >
                        View all rooms →
                    </Link>
                </motion.div>
            </div>
        </section>
    );
};
