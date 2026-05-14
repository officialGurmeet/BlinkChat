"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExternalLink, Share2, MessageCircle } from "lucide-react";

const steps = [
    { number: "01", title: "Enter a room name", description: "Type any name to create a new room, or generate a random one. No registration needed.", icon: <ExternalLink size={22} /> },
    { number: "02", title: "Share the link", description: "Copy the room link or QR code. Anyone with it can join instantly.", icon: <Share2 size={22} /> },
    { number: "03", title: "Start chatting", description: "Messages are encrypted end-to-end. Close the tab — everything vanishes.", icon: <MessageCircle size={22} /> },
];

export const HowItWorksSection = () => {
    return (
        <section id="how-it-works" className="py-20 sm:py-28 relative">
            <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4 }}
                    className="text-center mb-14"
                >
                    <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-3 block">How It Works</span>
                    <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
                        Three steps to <span className="text-sky-500">privacy</span>
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 relative">
                    <div className="hidden md:block absolute top-12 left-[20%] right-[20%] h-px bg-zinc-200 dark:bg-zinc-800" />

                    {steps.map((step, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ delay: i * 0.12, duration: 0.4 }}
                            className="relative text-center"
                        >
                            <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-sky-500 mx-auto mb-5 shadow-sm relative z-10">
                                {step.icon}
                            </div>
                            <span className="text-[10px] font-mono font-bold text-zinc-400 dark:text-zinc-600 mb-2 block tracking-widest">{step.number}</span>
                            <h3 className="text-base font-semibold mb-2 text-zinc-800 dark:text-zinc-200">{step.title}</h3>
                            <p className="text-sm text-zinc-500 leading-relaxed max-w-[260px] mx-auto">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};
