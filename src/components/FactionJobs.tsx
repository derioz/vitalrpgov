"use client";

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ReactMarkdown from 'react-markdown';
import { FaBriefcase, FaMoneyBillWave, FaChevronRight } from 'react-icons/fa';

interface Job {
    id: string;
    title: string;
    department: string;
    salary: string;
    description: string;
    tags?: string[];
    createdAt: any;
}

interface FactionJobsProps {
    department: string;
    title: string;
    color: 'blue' | 'red' | 'orange' | 'amber';
    icon?: React.ElementType;
}

export default function FactionJobs({ department, title, color, icon: Icon = FaBriefcase }: FactionJobsProps) {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const colorClasses = {
        blue: {
            text: 'text-blue-500',
            bg: 'bg-blue-600',
            border: 'border-blue-500',
            glow: 'shadow-blue-500/20',
            btn: 'from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
        },
        red: {
            text: 'text-red-500',
            bg: 'bg-red-600',
            border: 'border-red-500',
            glow: 'shadow-red-500/20',
            btn: 'from-red-600 to-red-500 hover:from-red-500 hover:to-red-400'
        },
        orange: {
            text: 'text-orange-500',
            bg: 'bg-orange-600',
            border: 'border-orange-500',
            glow: 'shadow-orange-500/20',
            btn: 'from-orange-600 to-orange-500 hover:from-orange-500 hover:to-orange-400'
        },
        amber: {
            text: 'text-amber-500',
            bg: 'bg-amber-600',
            border: 'border-amber-500',
            glow: 'shadow-amber-500/20',
            btn: 'from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400'
        }
    }[color];

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Note: Ensure your Firestore has a composite index for department + createdAt if needed.
                // For small datasets, this often works without one, or Firestore will prompt for it.
                const q = query(
                    collection(db, 'jobs'),
                    where('department', '==', department),
                    orderBy('createdAt', 'desc'),
                    limit(5)
                );
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Job));
                setJobs(data);
            } catch (error) {
                console.error(`Error fetching ${department} jobs:`, error);
            } finally {
                setLoading(false);
            }
        };

        fetchJobs();
    }, [department]);

    return (
        <section>
            <div className="flex items-center gap-4 mb-8">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                    <Icon className={colorClasses.text} />
                    {title}
                </h2>
                <div className={`h-[1px] flex-1 bg-gradient-to-r from-slate-700 to-transparent`}></div>
            </div>

            <div className="grid gap-6">
                {loading ? (
                    <div className="h-40 bg-slate-900/50 animate-pulse rounded-2xl border border-white/5"></div>
                ) : jobs.length > 0 ? (
                    jobs.map((job) => (
                        <div key={job.id} className={`group relative bg-white/5 dark:bg-black/40 backdrop-blur-sm border border-slate-200 dark:border-white/5 rounded-2xl p-6 hover:border-${color}-500/30 transition-all duration-500 overflow-hidden shadow-sm dark:shadow-none`}>

                            {/* Hover Glow */}
                            <div className={`absolute inset-0 ${colorClasses.bg}/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none mix-blend-overlay`}></div>

                            <div className="flex flex-col md:flex-row gap-5 relative z-10">
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className={`text-xl font-bold text-slate-800 dark:text-white group-hover:${colorClasses.text} transition-colors`}>
                                            {job.title}
                                        </h3>
                                        {job.salary && (
                                            <span className="flex items-center gap-1 text-xs font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-950 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800">
                                                <FaMoneyBillWave className="text-green-500" /> {job.salary}
                                            </span>
                                        )}
                                    </div>

                                    {/* Tags Row */}
                                    {job.tags && job.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-2 mb-3">
                                            {job.tags.map(tag => (
                                                <span key={tag} className={`text-[10px] font-bold px-2 py-0.5 rounded bg-${color}-500/10 text-${color}-500 border border-${color}-500/20`}>
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="prose prose-slate dark:prose-invert prose-sm max-w-none text-slate-600 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-300 transition-colors line-clamp-2 mb-4">
                                        <ReactMarkdown>{job.description}</ReactMarkdown>
                                    </div>

                                    <button className={`flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r ${colorClasses.btn} text-white text-sm font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5`}>
                                        Apply Now <FaChevronRight />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-slate-500 dark:text-slate-400">
                        No active job openings in this department.
                    </div>
                )}
            </div>
        </section>
    );
}
