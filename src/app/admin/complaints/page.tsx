"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, updateDocument } from "@/lib/firestoreUtils";
import { FaExclamationCircle, FaUser, FaPhone, FaCheck, FaTimes, FaInbox } from "react-icons/fa";

interface Complaint {
    id: string;
    name: string;
    contact: string;
    details: string;
    status: string;
    createdAt: any;
}

export default function AdminComplaintsPage() {
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchComplaints = async () => {
        const data = await getAllDocuments<Complaint>("complaints");
        setComplaints(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchComplaints();
    }, []);

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateDocument("complaints", id, { status: newStatus });
        fetchComplaints();
    };

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                        <FaExclamationCircle size={24} />
                    </div>
                    Citizen Complaints
                </h1>
                <p className="text-slate-500 mt-1 ml-12">Review and adjudicate formal complaints submitted by citizens.</p>
            </div>

            {loading ? (
                <div className="p-12 text-center text-slate-500 animate-pulse">Loading complaints...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {complaints.map(c => (
                        <div key={c.id} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/20">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
                                        <FaUser />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-200">{c.name}</h3>
                                        <div className="flex items-center gap-1 text-xs text-slate-500">
                                            <FaPhone size={10} /> {c.contact}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${c.status === 'Resolved' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                                        c.status === 'Dismissed' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    }`}>
                                    {c.status}
                                </span>
                            </div>

                            <div className="p-5 flex-1 relative">
                                <div className="absolute top-0 left-0 w-1 h-full bg-slate-100 dark:bg-slate-800" />
                                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-3 line-clamp-4">
                                    "{c.details}"
                                </p>
                            </div>

                            <div className="p-4 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                                <button
                                    onClick={() => handleStatusChange(c.id, 'Resolved')}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                >
                                    <FaCheck size={14} /> Resolve
                                </button>
                                <div className="w-px bg-slate-200 dark:bg-slate-700 my-1" />
                                <button
                                    onClick={() => handleStatusChange(c.id, 'Dismissed')}
                                    className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-bold text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                                >
                                    <FaTimes size={14} /> Dismiss
                                </button>
                            </div>
                        </div>
                    ))}
                    {complaints.length === 0 && (
                        <div className="col-span-full py-20 flex flex-col items-center text-slate-400">
                            <FaInbox size={48} className="mb-4 opacity-20" />
                            <p>No complaints filed currently.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
