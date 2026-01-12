'use client';

import { useState, useEffect } from 'react';
import { FaTimes, FaArrowUp } from 'react-icons/fa';
import ClientChangelog from './ClientChangelog';
import changelogData from '@/data/changelog.json';
import type { ChangelogItem } from '@/lib/changelog';

interface ChangelogModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        // Prevent body scroll when modal is open
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    // Robustly handle JSON import path data
    const rawData = changelogData as any;
    const items = (Array.isArray(rawData) ? rawData : (rawData?.default || [])) as ChangelogItem[];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/50 rounded-3xl shadow-2xl flex flex-col animate-scale-in overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md z-10 sticky top-0">
                    <div>
                        <h2 className="text-2xl font-black text-white tracking-tight">System Updates</h2>
                        <p className="text-slate-400 text-sm">VitalRP Government Portal Changelog</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Scrollable Body */}
                <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
                    <div className="mb-6 flex items-center gap-4 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                        <div className="w-12 h-12 rounded-full border-2 border-indigo-400/30 overflow-hidden shrink-0">
                            <img src="/images/damon_icon.png" alt="Dev" className="w-full h-full object-cover" />
                        </div>
                        <div>
                            <p className="text-indigo-200 font-bold text-sm">Maintained by Damon</p>
                            <p className="text-slate-400 text-xs">Updates are deployed automatically via the CI/CD pipeline.</p>
                        </div>
                    </div>

                    <ClientChangelog items={items} />
                </div>
            </div>
        </div>
    );
}
