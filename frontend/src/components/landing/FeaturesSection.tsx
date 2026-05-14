"use client";

import React from "react";
import { motion } from "framer-motion";
import { Link, Clock, Users, QrCode, Code, Smile, MessageSquare, Layers } from "lucide-react";

const features = [
    { icon: <Link size={20} />, title: "Shareable Chat Links", description: "Generate a unique link and share it instantly. Anyone with the link can join.", accent: "sky" },
    { icon: <Users size={20} />, title: "Anonymous Random Chat", description: "Jump into random conversations. No accounts, no profiles, just real-time talk.", accent: "violet" },
    { icon: <Clock size={20} />, title: "Temporary Chats", description: "All chats are ephemeral. When you end chat, everything disappears forever.", accent: "amber" },
    { icon: <QrCode size={20} />, title: "QR Code Join", description: "Scan a QR code to join from any device. Perfect for in-person quick chats.", accent: "emerald" },
    { icon: <Code size={20} />, title: "Code Snippets", description: "Share code with syntax highlighting. Perfect for debugging together.", accent: "rose" },
    { icon: <Smile size={20} />, title: "Emoji Messaging", description: "Express yourself with a rich emoji picker. Make your chats more lively.", accent: "amber" },
    { icon: <MessageSquare size={20} />, title: "Typing Indicators", description: "See when someone is typing in real-time. Stay in sync with live flow.", accent: "sky" },
    { icon: <Layers size={20} />, title: "Public Rooms", description: "Browse and join public topic rooms like React Help or AI Discussion.", accent: "violet" },
];

const accentMap: Record<string, { bg: string; text: string; border: string }> = {
    sky: { bg: "bg-sky-500/10 dark:bg-sky-500/10", text: "text-sky-600 dark:text-sky-400", border: "border-sky-500/20" },
    violet: { bg: "bg-violet-500/10 dark:bg-violet-500/10", text: "text-violet-600 dark:text-violet-400", border: "border-violet-500/20" },
    amber: { bg: "bg-amber-500/10 dark:bg-amber-500/10", text: "text-amber-600 dark:text-amber-400", border: "border-amber-500/20" },
    emerald: { bg: "bg-emerald-500/10 dark:bg-emerald-500/10", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/20" },
    rose: { bg: "bg-rose-500/10 dark:bg-rose-500/10", text: "text-rose-600 dark:text-rose-400", border: "border-rose-500/20" },
};

export const FeaturesSection = () => {
    return (
        <section id="features" className="py-20 sm:py-28 relative">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-14"
                >
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-sky-500 mb-3 block">Features</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
                        Everything for <span className="text-sky-500">instant communication</span>
                    </h2>
                    <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
                        Powerful features wrapped in a clean interface. No complexity, just chat.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {features.map((feature, i) => {
                        const colors = accentMap[feature.accent] || accentMap.sky;
                        return (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-40px" }}
                                transition={{ delay: i * 0.04, duration: 0.35 }}
                                className="group p-5 rounded-2xl border border-zinc-200/80 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/40 hover:bg-zinc-50/80 dark:hover:bg-zinc-800/30 hover:border-zinc-300 dark:hover:border-zinc-700/60 transition-all duration-200 cursor-default"
                            >
                                <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center ${colors.text} mb-4 group-hover:scale-105 transition-transform duration-200`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-sm font-semibold mb-1.5 text-zinc-800 dark:text-zinc-200">{feature.title}</h3>
                                <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">{feature.description}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};
