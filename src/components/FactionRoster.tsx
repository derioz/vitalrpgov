"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaDiscord, FaUserShield } from 'react-icons/fa';

interface RosterMember {
    id: string;
    name: string;
    rank: string;
    department: string;
    discord: string;
    image?: string;
}

interface FactionRosterProps {
    department: string;
    title?: string;
    color?: string;
}

export default function FactionRoster({ department, title = "Department Roster", color = "blue" }: FactionRosterProps) {
    const [roster, setRoster] = useState<RosterMember[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRoster = async () => {
            try {
                const q = query(
                    collection(db, 'rosters'),
                    where('department', '==', department),
                    orderBy('rank', 'asc') // Assuming alphabetical rank for now
                );

                const snapshot = await getDocs(q);
                let data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RosterMember));

                // Fallback sort if query ordering wasn't perfect or needed custom logic
                // For now, trust the query or implemented manual sort here if needed

                setRoster(data);
            } catch (error) {
                console.error(`Error fetching ${department} roster:`, error);
                // Fallback query without sort
                try {
                    const q2 = query(collection(db, 'rosters'), where('department', '==', department));
                    const snapshot2 = await getDocs(q2);
                    const data2 = snapshot2.docs.map(doc => ({ id: doc.id, ...doc.data() } as RosterMember));
                    setRoster(data2);
                } catch (e) {
                    console.error("Retry failed", e);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchRoster();
    }, [department]);

    // Color mapping
    const colorConfig: Record<string, { bg: string, text: string, border: string, shadow: string, gradient: string }> = {
        blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', shadow: 'shadow-blue-500/50', gradient: 'from-blue-600 to-indigo-900' },
        red: { bg: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', shadow: 'shadow-red-500/50', gradient: 'from-red-600 to-rose-900' },
        orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', shadow: 'shadow-orange-500/50', gradient: 'from-orange-600 to-amber-900' },
        amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', shadow: 'shadow-amber-500/50', gradient: 'from-amber-500 to-yellow-800' },
    };

    const theme = colorConfig[color] || colorConfig.blue;

    if (loading) return <div className="text-center py-10 opacity-50 animate-pulse">Loading personnel data...</div>;

    if (roster.length === 0) {
        return (
            <div id="roster" className="py-12 scroll-mt-24">
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 ${theme.text}`}>
                    <span className={`w-1 h-3 rounded-full ${theme.bg}`}></span>
                    {title}
                </h3>
                <div className={`rounded-xl border border-dashed p-8 text-center bg-white/5 border-white/10`}>
                    <FaUserShield className="mx-auto mb-3 text-3xl opacity-50" />
                    <p className="text-sm font-bold opacity-60">Roster Pending Update</p>
                </div>
            </div>
        );
    }

    return (
        <div id="roster" className="py-12 scroll-mt-24">
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-8 flex items-center gap-3 ${theme.text}`}>
                <span className={`w-1 h-3 rounded-full ${theme.bg}`}></span>
                {title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {roster.map((member) => (
                    <div key={member.id} className="group relative h-[360px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)] border border-white/5 bg-black/40">

                        {/* Background Image */}
                        <div className="absolute inset-0 bg-slate-950 group-hover:scale-105 transition-transform duration-700">
                            {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                            ) : (
                                <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${theme.gradient} opacity-30`}>
                                    <FaUserShield className="text-8xl text-white/10" />
                                </div>
                            )}
                        </div>

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent opacity-90 group-hover:opacity-95 transition-opacity"></div>

                        {/* Content */}
                        <div className="absolute inset-0 p-5 flex flex-col justify-end transform transition-transform duration-500">

                            {/* Rank Badge */}
                            <div className={`self-start px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 overflow-hidden relative ${theme.bg} text-white shadow-lg`}>
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                                {member.rank}
                            </div>

                            <h4 className="text-2xl font-black text-white mb-0.5 leading-none">{member.name}</h4>

                            {/* Hidden Details (Reveal on Hover) */}
                            <div className="h-0 group-hover:h-14 overflow-hidden transition-all duration-500 opacity-0 group-hover:opacity-100">
                                <div className="pt-3 flex flex-col gap-1">
                                    {member.discord && (
                                        <div className="flex items-center gap-2 text-slate-400 text-[10px] font-bold">
                                            <FaDiscord className="text-[#5865F2]" /> {member.discord}
                                        </div>
                                    )}
                                    {/* Placeholder for future badge number or stats */}
                                    <div className="flex items-center gap-2 text-slate-500 text-[10px]">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active Duty
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Decorative Border */}
                        <div className={`absolute inset-0 border border-white/0 group-hover:border-white/5 rounded-2xl transition-colors pointer-events-none`}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
