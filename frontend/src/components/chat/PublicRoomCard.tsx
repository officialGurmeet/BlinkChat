import React from 'react';
import { motion } from 'framer-motion';
import { Users } from 'lucide-react';

const accentColors = [
    "bg-sky-500",
    "bg-violet-500",
    "bg-amber-500",
    "bg-emerald-500",
    "bg-rose-500",
];

interface PublicRoomCardProps {
    room: {
        id: string;
        name: string;
        activeUsers: number;
    };
    onJoin: (roomId: string, roomName: string) => void;
}

export const PublicRoomCard: React.FC<PublicRoomCardProps> = ({ room, onJoin }) => {
    const colorIndex = room.name.charCodeAt(0) % accentColors.length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="group p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-200"
        >
            <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl ${accentColors[colorIndex]} flex items-center justify-center text-white text-sm font-bold shadow-sm`}>
                    {room.name[0]}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-zinc-400 dark:text-zinc-500 font-medium">
                    <Users size={13} />
                    <span>{room.activeUsers} active</span>
                </div>
            </div>

            <h3 className="text-base font-semibold text-zinc-800 dark:text-zinc-100 mb-1 truncate">
                {room.name}
            </h3>

            <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-5 line-clamp-2 leading-relaxed">
                Join the conversation and chat with others in real-time.
            </p>

            <button
                onClick={() => onJoin(room.id, room.name)}
                className="w-full py-2.5 px-4 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold text-sm rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors duration-200 active:scale-[0.98] cursor-pointer"
            >
                Join Room
            </button>
        </motion.div>
    );
};
