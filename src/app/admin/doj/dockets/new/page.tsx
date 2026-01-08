"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { FaGavel, FaSave, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

export default function NewDocketPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        caseNumber: '',
        date: '',
        time: '',
        location: 'Mission Row Courthouse, Courtroom 1',
        presidingJudge: '',
        description: '',
        status: 'Scheduled'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await addDoc(collection(db, 'dockets'), {
                ...formData,
                createdBy: user?.uid,
                createdAt: serverTimestamp(),
                department: 'DOJ'
            });
            router.push('/admin/doj/dockets');
        } catch (error) {
            console.error("Error creating docket:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <Link href="/admin/doj/dockets" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-6 transition-colors">
                <FaArrowLeft /> Back to Dockets
            </Link>

            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
                    <span className="p-3 bg-amber-500/10 text-amber-500 rounded-xl"><FaGavel /></span>
                    Schedule New Docket
                </h1>
                <p className="text-slate-400">Create a new court case entry for the public docket.</p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6 bg-slate-900/50 p-8 rounded-2xl border border-slate-800">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Case Title / Type</label>
                        <input
                            required
                            type="text"
                            value={formData.title}
                            onChange={e => setFormData({ ...formData, title: e.target.value })}
                            placeholder="e.g. State of San Andreas v. John Doe"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Case Number</label>
                        <input
                            required
                            type="text"
                            value={formData.caseNumber}
                            onChange={e => setFormData({ ...formData, caseNumber: e.target.value })}
                            placeholder="e.g. CR-2024-001"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Presiding Judge</label>
                        <input
                            required
                            type="text"
                            value={formData.presidingJudge}
                            onChange={e => setFormData({ ...formData, presidingJudge: e.target.value })}
                            placeholder="e.g. Hon. Jane Smith"
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Schedule */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-slate-800">
                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Date</label>
                        <input
                            required
                            type="date"
                            value={formData.date}
                            onChange={e => setFormData({ ...formData, date: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Time</label>
                        <input
                            required
                            type="time"
                            value={formData.time}
                            onChange={e => setFormData({ ...formData, time: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                        />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Location</label>
                        <input
                            required
                            type="text"
                            value={formData.location}
                            onChange={e => setFormData({ ...formData, location: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="pt-6 border-t border-slate-800">
                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase tracking-wider">Case Description / Notes</label>
                    <textarea
                        rows={4}
                        value={formData.description}
                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Brief details about the charges or hearing type..."
                        className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                    ></textarea>
                </div>

                <div className="pt-6 flex justify-end">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`
                            px-8 py-4 rounded-xl font-bold uppercase tracking-wider flex items-center gap-2 transition-all
                            ${isSubmitting ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-600 hover:bg-amber-500 text-white shadow-lg shadow-amber-900/20'}
                        `}
                    >
                        <FaSave /> {isSubmitting ? 'Scheduling...' : 'Schedule Docket'}
                    </button>
                </div>

            </form>
        </div>
    );
}
