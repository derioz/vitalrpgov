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

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                    <h3 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <FaBalanceScale className="text-slate-400" /> Current Legislation ({laws.length})
                    </h3>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500 animate-pulse">Loading laws database...</div>
                ) : (
                    <ul className="divide-y divide-slate-100 dark:divide-slate-800">
                        {laws.map(law => (
                            <li key={law.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-sm">
                                        §
                                    </div>
                                    <span className="font-medium text-slate-700 dark:text-slate-200 text-lg">{law.title}</span>
                                </div>
                                <button
                                    onClick={() => handleDelete(law.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                    title="Delete Law"
                                >
                                    <FaTrash />
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
