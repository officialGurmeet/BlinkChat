"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export const CTASection = () => {
    return (
        <section className="py-20 sm:py-28 relative">
            <div className="max-w-4xl mx-auto px-5 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4 }}
                    className="relative rounded-3xl overflow-hidden bg-zinc-900 dark:bg-zinc-800/60"
                >
                    <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/8 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 w-60 h-60 bg-violet-500/6 rounded-full blur-[80px]" />

                    <div className="relative z-10 px-8 py-16 sm:px-16 sm:py-20 text-center">
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-5 text-white">
                            Start a Chat <span className="text-sky-400">Now</span>
                        </h2>
                        <p className="text-base sm:text-lg text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">
                            Create a temporary chat room in seconds. No sign-up, no hassle. Just pure, private conversation.
                        </p>
                        <Link
                            href="/chat"
                            className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold rounded-xl bg-white text-zinc-900 hover:bg-zinc-100 transition-all duration-200 shadow-lg active:scale-[0.98] cursor-pointer"
                        >
                            Create Chat Room
                            <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
