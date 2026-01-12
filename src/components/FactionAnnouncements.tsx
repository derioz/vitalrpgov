"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import { FaBullhorn } from 'react-icons/fa';

interface Announcement {
    id: string;
    title: string;
    content: string;
    department: string;
    author: string;
    imageUrl?: string;
    tags?: string[];
    createdAt: any;
}

interface FactionAnnouncementsProps {
    department: 'LSPD' | 'LSEMS' | 'SAFD' | 'DOJ';
    title: string;
    color: 'blue' | 'red' | 'orange' | 'amber';
    icon?: React.ElementType;
}

export default function FactionAnnouncements({ department, title, color, icon: Icon = FaBullhorn }: FactionAnnouncementsProps) {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [loading, setLoading] = useState(true);

    const colorClasses = {
        blue: {
            text: 'text-blue-500',
            bg: 'bg-blue-600',
            border: 'border-blue-500',
            glow: 'shadow-blue-500/20'
        },
        red: {
            text: 'text-red-500',
            bg: 'bg-red-600',
            border: 'border-red-500',
            glow: 'shadow-red-500/20'
        },
        orange: {
            text: 'text-orange-500',
            bg: 'bg-orange-600',
            border: 'border-orange-500',
            glow: 'shadow-orange-500/20'
        },
        amber: {
            text: 'text-amber-500',
            bg: 'bg-amber-600',
            border: 'border-amber-500',
            glow: 'shadow-amber-500/20'
        }
    }[color];

    useEffect(() => {
        const fetchAnnouncements = async () => {
            try {
                const q = query(
                    collection(db, 'announcements'),
                    where('department', '==', department),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Announcement));
                setAnnouncements(data);
            } catch (error) {
                console.error(`Error fetching ${department} announcements:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchAnnouncements();
    }, [department]);

    return (
        <section>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Icon className={colorClasses.text} />
                    {title}
                </h2>
                <div className={`h-[1px] flex-1 bg-gradient-to-r from-slate-700 to-transparent`}></div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="h-40 bg-slate-900/50 animate-pulse rounded-2xl border border-white/5"></div>
                ) : announcements.length > 0 ? (
                    announcements.map((ann) => (
                        <div key={ann.id} className={`group relative bg-white/5 dark:bg-zinc-900/60 backdrop-blur-sm border border-slate-200 dark:border-white/10 rounded-2xl p-6 hover:border-${color}-500/30 transition-all duration-500 overflow-hidden shadow-sm dark:shadow-[0_8px_32px_rgba(0,0,0,0.5)]`}>

                            {/* Hover Glow */}
                            <div className={`absolute inset-0 ${colorClasses.bg}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay`}></div>

                            <div className="flex flex-col md:flex-row gap-6 relative z-10">
                                {/* Date Block */}
                                <div className={`md:w-20 flex-shrink-0 flex flex-col items-center justify-center p-3 rounded-xl bg-slate-100 dark:bg-zinc-950/80 border border-slate-200 dark:border-white/10 group-hover:border-${color}-500/30 transition-colors`}>
                                    <span className={`${colorClasses.text} font-black text-2xl`}>
                                        {ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).getDate() : '!!'}
                                    </span>
                                    <span className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">
                                        {ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).toLocaleString('default', { month: 'short' }) : 'NOW'}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:${colorClasses.text} transition-colors`}>{ann.title}</h3>

                                    {ann.tags && ann.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {ann.tags.map((tag, idx) => (
                                                <span key={idx} className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {ann.imageUrl && (
                                        <div className="mb-3 rounded-lg overflow-hidden shadow-lg shadow-black/50 border border-white/5 relative">
                                            <img src={ann.imageUrl} alt="Announcement" className="w-full h-28 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                                        </div>
                                    )}

                                    <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors line-clamp-3">
                                        <ReactMarkdown>{ann.content}</ReactMarkdown>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center border border-dashed border-slate-800 rounded-3xl text-slate-500">
                        No active briefings found.
                    </div>
                )}
            </div>
        </section>
    );
}
