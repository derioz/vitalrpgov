"use client";

import { useState, useEffect } from "react";
import { addDocument } from "@/lib/firestoreUtils";
import { useAuth } from "@/context/AuthContext";
import { FaLock, FaUserShield } from "react-icons/fa";

export default function ComplaintsPage() {
    const { userProfile, user } = useAuth();
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [details, setDetails] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auto-fill and lock name if logged in
    useEffect(() => {
        if (userProfile?.icName) {
            setName(userProfile.icName);
        }
    }, [userProfile]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        try {
            await addDocument("complaints", {
                name,
                contact,
                details,
                status: "Pending",
                // Security Fields
                authorId: user?.uid || null,
                verified: !!user, // True if logged in
                department: "DOJ" // Defaulting to DOJ context, or generic
            });
            setSubmitted(true);
        } catch (error) {
            console.error(error);
            alert("Failed to submit complaint.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="container mx-auto max-w-lg p-8 text-center bg-slate-900 rounded-3xl border border-slate-800 mt-12">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUserShield size={32} />
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Complaint Filed</h1>
                <p className="text-slate-400 mb-6">Thank you. Your complaint has been securely filed and will be reviewed by the administration.</p>
                <button
                    className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-bold"
                    onClick={() => { setSubmitted(false); setDetails(""); if (!user) setName(""); }}
                >
                    Submit Another
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-xl py-12">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-black text-white mb-2">File a Complaint</h1>
                <p className="text-slate-400">Submit a formal grievance to the Government.</p>
            </div>

            <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Your Name</label>
                        <div className="relative">
                            <input
                                value={name}
                                onChange={e => !user && setName(e.target.value)}
                                required
                                readOnly={!!user}
                                className={`w-full bg-slate-950 border ${user ? 'border-emerald-500/30' : 'border-slate-800'} rounded-xl py-3 px-4 text-white outline-none focus:border-indigo-500 transition-colors`}
                                placeholder="Your Full Name"
                            />
                            {user && (
                                <FaLock className="absolute right-4 top-3.5 text-emerald-500" title="Verified Identity Locked" />
                            )}
                        </div>
                        {user && <p className="text-[10px] text-emerald-500 mt-1 flex items-center gap-1"><FaUserShield /> Verified Identity</p>}
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Contact Info (Phone/Email)</label>
                        <input
                            value={contact}
                            onChange={e => setContact(e.target.value)}
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-indigo-500 transition-colors"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Complaint Details</label>
                        <textarea
                            value={details}
                            onChange={e => setDetails(e.target.value)}
                            required
                            rows={6}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-4 text-white outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                </form>
            </div>
        </div>
    );
}
