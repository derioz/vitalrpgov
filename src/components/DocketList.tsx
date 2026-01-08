"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, where } from 'firebase/firestore';
import { FaCalendarAlt, FaClock, FaMapMarkerAlt, FaGavel, FaSpinner } from 'react-icons/fa';

export default function DocketList() {
    const [dockets, setDockets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Query for scheduled dockets, potentially filtering for future dates could be added here
        const q = query(collection(db, 'dockets'), orderBy('date', 'asc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setDockets(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12 text-amber-500/50">
                <FaSpinner className="animate-spin text-3xl" />
            </div>
        );
    }

    if (dockets.length === 0) {
        return (
            <div className="text-center p-8 border border-white/5 rounded-2xl bg-slate-900/30">
                <FaGavel className="mx-auto text-4xl text-slate-700 mb-3" />
                <p className="text-slate-500">No court cases currently on the docket.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4">
            {dockets.map((docket) => (
                <div
                    key={docket.id}
                    className="relative bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 hover:border-amber-500/30 transition-all duration-300 group overflow-hidden"
                >
                    {/* Status Strip */}
                    <div className={`absolute top-0 left-0 w-1 h-full ${docket.status === 'Scheduled' ? 'bg-blue-500' :
                            docket.status === 'Concluded' ? 'bg-green-500' :
                                'bg-red-500'
                        }`} />

                    <div className="flex flex-col md:flex-row gap-6 justify-between items-start">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-amber-500 font-mono text-xs uppercase tracking-widest bg-amber-500/10 px-2 py-1 rounded">
                                    {docket.caseNumber}
                                </span>
                                <span className={`text-xs font-bold uppercase tracking-wider ${docket.status === 'Scheduled' ? 'text-blue-400' :
                                        docket.status === 'Concluded' ? 'text-green-400' :
                                            'text-red-400'
                                    }`}>
                                    {docket.status}
                                </span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-100 group-hover:text-amber-400 transition-colors mb-2">
                                {docket.title}
                            </h3>

                            {docket.description && (
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2 md:line-clamp-none">
                                    {docket.description}
                                </p>
                            )}

                            <div className="flex flex-wrap gap-4 text-xs font-mono text-slate-500 uppercase tracking-wide">
                                <span className="flex items-center gap-2">
                                    <FaGavel className="text-amber-500" /> {docket.presidingJudge}
                                </span>
                            </div>
                        </div>

                        {/* Date/Time/Loc Block */}
                        <div className="flex flex-col gap-2 min-w-[200px] md:text-right">
                            <div className="flex items-center gap-2 md:justify-end text-slate-300">
                                <FaCalendarAlt className="text-amber-500" />
                                <span className="font-bold">{new Date(docket.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2 md:justify-end text-slate-400 text-sm">
                                <FaClock className="text-amber-500" />
                                <span>{docket.time}</span>
                            </div>
                            <div className="flex items-center gap-2 md:justify-end text-slate-500 text-xs mt-1">
                                <FaMapMarkerAlt className="text-amber-500" />
                                <span>{docket.location}</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
