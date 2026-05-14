"use client";

import React from "react";
import Link from "next/link";

export const Footer = () => {
    return (
        <footer className="border-t border-zinc-200/80 dark:border-zinc-800/50">
            <div className="max-w-6xl mx-auto px-5 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-sky-500 flex items-center justify-center shadow-sm">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold tracking-tight text-zinc-900 dark:text-white">
                            Blink<span className="text-sky-500">Chat</span>
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-8">
                        <a href="#features" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer">Features</a>
                        <a href="#rooms" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer">Rooms</a>
                        <a href="#how-it-works" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer">How it Works</a>
                        <a href="#" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer">Privacy</a>
                        <a href="#" className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300 transition-colors cursor-pointer">GitHub</a>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-zinc-200/50 dark:border-zinc-800/30 text-center">
                    <p className="text-xs text-zinc-400 dark:text-zinc-600">
                        © {new Date().getFullYear()} BlinkChat. All conversations are temporary and encrypted.
                    </p>
                </div>
            </div>
        </footer>
    );
};
