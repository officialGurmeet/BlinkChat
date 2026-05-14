"use client";

import React from 'react';
import dynamic from 'next/dynamic';
import { Theme } from 'emoji-picker-react';

const Picker = dynamic(() => import('emoji-picker-react'), {
    ssr: false,
    loading: () => (
        <div className="w-[350px] h-[400px] bg-white dark:bg-zinc-900 animate-pulse rounded-2xl flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
        </div>
    )
});

interface EmojiPickerProps {
    onEmojiClick: (emojiData: any) => void;
    theme?: 'light' | 'dark' | 'auto';
}

export const EmojiPicker: React.FC<EmojiPickerProps> = ({ onEmojiClick, theme = 'auto' }) => {
    return (
        <div className="shadow-2xl rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800">
            <Picker
                onEmojiClick={onEmojiClick}
                theme={theme as Theme}
                lazyLoadEmojis={true}
                skinTonesDisabled={true}
                searchPlaceHolder="Search emoji..."
                width={350}
                height={400}
                previewConfig={{ showPreview: false }}
            />
        </div>
    );
};
