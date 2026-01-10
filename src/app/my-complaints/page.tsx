"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaInbox, FaShieldAlt, FaComments, FaExclamationCircle } from 'react-icons/fa';
import Link from 'next/link';

interface Complaint {
    id: string;
    department: 'LSPD' | 'LSEMS' | 'SAFD' | 'DOJ';
    details: string;
    status: string;
    createdAt: any;
    isReadByUser: boolean;
    messages: Array<{
        sender: string;
        role: string;
        content: string;
        timestamp: string;
    }>;
}

export default function MyComplaintsPage() {
    const { user, loading } = useAuth();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [isLoadingData, setIsLoadingData] = useState(true);

    useEffect(() => {
        if (!user) {
            setIsLoadingData(false);
            return;
        }

        const q = query(
            collection(db, 'complaints'),
            where('authorId', '==', user.uid),
            orderBy('createdAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));
            setComplaints(data);
            setIsLoadingData(false);
        }, (err) => {
            console.error("Error fetching my complaints:", err);
            setIsLoadingData(false);
            // Likely index error if not working, but filtering by authorId + orderBy might require composite index
        });

        return () => unsubscribe();
    }, [user]);

    if (loading || isLoadingData) {
        return <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">Loading...</div>;
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                    <p className="mb-6">You need to be logged in to view your filed complaints.</p>
                    <Link href="/login" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold">Login</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-12 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
                            <FaInbox className="text-blue-500" /> My Complaints
                        </h1>
                        <p className="text-slate-500 mt-2">Track the status of your reports filed with Internal Affairs.</p>
                    </div>
                </div>

                <div className="space-y-4">
                    {complaints.length === 0 ? (
                        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 p-12 text-center">
                            <FaShieldAlt className="mx-auto text-4xl text-slate-300 mb-4" />
                            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Complaints Found</h3>
                            <p className="text-slate-500">You haven't filed any complaints yet.</p>
                        </div>
                    ) : (
                        complaints.map(c => (
                            <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow relative overflow-hidden">
                                {c.isReadByUser === false && (
                                    <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 m-4 rounded-full animate-pulse shadow-lg shadow-red-500/50" />
                                )}

                                <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${c.department === 'LSPD' ? 'bg-blue-100 text-blue-700' :
                                                c.department === 'LSEMS' ? 'bg-red-100 text-red-700' :
                                                    'bg-slate-100 text-slate-700'
                                            }`}>
                                            {c.department}
                                        </span>
                                        <span className="text-xs text-slate-400 font-mono">
                                            {c.createdAt?.seconds ? new Date(c.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </span>
                                    </div>
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold self-start md:self-auto ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                            c.status === 'Dismissed' ? 'bg-red-100 text-red-700' :
                                                'bg-amber-100 text-amber-700'
                                        }`}>
                                        {c.status}
                                    </div>
                                </div>

                                <p className="text-slate-700 dark:text-slate-300 mb-6 line-clamp-2 md:line-clamp-none">
                                    {c.details}
                                </p>

                                <div className="flex items-center gap-2 text-sm text-blue-500 font-bold group cursor-pointer hover:underline" onClick={() => {
                                    /* Ideally open a detail modal or expand... for now just static list with status */
                                    // Expand logic to be added if user requests full chat interface here
                                }}>
                                    <FaComments />
                                    {c.messages?.length || 0} Messages / Responses
                                    <span className="text-slate-400 text-xs font-normal no-underline ml-2">(Clicking details not implemented yet, check status tag)</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
