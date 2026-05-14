"use client";

import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, Terminal } from 'lucide-react';
import { cn } from '@/src/lib/utils';

interface CodeBlockProps {
    code: string;
    language?: string;
    className?: string;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ code, language = 'text', className }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className={cn("group relative my-4 rounded-xl overflow-hidden border border-zinc-800 bg-[#1e1e1e] shadow-2xl", className)}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-zinc-900/50 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Terminal size={14} className="text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
                        {language || 'code'}
                    </span>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-zinc-800 rounded-md transition-all text-zinc-400 hover:text-white flex items-center gap-1.5"
                    title="Copy code"
                >
                    {copied ? (
                        <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter">Copied</span>
                        </>
                    ) : (
                        <>
                            <Copy size={12} />
                            <span className="text-[10px] font-bold uppercase tracking-tighter">Copy</span>
                        </>
                    )}
                </button>
            </div>

            {/* Code */}
            <div className="relative overflow-x-auto custom-scrollbar">
                <SyntaxHighlighter
                    language={language.toLowerCase()}
                    style={vscDarkPlus}
                    customStyle={{
                        margin: 0,
                        padding: '1.25rem',
                        fontSize: '0.8rem',
                        lineHeight: '1.5',
                        background: 'transparent',
                    }}
                    codeTagProps={{
                        className: "font-mono",
                    }}
                >
                    {code.trim()}
                </SyntaxHighlighter>
            </div>
        </div>
    );
};
