"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument } from "@/lib/firestoreUtils";
import Link from "next/link";
import { FaBook, FaPlus, FaTrash, FaSearch } from "react-icons/fa";

interface PublicRecord {
    id: string;
    title: string;
    date: string;
    type: string;
}

export default function AdminRecordsPage() {
    const [records, setRecords] = useState<PublicRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const fetchRecords = async () => {
        const data = await getAllDocuments<PublicRecord>("records");
        setRecords(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this record?")) {
            await deleteDocument("records", id);
            fetchRecords();
        }
    };

    const filteredRecords = records.filter(r =>
        r.title.toLowerCase().includes(search.toLowerCase()) ||
        r.type.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <FaBook size={24} />
                        </div>
                        Public Records
                    </h1>
                    <p className="text-slate-500 mt-1 ml-12">Manage official government documents and public filings.</p>
                </div>
                <Link
                    href="/admin/records/new"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                    <FaPlus size={14} /> Create Record
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {/* Search Bar / Toolbar */}
                <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 flex gap-4">
                    <div className="relative flex-1 max-w-md">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search records..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                        />
                    </div>
                </div>

                {loading ? (
                    <div className="p-12 text-center text-slate-500 animate-pulse">Loading records database...</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
                                <tr>
                                    <th className="p-5 font-bold text-xs text-slate-500 uppercase tracking-wider">Title</th>
                                    <th className="p-5 font-bold text-xs text-slate-500 uppercase tracking-wider">Type</th>
                                    <th className="p-5 font-bold text-xs text-slate-500 uppercase tracking-wider">Date Filed</th>
                                    <th className="p-5 font-bold text-xs text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                {filteredRecords.map(r => (
                                    <tr key={r.id} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors duration-200">
                                        <td className="p-5 font-medium text-slate-700 dark:text-slate-200 group-hover:text-blue-600 transition-colors">
                                            {r.title}
                                        </td>
                                        <td className="p-5">
                                            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wide">
                                                {r.type}
                                            </span>
                                        </td>
                                        <td className="p-5 text-sm text-slate-500 font-mono">
                                            {r.date}
                                        </td>
                                        <td className="p-5 text-right">
                                            <button
                                                onClick={() => handleDelete(r.id)}
                                                className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                                title="Delete Record"
                                            >
                                                <FaTrash />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredRecords.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="p-12 text-center text-slate-400 italic">
                                            No records found matching your search.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
