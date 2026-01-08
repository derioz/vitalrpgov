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
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
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
                        <div key={ann.id} className={`group relative bg-gradient-to-br from-slate-900/80 to-slate-900/40 backdrop-blur-md border border-white/5 rounded-3xl p-8 hover:border-${color}-500/30 transition-all duration-500 overflow-hidden`}>

                            {/* Hover Glow */}
                            <div className={`absolute inset-0 ${colorClasses.bg}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay`}></div>

                            <div className="flex flex-col md:flex-row gap-8 relative z-10">
                                {/* Date Block */}
                                <div className={`md:w-24 flex-shrink-0 flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-950/50 border border-white/5 group-hover:border-${color}-500/20 transition-colors`}>
                                    <span className={`${colorClasses.text} font-black text-3xl`}>
                                        {ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).getDate() : '!!'}
                                    </span>
                                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                        {ann.createdAt?.seconds ? new Date(ann.createdAt.seconds * 1000).toLocaleString('default', { month: 'short' }) : 'NOW'}
                                    </span>
                                </div>

                                <div className="flex-1">
                                    <h3 className={`text-2xl font-bold text-white mb-3 group-hover:${colorClasses.text} transition-colors`}>{ann.title}</h3>

                                    {ann.tags && ann.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {ann.tags.map((tag, idx) => (
                                                <span key={idx} className={`text-[10px] uppercase font-bold px-2 py-1 rounded bg-slate-800 text-slate-400 border border-slate-700`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {ann.imageUrl && (
                                        <div className="mb-4 rounded-xl overflow-hidden shadow-2xl shadow-black/50 border border-white/5 relative">
                                            <img src={ann.imageUrl} alt="Announcement" className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" />
                                        </div>
                                    )}

                                    <div className="prose prose-invert prose-lg max-w-none text-slate-400 group-hover:text-slate-300 transition-colors line-clamp-4">
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
