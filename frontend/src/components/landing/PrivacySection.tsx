"use client";

import React from "react";
import { motion } from "framer-motion";
import { Shield, Lock, Trash2 } from "lucide-react";

const privacyFeatures = [
    { icon: <Shield size={22} />, title: "No Accounts Required", description: "No email, no password, no personal data collected. Ever." },
    { icon: <Lock size={22} />, title: "End-to-End Encryption", description: "Messages are encrypted on your device. Not even we can read them." },
    { icon: <Trash2 size={22} />, title: "Auto-Delete Everything", description: "When the chat ends, all messages and room data are permanently destroyed." },
];

export const PrivacySection = () => {
    return (
        <section className="py-20 sm:py-28 relative">
            <div className="max-w-5xl mx-auto px-5 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.4 }}
                    className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/60 bg-zinc-50/80 dark:bg-zinc-900/30 overflow-hidden"
                >
                    <div className="p-8 sm:p-12 lg:p-16">
                        <div className="text-center mb-12">
                            <span className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-500 mb-3 block">Privacy</span>
                            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
                                Privacy First <span className="text-emerald-500">Communication</span>
                            </h2>
                            <p className="text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto text-sm sm:text-base">
                                Private conversations should stay private. No tracking, no storage, no compromises.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {privacyFeatures.map((feature, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 12 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1, duration: 0.35 }}
                                    className="text-center"
                                >
                                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-4">
                                        {feature.icon}
                                    </div>
                                    <h3 className="font-semibold text-zinc-800 dark:text-zinc-200 mb-2">{feature.title}</h3>
                                    <p className="text-sm text-zinc-500 leading-relaxed">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
};
