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
                    orderBy('rank', 'asc') // Assuming alphabetical rank for now, or we can add a 'rankOrder' field
                );

                // Fallback if index doesn't exist yet, we'll sort client side
                // Actually let's just fetch all by dept and sort client side based on a logical rank structure if possible, 
                // but for now simple fetch.

                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RosterMember));
                setRoster(data);
            } catch (error) {
                console.error(`Error fetching ${department} roster:`, error);

                // Fallback query if 'rank' ordering fails due to missing index
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
    const colorClasses: Record<string, string> = {
        blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
        red: "text-red-500 bg-red-500/10 border-red-500/20",
        orange: "text-orange-500 bg-orange-500/10 border-orange-500/20",
        amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    };

    // Fallback classes
    const activeColorClass = colorClasses[color] || colorClasses.blue;
    const activeBorderColor = `border-${color}-500`; // Tailwind might not pick this up with dynamic construction, using safer approach later if needed

    if (loading) return <div className="text-center py-10 opacity-50 animate-pulse">Loading personnel data...</div>;

    // Always render section so anchor links work
    if (roster.length === 0) {
        return (
            <div id="roster" className="py-12 scroll-mt-24">
                <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 ${color === 'amber' ? 'text-amber-500' : color === 'red' ? 'text-red-500' : color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`}>
                    <span className={`w-1 h-3 rounded-full ${color === 'amber' ? 'bg-amber-500' : color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                    {title}
                </h3>
                <div className={`rounded-xl border border-dashed p-8 text-center ${color === 'amber' ? 'border-amber-500/20 bg-amber-500/5 text-amber-500/50' : color === 'red' ? 'border-red-500/20 bg-red-500/5 text-red-500/50' : color === 'orange' ? 'border-orange-500/20 bg-orange-500/5 text-orange-500/50' : 'border-blue-500/20 bg-blue-500/5 text-blue-500/50'}`}>
                    <FaUserShield className="mx-auto mb-3 text-3xl opacity-50" />
                    <p className="text-sm font-bold">Roster Pending Update</p>
                </div>
            </div>
        );
    }

    return (
        <div id="roster" className="py-12 scroll-mt-24">
            <h3 className={`text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-3 ${color === 'amber' ? 'text-amber-500' : color === 'red' ? 'text-red-500' : color === 'orange' ? 'text-orange-500' : 'text-blue-500'}`}>
                <span className={`w-1 h-3 rounded-full ${color === 'amber' ? 'bg-amber-500' : color === 'red' ? 'bg-red-500' : color === 'orange' ? 'bg-orange-500' : 'bg-blue-500'}`}></span>
                {title}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {roster.map((member) => (
                    <div key={member.id} className="relative group perspective-1000">
                        <div className="relative overflow-hidden bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:bg-slate-800/60 transition-all duration-500 hover:-translate-y-2 shadow-lg hover:shadow-[0_10px_30px_rgba(0,0,0,0.3)] group-hover:border-white/10">

                            {/* Glow Effect */}
                            <div className={`absolute top-0 right-0 w-24 h-24 ${color === 'amber' ? 'bg-amber-500/10' : color === 'red' ? 'bg-red-500/10' : color === 'orange' ? 'bg-orange-500/10' : 'bg-blue-500/10'} blur-3xl -mr-10 -mt-10 rounded-full group-hover:opacity-100 transition-opacity opacity-50`}></div>

                            <div className="flex items-center gap-4 mb-4 relative z-10">
                                <div className={`w-16 h-16 rounded-full overflow-hidden border-2 shadow-lg ${color === 'amber' ? 'border-amber-500/30' : color === 'red' ? 'border-red-500/30' : color === 'orange' ? 'border-orange-500/30' : 'border-blue-500/30'}`}>
                                    {member.image ? (
                                        <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className={`w-full h-full flex items-center justify-center ${color === 'amber' ? 'bg-amber-900/20 text-amber-500' : color === 'red' ? 'bg-red-900/20 text-red-500' : color === 'orange' ? 'bg-orange-900/20 text-orange-500' : 'bg-blue-900/20 text-blue-500'}`}>
                                            <FaUserShield size={24} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-lg leading-tight">{member.name}</h4>
                                    <span className={`text-xs font-mono uppercase tracking-wider ${color === 'amber' ? 'text-amber-400' : color === 'red' ? 'text-red-400' : color === 'orange' ? 'text-orange-400' : 'text-blue-400'}`}>
                                        {member.rank}
                                    </span>
                                </div>
                            </div>

                            {member.discord && (
                                <div className="mt-4 pt-4 border-t border-white/5 flex items-center gap-2 text-slate-400 text-sm group-hover:text-white transition-colors">
                                    <FaDiscord className="text-[#5865F2]" />
                                    <span>{member.discord}</span>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
