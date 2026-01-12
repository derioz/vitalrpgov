"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument } from "@/lib/firestoreUtils";
import Link from "next/link";
import { FaGavel, FaPlus, FaTrash, FaBalanceScale } from "react-icons/fa";

interface Law {
    id: string;
    title: string;
}

export default function AdminLawsPage() {
    const [laws, setLaws] = useState<Law[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchLaws = async () => {
        const data = await getAllDocuments<Law>("laws");
        setLaws(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchLaws();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this law?")) {
            await deleteDocument("laws", id);
            fetchLaws();
        }
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                        <div className="p-2 bg-slate-200 dark:bg-slate-700/50 rounded-lg text-slate-700 dark:text-slate-200">
                            <FaGavel size={24} />
                        </div>
                        Legislation & Laws
                    </h1>
                    <p className="text-slate-500 mt-1 ml-12">Manage the penal code and state legislation.</p>
                </div>
                <Link
                    href="/admin/laws/new"
                    className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                    <FaPlus size={14} /> Add Law
                </Link>
            </div>

            <div className="bg-white dark:bg-black/40 backdrop-blur-sm rounded-2xl shadow-sm border border-slate-200 dark:border-white/5 overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-white/5">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 text-sm uppercase tracking-wider">
                        <FaBalanceScale className="text-slate-400" /> Current Legislation ({laws.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500 animate-pulse">Loading laws database...</div>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-white/5">
                        {laws.map(law => (
                            <li key={law.id} className="p-3 pl-4 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs border border-slate-200 dark:border-white/10">
                                        §
                                    </div>
                                    <span className="font-bold text-slate-700 dark:text-slate-200 text-sm">{law.title}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(law.id)}
                                    className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all opacity-0 group-hover:opacity-100 mr-2"
                                    title="Delete Law"
                                >
                                    <FaTrash size={12} />
                                </button>
                            </li>
                        ))}
                        {laws.length === 0 && (
                            <li className="p-12 text-center text-slate-400 italic">No laws found. Draft your first legislation above.</li>
                        )}
                    </ul>
                )}
            </div>
        </div>
    );
}
