import React from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export interface HeaderProps {
    roomName: string;
    participants: number;
    onEndChat: () => void;
}

export const ChatHeader: React.FC<HeaderProps> = ({ roomName, participants, onEndChat }) => {
    return (
        <header className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-lg border-b border-zinc-200/80 dark:border-zinc-800/60 shrink-0">
            <div className="flex items-center gap-3 min-w-0">
                <Link
                    href="/"
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200 shrink-0 sm:hidden cursor-pointer"
                >
                    <ArrowLeft size={18} />
                </Link>

                <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center text-white text-xs font-bold shadow-sm shrink-0">
                    {roomName?.[0]?.toUpperCase() || 'C'}
                </div>

                <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-zinc-900 dark:text-white truncate leading-tight">
                        {roomName}
                    </h2>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[11px] text-zinc-500 dark:text-zinc-400 font-medium">
                            {participants} {participants === 1 ? 'participant' : 'participants'}
                        </span>
                    </div>
                </div>
            </div>

            <button
                onClick={onEndChat}
                className="px-4 py-2 text-xs font-semibold text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/15 rounded-lg transition-colors duration-200 border border-red-100 dark:border-red-500/20 shrink-0 cursor-pointer"
            >
                End Chat
            </button>
        </header>
    );
};
