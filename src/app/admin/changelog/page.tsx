'use client';
import { useState, useEffect } from 'react';
import ClientChangelog from '@/components/admin/ClientChangelog';
import { FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';
import changelogData from '@/data/changelog.json';
import type { ChangelogItem } from '@/lib/changelog';

export default function ChangelogPage() {
    // Robustly handle JSON import (ESM/CJS interoperability)
    const rawData = changelogData as any;
    const items = Array.isArray(rawData) ? rawData : (rawData?.default || []);

    // Debugging for production
    if (typeof window !== 'undefined') {
        console.log('[ChangelogPage] Loaded Data:', items);
    }

    const changelogs: ChangelogItem[] = (items as ChangelogItem[]) || [];

    return (
        <div className="space-y-8 max-w-5xl mx-auto">
            {/* Header with Damon's Attribution */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full border-4 border-slate-700/50 shadow-xl overflow-hidden relative group">
                        <img
                            src="/images/damon_icon.png"
                            alt="Damon"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight mb-1">System Updates</h1>
                        <p className="text-slate-400 font-medium flex items-center gap-2">
                            Maintained & Developed by <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400 font-bold">Damon</span>
                        </p>
                    </div>
                </div>

                <Link href="/admin" className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors flex items-center gap-2 border border-slate-700 relative z-10">
                    <FaArrowLeft /> Back to Dashboard
                </Link>
            </div>

            {/* Client Interactive Changelog */}
            <ClientChangelog items={changelogs} />
        </div>
    );
}
