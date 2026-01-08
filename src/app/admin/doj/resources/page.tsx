"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { FaExternalLinkAlt, FaSave, FaCheck, FaExclamationTriangle } from 'react-icons/fa';

interface DojResources {
    penalCodeUrl: string;
    constitutionUrl: string;
    govCodeUrl: string;
    updatedAt?: any;
    lastEditor?: string;
}

const DEFAULT_URLS: DojResources = {
    penalCodeUrl: "https://docs.google.com/spreadsheets/d/1NWTm-yAQWqSVP04MgYjMlStI6WmwCSAhC-_F7ns3hDg/edit?gid=1736425476#gid=1736425476",
    constitutionUrl: "https://drive.google.com/file/d/1OFTLbR2HKYNjbkxSqQqtHUGfeFvtU090/preview",
    govCodeUrl: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview"
};

export default function DojResourcesAdminPage() {
    const { userProfile, loading } = useAuth();
    const [formData, setFormData] = useState<DojResources>(DEFAULT_URLS);
    const [isLoadingData, setIsLoadingData] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Permission Check
    const hasAccess = userProfile?.roles?.some(r => ['admin', 'doj'].includes(r));

    useEffect(() => {
        const fetchData = async () => {
            if (!userProfile) return;
            try {
                const docRef = doc(db, 'settings', 'doj_resources');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data() as DojResources);
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setIsLoadingData(false);
            }
        };
        fetchData();
    }, [userProfile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setStatus('idle');

        try {
            await setDoc(doc(db, 'settings', 'doj_resources'), {
                ...formData,
                updatedAt: serverTimestamp(),
                lastEditor: userProfile?.icName || 'Unknown'
            });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setStatus('error');
        } finally {
            setIsSaving(false);
        }
    };

    if (loading || isLoadingData) return <div className="p-8 text-slate-400 animate-pulse">Loading settings...</div>;

    if (!hasAccess) {
        return (
            <div className="p-8 text-center">
                <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-white">Access Denied</h1>
                <p className="text-slate-400 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <header className="mb-8 border-b border-slate-800 pb-6">
                <h1 className="text-3xl font-bold text-white mb-2">DOJ Resources</h1>
                <p className="text-slate-400">Manage external document links for the Department of Justice portal.</p>
            </header>

            <form onSubmit={handleSave} className="space-y-8">

                {/* Penal Code Section */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <label className="block text-sm font-bold text-amber-500 mb-2 uppercase tracking-wider">
                        Penal Code URL (Google Sheet)
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="url"
                            value={formData.penalCodeUrl}
                            onChange={(e) => setFormData({ ...formData, penalCodeUrl: e.target.value })}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-amber-500 focus:outline-none font-mono text-sm"
                            placeholder="https://docs.google.com/spreadsheets/..."
                        />
                        <a
                            href={formData.penalCodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Test Link"
                        >
                            <FaExternalLinkAlt />
                        </a>
                    </div>
                    <p className="mt-2 text-xs text-slate-500">
                        Recommend using the embed link format or published web link.
                    </p>
                </div>

                {/* Constitution Section */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <label className="block text-sm font-bold text-red-500 mb-2 uppercase tracking-wider">
                        Constitution URL (Google Drive/PDF)
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="url"
                            value={formData.constitutionUrl}
                            onChange={(e) => setFormData({ ...formData, constitutionUrl: e.target.value })}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-red-500 focus:outline-none font-mono text-sm"
                            placeholder="https://drive.google.com/..."
                        />
                        <a
                            href={formData.constitutionUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Test Link"
                        >
                            <FaExternalLinkAlt />
                        </a>
                    </div>
                </div>

                {/* Gov Code Section */}
                <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-800">
                    <label className="block text-sm font-bold text-green-500 mb-2 uppercase tracking-wider">
                        Government Code URL (Google Doc)
                    </label>
                    <div className="flex gap-4">
                        <input
                            type="url"
                            value={formData.govCodeUrl}
                            onChange={(e) => setFormData({ ...formData, govCodeUrl: e.target.value })}
                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-green-500 focus:outline-none font-mono text-sm"
                            placeholder="https://docs.google.com/document/..."
                        />
                        <a
                            href={formData.govCodeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-lg transition-colors"
                            title="Test Link"
                        >
                            <FaExternalLinkAlt />
                        </a>
                    </div>
                </div>

                {/* Action Bar */}
                <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-800">
                    {status === 'success' && (
                        <span className="text-green-500 flex items-center gap-2 animate-fade-in font-bold">
                            <FaCheck /> Saved Successfully
                        </span>
                    )}
                    {status === 'error' && (
                        <span className="text-red-500 font-bold">
                            Error Saving. Check Consol/Permissions.
                        </span>
                    )}
                    <button
                        type="submit"
                        disabled={isSaving}
                        className={`
                            px-8 py-3 rounded-lg font-bold uppercase tracking-wider flex items-center gap-2 transition-all
                            ${isSaving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
                        `}
                    >
                        <FaSave /> {isSaving ? 'Saving...' : 'Save Configuration'}
                    </button>
                </div>

            </form>
        </div>
    );
}
