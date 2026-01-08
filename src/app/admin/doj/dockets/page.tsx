"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, deleteDoc, doc, where } from 'firebase/firestore';
import Link from 'next/link';
import { FaPlus, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaGavel, FaTrash, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

export default function DocketsAdminPage() {
    const { userProfile } = useAuth();
    const [dockets, setDockets] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this docket?')) {
            await deleteDoc(doc(db, 'dockets', id));
        }
    };

    if (loading) return <div className="p-8 text-slate-400">Loading dockets...</div>;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <header className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Court Dockets</h1>
                    <p className="text-slate-400">Manage upcoming court cases and schedules.</p>
                </div>
                <Link
                    href="/admin/doj/dockets/new"
                    className="bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-900/20"
                >
                    <FaPlus /> New Docket
                </Link>
            </header>

            <div className="grid gap-4">
                {dockets.map((docket) => (
                    <div key={docket.id} className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 group hover:border-amber-500/30 transition-all">

                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${docket.status === 'Scheduled' ? 'bg-blue-500/10 text-blue-400' :
                                        docket.status === 'Concluded' ? 'bg-green-500/10 text-green-400' :
                                            'bg-red-500/10 text-red-400'
                                    }`}>
                                    {docket.status}
                                </span>
                                <span className="text-slate-500 font-mono text-sm">#{docket.caseNumber}</span>
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">{docket.title}</h3>
                            <div className="flex flex-wrap gap-4 text-sm text-slate-400">
                                <span className="flex items-center gap-2"><FaCalendarAlt className="text-amber-500" /> {new Date(docket.date).toLocaleDateString()}</span>
                                <span className="flex items-center gap-2"><FaClock className="text-amber-500" /> {docket.time}</span>
                                <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-amber-500" /> {docket.location}</span>
                                <span className="flex items-center gap-2"><FaGavel className="text-amber-500" /> {docket.presidingJudge}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                onClick={() => handleDelete(docket.id)}
                                className="p-3 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
                                title="Delete Docket"
                            >
                                <FaTrash />
                            </button>
                        </div>

                    </div>
                ))}

                {dockets.length === 0 && (
                    <div className="text-center py-20 bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                        <FaGavel className="text-6xl text-slate-800 mx-auto mb-4" />
                        <h3 className="text-xl font-bold text-slate-500">No Dockets Scheduled</h3>
                        <p className="text-slate-600 mt-2">Create a new docket to get started.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
