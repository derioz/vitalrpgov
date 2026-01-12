"use client";

import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaBalanceScale, FaPhone, FaCircle, FaUserTie } from 'react-icons/fa';

interface BarMember {
    id: string;
    name: string;
    status: string;
    phone?: string;
    photoURL?: string;
    barNumber?: string;
    firm?: string;
}

interface BarRosterProps {
    title?: string;
    color?: string;
}

export default function BarRoster({ title = "State Bar Association", color = "indigo" }: BarRosterProps) {
    const [members, setMembers] = useState<BarMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const q = query(
                    collection(db, 'bar_members'),
                    orderBy('name', 'asc')
                );

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BarMember));
                setMembers(data);
            } catch (error) {
                console.error("Error fetching bar members:", error);
                // Fallback without sort
                try {
                    const snapshot = await getDocs(collection(db, 'bar_members'));
                    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as BarMember));
                    setMembers(data);
                } catch (e) {
                    console.error("Retry failed", e);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMembers();
    }, []);

    // Color mapping (matching FactionRoster for consistency)
    const colorConfig: Record<string, { bg: string, text: string, border: string, gradient: string }> = {
        indigo: { bg: 'bg-indigo-500', text: 'text-indigo-500', border: 'border-indigo-500', gradient: 'from-indigo-600 to-purple-900' },
        amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', gradient: 'from-amber-600 to-yellow-900' },
    };

    const theme = colorConfig[color] || colorConfig.indigo;

    if (loading) return <div className="text-center py-10 opacity-50 animate-pulse">Loading bar directory...</div>;

    if (members.length === 0) {
        return (
            <div id="bar-roster" className="py-12 scroll-mt-24">
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 ${theme.text}`}>
                    <span className={`w-1 h-3 rounded-full ${theme.bg}`}></span>
                    {title}
                </h3>
                <div className={`rounded-xl border border-dashed p-8 text-center bg-white/5 border-white/10`}>
                    <FaBalanceScale className="mx-auto mb-3 text-3xl opacity-50 text-slate-500" />
                    <p className="text-sm font-bold opacity-60 text-slate-400">No Licensed Attorneys Found</p>
                </div>
            </div>
        );
    }

    return (
        <div id="bar-roster" className="py-12 scroll-mt-24">
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-3 ${theme.text}`}>
                <span className={`w-1 h-3 rounded-full ${theme.bg}`}></span>
                {title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {members.map((member) => (
                    <div key={member.id} className="group relative h-[320px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] border border-white/5 bg-black/40">
                        {/* Background / Placeholder */}
                        <div className="absolute inset-0 bg-slate-950 transition-transform duration-700">
                            {member.photoURL ? (
                                <img src={member.photoURL} alt={member.name} className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-1000" />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${theme.gradient} opacity-20 group-hover:opacity-30 transition-opacity`}>
                                    <FaUserTie className="text-8xl text-white/5" />
                                </div>
                            )}
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 group-hover:opacity-100 transition-opacity"></div>

                        {/* Content */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between">
                            {/* Status Top Right */}
                            <div className="flex justify-end relative z-10">
                                <div className={`px-2 py-1 rounded-md text-[8px] font-black uppercase tracking-[0.2em] flex items-center gap-1.5 border backdrop-blur-md ${member.status === 'Active'
                                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                                    : 'bg-red-500/20 text-red-400 border-red-500/20'
                                    }`}>
                                    <FaCircle className="text-[5px] animate-pulse" />
                                    {member.status}
                                </div>
                            </div>

                            <div className="transform transition-all duration-500 group-hover:-translate-y-2 relative z-10">
                                <div className={`w-12 h-1 rounded-full ${theme.bg} mb-4 opacity-50 group-hover:opacity-100 transition-opacity`}></div>
                                <h4 className="text-2xl font-black text-white mb-1 leading-tight uppercase tracking-tight group-hover:text-white transition-colors">
                                    {member.name}
                                </h4>
                                {member.barNumber && (
                                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">BAR NO. {member.barNumber}</p>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400 border border-white/5">
                                            <FaBalanceScale size={14} />
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-widest">{member.firm || 'Licensed Attorney'}</span>
                                    </div>

                                    {member.phone && (
                                        <div className="flex items-center gap-3 text-slate-400">
                                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400 border border-white/5">
                                                <FaPhone size={12} />
                                            </div>
                                            <span className="text-[11px] font-mono tracking-wider">{member.phone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Decorative Border */}
                        <div className={`absolute inset-0 border border-white/0 group-hover:border-white/10 rounded-2xl transition-colors pointer-events-none`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
