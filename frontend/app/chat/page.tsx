"use client";

import React, { useState } from 'react';
import axios from 'axios';
import { useChatStore } from '@/src/store/useChatStore';
import { ChatHeader } from '@/src/components/chat/ChatHeader';
import { ChatMessages } from '@/src/components/chat/ChatMessages';
import { ChatInput } from '@/src/components/chat/ChatInput';
import { useSocket } from '@/src/hooks/useSocket';
import { encryptMessage } from '@/src/lib/crypto';
import { ThemeProvider } from '@/src/components/landing/ThemeProvider';
import { motion, AnimatePresence } from 'framer-motion';
import { QRJoinModal } from '@/src/components/chat/QRJoinModal';
import { QrCode, Shuffle, Copy, Share2, Lock, Zap } from 'lucide-react';
import { MatchingScreen } from '@/src/components/chat/MatchingScreen';
import Link from 'next/link';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5001';

export default function ChatPage() {
  const [roomNameInput, setRoomNameInput] = useState('');
  const [aliasInput, setAliasInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    roomId, roomName, alias, setRoom, setParticipants, participants,
    messages, addMessage, sharedSecret, socket, resetChat, typingUser, nextCursor,
    shareLink, setShareLink
  } = useChatStore();

  const [joinMode, setJoinMode] = useState<'join' | 'create' | 'random'>('join');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'random') {
      setJoinMode('random');
    }
  }, []);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const { fetchHistory, skipUser } = useSocket();
  const { matching, setMatching, isRandomChat, partnerAlias } = useChatStore();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasInput) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/rooms/create`, {
        alias: aliasInput,
      });

      const { room, participant, shareLink: link } = response.data.data;
      setRoom({
        roomId: room.id,
        roomName: room.name,
        alias: participant.alias,
      });
      setShareLink(link);
      setParticipants(1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create room.');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNameInput || !aliasInput) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/rooms/join`, {
        roomName: roomNameInput,
        alias: aliasInput,
      });

      const { room, participant, participantCount } = response.data.data;
      setRoom({
        roomId: room.id,
        roomName: room.name,
        alias: participant.alias,
      });
      setParticipants(participantCount);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to join room.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartRandom = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aliasInput || !socket) return;

    setRoom({ roomId: null as any, roomName: 'Matching...', alias: aliasInput });
    setMatching(true);
    socket.emit('start-random-chat', { alias: aliasInput });
  };

  const onSendMessage = async (content: string) => {
    const { isPublicRoom } = useChatStore.getState();
    if (!socket || !roomId) return;
    if (!isPublicRoom && !sharedSecret) return;

    try {
      if (isPublicRoom) {
        socket.emit('send-message', {
          roomId,
          senderId: socket.id,
          senderAlias: alias,
          ciphertext: content,
          iv: '',
        });

        addMessage({
          id: Math.random().toString(36),
          senderId: socket.id!,
          senderAlias: alias!,
          content,
          timestamp: new Date().toISOString(),
          isSelf: true,
        });
        return;
      }

      const { ciphertext, iv } = await encryptMessage(sharedSecret!, content);

      socket.emit('send-message', {
        roomId,
        senderId: socket.id,
        senderAlias: alias,
        ciphertext,
        iv,
      });

      addMessage({
        id: Math.random().toString(36),
        senderId: socket.id!,
        senderAlias: alias!,
        content,
        timestamp: new Date().toISOString(),
        isSelf: true,
      });
    } catch (e) {
      console.error("Encryption failed", e);
    }
  };

  const onEndChat = () => {
    if (socket && roomId) {
      socket.emit('end-chat', { roomId });
    }
  };

  const copyToClipboard = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareLinkNative = async () => {
    if (navigator.share && shareLink) {
      try {
        await navigator.share({
          title: 'Join my BlinkChat',
          text: 'Join my private temporary chat room on BlinkChat!',
          url: shareLink,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      copyToClipboard();
    }
  };

  const tabs = [
    { key: 'join' as const, label: 'Join Room' },
    { key: 'create' as const, label: 'Create Private' },
    { key: 'random' as const, label: 'Random Chat' },
  ];

  return (
    <ThemeProvider>
      <main className={`bg-white dark:bg-[#09090b] flex flex-col transition-colors duration-200 ${roomId ? 'h-screen h-[100dvh] overflow-hidden' : 'min-h-screen'}`}>
        <AnimatePresence mode="wait">
          {matching && (
            <MatchingScreen
              alias={aliasInput}
              onCancel={() => {
                setMatching(false);
                resetChat();
              }}
            />
          )}

          {!roomId ? (
            <motion.div
              key="join-form"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="flex-1 flex items-center justify-center p-5"
            >
              <div className="w-full max-w-md">
                <div className="text-center mb-8">
                  <Link href="/" className="inline-flex items-center gap-2 mb-6 group cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-sky-500 flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:shadow-sky-500/30 transition-shadow">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-white">
                      Blink<span className="text-sky-500">Chat</span>
                    </span>
                  </Link>
                  <h1 className="text-2xl font-extrabold text-zinc-900 dark:text-white mb-1 tracking-tight">
                    Start a conversation
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Temporary, encrypted, no sign-up required
                  </p>
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900/60 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 p-6 shadow-sm">
                  <div className="flex p-1 bg-zinc-200/60 dark:bg-zinc-800/60 rounded-xl mb-6">
                    {tabs.map((tab) => (
                      <button
                        key={tab.key}
                        onClick={() => setJoinMode(tab.key)}
                        className={`flex-1 py-2.5 px-3 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${joinMode === tab.key
                          ? 'bg-white dark:bg-zinc-700 text-zinc-900 dark:text-white shadow-sm'
                          : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'
                          }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={
                    joinMode === 'join' ? handleJoin :
                      joinMode === 'create' ? handleCreate :
                        handleStartRandom
                  } className="space-y-4">
                    {joinMode === 'join' && (
                      <div className="space-y-1.5">
                        <label htmlFor="roomName" className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-0.5">Room Name</label>
                        <input
                          id="roomName"
                          type="text"
                          value={roomNameInput}
                          onChange={(e) => setRoomNameInput(e.target.value)}
                          placeholder="Enter room name"
                          required
                          className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all duration-200"
                        />
                      </div>
                    )}

                    <div className="space-y-1.5">
                      <label htmlFor="alias" className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider px-0.5">Your Alias</label>
                      <input
                        id="alias"
                        type="text"
                        value={aliasInput}
                        onChange={(e) => setAliasInput(e.target.value)}
                        placeholder="Enter your name"
                        required
                        className="w-full px-4 py-3 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-500 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500/50 outline-none transition-all duration-200"
                      />
                    </div>

                    {error && (
                      <div className="p-3 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-xs font-semibold">
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading || (joinMode === 'random' && !socket)}
                      className="w-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-semibold py-3.5 rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-100 transition-colors duration-200 shadow-sm disabled:opacity-50 active:scale-[0.99] cursor-pointer"
                    >
                      {loading ? (
                        joinMode === 'join' ? 'Joining...' :
                          joinMode === 'create' ? 'Creating...' :
                            'Matching...'
                      ) : (
                        joinMode === 'join' ? 'Join Chat' :
                          joinMode === 'create' ? 'Create Shareable Link' :
                            'Start Matching'
                      )}
                    </button>
                  </form>
                </div>

                <div className="flex items-center justify-center gap-6 mt-6">
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                    <Lock size={12} />
                    E2E Encrypted
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-zinc-400 dark:text-zinc-600 uppercase tracking-wider">
                    <Zap size={12} />
                    Temporary
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="chat-ui"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex-1 flex flex-col w-full md:max-w-4xl md:mx-auto md:shadow-2xl md:shadow-black/10 dark:md:shadow-black/30 md:my-4 md:rounded-2xl overflow-hidden bg-white dark:bg-zinc-900 md:border md:border-zinc-200/80 md:dark:border-zinc-800/60"
            >
              <ChatHeader
                roomName={isRandomChat ? `Chat with ${partnerAlias || 'Stranger'}` : roomName!}
                participants={participants}
                onEndChat={onEndChat}
              />

              {isRandomChat && (
                <div className="bg-zinc-50 dark:bg-zinc-800/40 px-4 py-2.5 border-b border-zinc-200/80 dark:border-zinc-800/60 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">Anonymous Mode</span>
                  <button
                    onClick={skipUser}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-600 hover:bg-violet-700 text-white text-[10px] font-bold rounded-lg transition-colors duration-200 cursor-pointer"
                  >
                    <Shuffle size={12} />
                    Skip
                  </button>
                </div>
              )}

              {participants < 2 && shareLink && (
                <div className="bg-sky-50 dark:bg-sky-500/5 px-5 py-4 border-b border-sky-100 dark:border-sky-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider mb-0.5">Invite your partner</h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate max-w-[220px] sm:max-w-md">{shareLink}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={copyToClipboard}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 rounded-lg text-xs font-semibold border border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors duration-200 active:scale-95 cursor-pointer"
                    >
                      <Copy size={13} />
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={shareLinkNative}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-sky-500 text-white rounded-lg text-xs font-semibold hover:bg-sky-600 transition-colors duration-200 active:scale-95 cursor-pointer"
                    >
                      <Share2 size={13} />
                      Share
                    </button>
                    <button
                      onClick={() => setIsQrModalOpen(true)}
                      className="w-9 h-9 flex items-center justify-center bg-white dark:bg-zinc-800 text-sky-500 rounded-lg border border-sky-100 dark:border-sky-500/20 hover:bg-sky-50 dark:hover:bg-sky-500/10 transition-colors duration-200 active:scale-95 cursor-pointer"
                      title="Show QR Code"
                    >
                      <QrCode size={16} />
                    </button>
                  </div>
                </div>
              )}

              <ChatMessages
                messages={messages}
                currentAlias={alias!}
                typingUser={typingUser}
                onFetchMore={() => fetchHistory(nextCursor || undefined)}
              />
              <ChatInput
                onSendMessage={onSendMessage}
                disabled={participants < 2}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {shareLink && (
          <QRJoinModal
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            shareLink={shareLink}
          />
        )}
      </main>
    </ThemeProvider>
  );
}
