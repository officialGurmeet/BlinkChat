"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

/* ───── Floating Chat Bubble Component ───── */
const FloatingBubble = ({
    initialX,
    initialY,
    delay,
    children,
    className
}: {
    initialX: number;
    initialY: number;
    delay: number;
    children: React.ReactNode;
    className?: string;
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8, x: initialX, y: initialY }}
            animate={{
                opacity: 1,
                scale: 1,
                y: [initialY, initialY - 10, initialY],
            }}
            transition={{
                opacity: { duration: 0.5, delay },
                scale: { duration: 0.5, delay },
                y: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay: delay + 0.2 }
            }}
            className={`absolute z-20 ${className}`}
        >
            {children}
        </motion.div>
    );
};

/* ───── Hero Section ───── */
export const HeroSection = () => {
    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-24 pb-16">
            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 hero-grid hero-grid-mask opacity-60" />
                <div className="absolute top-[20%] left-[5%] w-[400px] h-[300px] bg-sky-100/40 dark:bg-sky-500/[0.04] rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[400px] bg-amber-100/30 dark:bg-amber-500/[0.03] rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Left Column: Text Content */}
                    <div className="flex flex-col items-start text-left max-w-2xl">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-zinc-900 dark:text-white"
                        >
                            Let's Connect <br />
                            <span className="text-sky-500">with Your Customer</span> <br />
                            in Real Time
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="text-lg text-zinc-500 dark:text-zinc-400 mb-10 leading-relaxed max-w-xl"
                        >
                            Powerful, temporary, and encrypted chats that vanish the moment you leave. Great software that allows you to chat from any place at any time.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-6 mb-12"
                        >
                            <Link
                                href="/chat"
                                className="group px-8 py-4 text-base font-semibold rounded-xl bg-orange-500 text-white hover:bg-orange-600 transition-all duration-200 shadow-lg shadow-orange-500/25 active:scale-[0.98]"
                            >
                                Start Chatting Now
                                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
                            </Link>

                            {/* Decorative squiggly line (optional, based on design) */}
                            <svg className="hidden sm:block text-zinc-300 dark:text-zinc-700 w-24 h-12" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" strokeLinecap="round">
                                <path d="M0,25 Q25,0 50,25 T100,25" />
                            </svg>
                        </motion.div>

                        {/* Trust Indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="flex items-center gap-8"
                        >
                            <div className="flex items-center">
                                {/* Overlapping Avatars */}
                                <div className="flex -space-x-3">
                                    {['bg-sky-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500'].map((color, i) => (
                                        <div key={i} className={`w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-white text-xs font-bold ${color}`}>
                                            {String.fromCharCode(65 + i)}
                                        </div>
                                    ))}
                                </div>
                                <div className="ml-4">
                                    <div className="font-extrabold text-xl text-zinc-900 dark:text-white">1,500+</div>
                                    <div className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">Happy Customers</div>
                                </div>
                            </div>

                            <div className="w-px h-10 bg-zinc-200 dark:bg-zinc-800" />

                            <div>
                                <div className="font-extrabold text-xl text-zinc-900 dark:text-white">4.8/5</div>
                                <div className="flex items-center gap-1 text-orange-400 mt-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-3.5 h-3.5 fill-current" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Right Column: Image & Floating Elements */}
                    <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-square flex items-center justify-center mt-12 lg:mt-0">
                        {/* Background Colored Shape */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.7 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-500 rounded-full mix-blend-multiply dark:mix-blend-normal opacity-90 dark:opacity-40"
                        />

                        {/* Outline Circle matching reference */}
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.1 }}
                            className="absolute top-[10%] right-[5%] w-[85%] h-[85%] border-[1.5px] border-zinc-900 dark:border-zinc-500 rounded-full opacity-40"
                        />

                        {/* Person Image (Placeholder that expects a transparent PNG cutout) */}
                        <motion.div
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="relative z-10 w-full h-full flex items-end justify-center"
                        >
                            {/* NOTE: You should replace this with the transparent PNG provided by the users */}
                            <div className="w-[85%] h-[95%] bg-zinc-200 dark:bg-zinc-800 rounded-b-full rounded-t-[40%] flex items-center justify-center text-zinc-400 overflow-hidden shadow-2xl border-4 border-white dark:border-zinc-900 border-b-0 relative">
                                <span className="text-sm font-medium z-10">Image Placeholder (Replace with transparent PNG)</span>
                                {/* Generic silhouette gradient for better demo visualization */}
                                <div className="absolute inset-0 bg-gradient-to-t from-zinc-400 to-transparent opacity-20" />
                            </div>
                        </motion.div>

                        {/* Floating Element 1 - Left */}
                        <FloatingBubble initialX={-40} initialY={80} delay={0.5} className="-left-4 md:left-4 top-[60%]">
                            <div className="flex items-center gap-3 p-3 pr-5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-zinc-700/50">
                                <div className="w-10 h-10 rounded-full bg-violet-500 flex items-center justify-center text-white font-bold shrink-0">
                                    RR
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Ronald Richards</h4>
                                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[140px] leading-tight mt-0.5">
                                        One of the best chatting app I have ever used.
                                    </p>
                                </div>
                            </div>
                        </FloatingBubble>

                        {/* Floating Element 2 - Right */}
                        <FloatingBubble initialX={40} initialY={-40} delay={0.7} className="-right-4 md:right-4 top-[40%]">
                            <div className="flex items-center gap-3 p-3 pr-5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 dark:border-zinc-700/50">
                                <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold shrink-0">
                                    JW
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Jenny Wilson</h4>
                                    <p className="text-[10px] text-zinc-500 dark:text-zinc-400 max-w-[140px] leading-tight mt-0.5">
                                        I commented on Figma, I want to add some fancy icons.
                                    </p>
                                </div>
                            </div>
                        </FloatingBubble>

                    </div>
                </div>
            </div>
        </section>
    );
};
