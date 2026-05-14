"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";

export const DevSection = () => {
    const devFeatures = [
        { title: "Code Snippet Mode", desc: "Share code with syntax highlighting. Debug faster with temporary pair sessions." },
        { title: "Quick Help Rooms", desc: "Get fast answers by dropping into topic-specific developer rooms." },
        { title: "Zero Friction", desc: "No sign-up walls. Open a link and start collaborating in under 3 seconds." },
    ];

    return (
        <section className="py-20 sm:py-28 relative">
            <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.4 }}
                    >
                        <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber-500 mb-3 block">For Developers</span>
                        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-6 text-zinc-900 dark:text-white">
                            Built for <span className="text-amber-500">developers</span>
                        </h2>
                        <div className="space-y-4">
                            {devFeatures.map((item, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -8 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: 0.15 + i * 0.08 }}
                                    className="flex gap-3.5 items-start"
                                >
                                    <div className="w-6 h-6 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <Check size={13} className="text-emerald-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-zinc-800 dark:text-zinc-200">{item.title}</h4>
                                        <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{item.desc}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-80px" }}
                        transition={{ duration: 0.5, delay: 0.15 }}
                        className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/80 shadow-lg shadow-black/5 dark:shadow-black/20"
                    >
                        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 dark:border-zinc-800">
                            <span className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            <span className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            <span className="w-3 h-3 rounded-full bg-zinc-200 dark:bg-zinc-700" />
                            <span className="ml-3 text-xs text-zinc-400 dark:text-zinc-500 font-mono">snippet.tsx</span>
                        </div>
                        <pre className="p-5 text-[13px] font-mono leading-relaxed overflow-x-auto">
                            <code>
                                <span className="text-purple-600 dark:text-purple-400">const</span>{" "}
                                <span className="text-sky-600 dark:text-sky-300">room</span>{" "}
                                <span className="text-zinc-400">=</span>{" "}
                                <span className="text-amber-600 dark:text-amber-300">createRoom</span>
                                <span className="text-zinc-500">(</span>
                                <span className="text-emerald-600 dark:text-emerald-400">&quot;debug-session&quot;</span>
                                <span className="text-zinc-500">);</span>
                                {"\n\n"}
                                <span className="text-zinc-400">{"// Share the link"}</span>
                                {"\n"}
                                <span className="text-purple-600 dark:text-purple-400">const</span>{" "}
                                <span className="text-sky-600 dark:text-sky-300">link</span>{" "}
                                <span className="text-zinc-400">=</span>{" "}
                                <span className="text-sky-600 dark:text-sky-300">room</span>
                                <span className="text-zinc-500">.</span>
                                <span className="text-amber-600 dark:text-amber-300">getShareableLink</span>
                                <span className="text-zinc-500">();</span>
                                {"\n\n"}
                                <span className="text-zinc-400">{"// Messages auto-delete"}</span>
                                {"\n"}
                                <span className="text-sky-600 dark:text-sky-300">room</span>
                                <span className="text-zinc-500">.</span>
                                <span className="text-amber-600 dark:text-amber-300">onEnd</span>
                                <span className="text-zinc-500">(() </span>
                                <span className="text-purple-600 dark:text-purple-400">{"=>"}</span>
                                <span className="text-zinc-500"> {"{"}</span>
                                {"\n"}
                                {"  "}
                                <span className="text-sky-600 dark:text-sky-300">console</span>
                                <span className="text-zinc-500">.</span>
                                <span className="text-amber-600 dark:text-amber-300">log</span>
                                <span className="text-zinc-500">(</span>
                                <span className="text-emerald-600 dark:text-emerald-400">&quot;Chat vanished ✨&quot;</span>
                                <span className="text-zinc-500">);</span>
                                {"\n"}
                                <span className="text-zinc-500">{"}"});</span>
                            </code>
                        </pre>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
