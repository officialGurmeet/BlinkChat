"use client";

import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Copy, Download, Link as LinkIcon, Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils';

interface QRCodeCardProps {
    url: string;
    className?: string;
}

export const QRCodeCard: React.FC<QRCodeCardProps> = ({ url, className }) => {
    const [copied, setCopied] = React.useState(false);
    const qrRef = useRef<SVGSVGElement>(null);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        const svg = qrRef.current;
        if (!svg) return;

        const svgData = new XMLSerializer().serializeToString(svg);
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const img = new Image();

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx?.drawImage(img, 0, 0);
            const pngFile = canvas.toDataURL("image/png");

            const downloadLink = document.createElement("a");
            downloadLink.download = "BlinkChat-Room-QR.png";
            downloadLink.href = pngFile;
            downloadLink.click();
        };

        img.src = "data:image/svg+xml;base64," + btoa(svgData);
    };

    return (
        <div className={cn("bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 shadow-xl w-full max-w-[320px] mx-auto", className)}>
            <div className="text-center mb-6">
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white uppercase tracking-wider mb-1">Scan to Join</h3>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Invite someone to this private chat</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-zinc-100 dark:border-zinc-800 flex items-center justify-center mb-6 aspect-square overflow-hidden shadow-inner">
                <QRCodeSVG
                    ref={qrRef}
                    value={url}
                    size={200}
                    level="H"
                    includeMargin={false}
                    className="w-full h-full"
                />
            </div>

            <div className="space-y-3">
                <div className="flex items-center gap-2 p-3 bg-zinc-50 dark:bg-zinc-800/50 rounded-xl border border-zinc-200 dark:border-zinc-700 overflow-hidden">
                    <LinkIcon className="w-3 h-3 text-zinc-400 shrink-0" />
                    <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium truncate flex-1">
                        {url}
                    </span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg transition-colors shrink-0"
                    >
                        {copied ? (
                            <Check className="w-3 h-3 text-emerald-500" />
                        ) : (
                            <Copy className="w-3 h-3 text-zinc-400" />
                        )}
                    </button>
                </div>

                <button
                    onClick={handleDownload}
                    className="w-full py-3 px-4 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-[0.98]"
                >
                    <Download className="w-3.5 h-3.5" />
                    Download QR Code
                </button>
            </div>
        </div>
    );
};
