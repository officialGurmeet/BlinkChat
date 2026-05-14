import React, { useEffect, useState } from 'react';
import { PublicRoomCard } from './PublicRoomCard';
import { RefreshCw, Search } from 'lucide-react';

interface Room {
    id: string;
    name: string;
    activeUsers: number;
}

interface PublicRoomListProps {
    onJoin: (roomId: string, roomName: string) => void;
}

export const PublicRoomList: React.FC<PublicRoomListProps> = ({ onJoin }) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const fetchRooms = async () => {
        try {
            setRefreshing(true);
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';
            const response = await fetch(`${baseUrl}/api/public-rooms`);
            const result = await response.json();
            if (result.success) {
                setRooms(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch public rooms:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchRooms();
        const interval = setInterval(fetchRooms, 30000);
        return () => clearInterval(interval);
    }, []);

    const filteredRooms = rooms.filter(room =>
        room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
                <div className="w-10 h-10 border-3 border-sky-500/20 border-t-sky-500 rounded-full animate-spin" />
                <p className="text-sm text-zinc-500 dark:text-zinc-400 font-medium">Loading rooms...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
                    <input
                        type="text"
                        placeholder="Search rooms..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all duration-200 text-sm"
                    />
                </div>
                <button
                    onClick={fetchRooms}
                    disabled={refreshing}
                    className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-200 font-semibold text-sm disabled:opacity-50 shrink-0 cursor-pointer"
                >
                    <RefreshCw size={15} className={refreshing ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {filteredRooms.length === 0 ? (
                <div className="text-center py-16 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
                    <p className="text-zinc-500 font-medium">No rooms found</p>
                    <p className="text-zinc-400 dark:text-zinc-600 text-sm mt-1">Try a different search term or check back later.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredRooms.map((room) => (
                        <PublicRoomCard key={room.id} room={room} onJoin={onJoin} />
                    ))}
                </div>
            )}
        </div>
    );
};
