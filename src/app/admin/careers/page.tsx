"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument } from "@/lib/firestoreUtils";
import Link from "next/link";
import { FaBriefcase, FaPlus, FaTrash, FaBuilding, FaClock } from "react-icons/fa";

interface Job {
    id: string;
    title: string;
    department: string;
}

export default function AdminCareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        const data = await getAllDocuments<Job>("jobs");
        setJobs(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleDelete = async (id: string) => {
        if (confirm("Delete this job posting?")) {
            await deleteDocument("jobs", id);
            fetchJobs();
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                            <FaBriefcase size={24} />
                        </div>
                        Manage Careers
                    </h1>
                    <p className="text-slate-500 mt-1 ml-12">Post and manage job openings across government departments.</p>
                </div>
                <Link
                    href="/admin/careers/new"
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-2"
                >
                    <FaPlus size={14} /> Post Job Openings
                </Link>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center text-slate-500 animate-pulse">Loading active listings...</div>
                ) : (
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                        {jobs.map(job => (
                            <div key={job.id} className="p-6 flex items-center justify-between group hover:bg-indigo-50/30 dark:hover:bg-indigo-900/10 transition-colors">
                                <div className="flex items-start gap-5">
                                    <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 flex items-center justify-center text-indigo-500 font-bold border border-indigo-100 dark:border-indigo-800">
                                        <FaBuilding />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 transition-colors">
                                            {job.title}
                                        </h3>
                                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                                            <span className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider">
                                                {job.department}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <FaClock size={12} /> Full Time
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm font-bold text-green-600 px-3 py-1 bg-green-50 dark:bg-green-900/20 rounded-full border border-green-100 dark:border-green-800/30">
                                        Open
                                    </span>
                                    <button
                                        onClick={() => handleDelete(job.id)}
                                        className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all opacity-0 group-hover:opacity-100"
                                        title="Remove Listing"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {jobs.length === 0 && (
                            <div className="p-12 text-center text-slate-400 italic flex flex-col items-center">
                                <FaBriefcase size={32} className="mb-3 opacity-20" />
                                No active job listings found.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
