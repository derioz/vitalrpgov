"use client";

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { addDocument } from '@/lib/firestoreUtils';
import { FaPaperPlane, FaTimes, FaClipboardCheck, FaExclamationTriangle } from 'react-icons/fa';

interface ComplaintFormProps {
    department: 'LSPD' | 'LSEMS' | 'SAFD' | 'DOJ';
    isOpen: boolean;
    onClose: () => void;
}

export default function ComplaintForm({ department, isOpen, onClose }: ComplaintFormProps) {
    const { user, userProfile } = useAuth();
    const [name, setName] = useState(userProfile?.icName || '');
    const [contact, setContact] = useState('');
    const [details, setDetails] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [accessCode, setAccessCode] = useState<string | null>(null);

    if (!isOpen) return null;

    const generateAccessCode = () => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = 'CP-';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        const newAccessCode = generateAccessCode();

        try {
            await addDocument('complaints', {
                department,
                accessCode: newAccessCode,
                userId: user?.uid || null, // Link to account if logged in
                name,
                contact,
                details, // Initial summary
                status: 'Pending',
                isReadByAdmin: false,
                isReadByUser: true,
                messages: [
                    {
                        sender: name,
                        role: 'civilian',
                        content: details,
                        timestamp: new Date().toISOString()
                    }
                ]
            });
            setAccessCode(newAccessCode);
        } catch (error) {
            console.error("Error submitting complaint:", error);
            alert("Failed to submit complaint. Please try again.");
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">

                {/* Header */}
                <div className={`p-6 bg-slate-50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center`}>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <FaExclamationTriangle className="text-amber-500" />
                        File {department} Complaint
                    </h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-red-500 transition-colors">
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Success View */}
                {accessCode ? (
                    <div className="p-8 text-center space-y-6">
                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600 mx-auto text-3xl">
                            <FaClipboardCheck />
                        </div>
                        <div>
                            <h4 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Complaint Filed</h4>
                            <p className="text-slate-500">Your complaint has been securely transmitted to {department} Internal Affairs.</p>
                        </div>

                        <div className="bg-slate-100 dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800">
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Your Access Code</p>
                            <div className="text-4xl font-mono font-black text-slate-900 dark:text-white tracking-wider select-all">
                                {accessCode}
                            </div>
                            {!user && (
                                <p className="text-xs text-amber-500 mt-3 font-bold">
                                    SAVE THIS CODE. You will need it to check the status of your complaint.
                                </p>
                            )}
                            {user && (
                                <p className="text-xs text-blue-500 mt-3 font-bold">
                                    Since you are logged in, this complaint has been linked to your profile.
                                </p>
                            )}
                        </div>

                        <button
                            onClick={onClose}
                            className="w-full py-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
                        >
                            Close
                        </button>
                    </div>
                ) : (
                    /* Form View */
                    <form onSubmit={handleSubmit} className="p-6 space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Your Name</label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact (Phone)</label>
                                <input
                                    type="text"
                                    required
                                    value={contact}
                                    onChange={e => setContact(e.target.value)}
                                    className="w-full p-3 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-amber-500 outline-none"
                                    placeholder="555-0123"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Incident Details</label>
                            <textarea
                                required
                                value={details}
                                onChange={e => setDetails(e.target.value)}
                                className="w-full p-3 h-32 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:ring-2 focus:ring-amber-500 outline-none resize-none"
                                placeholder="Please describe the incident, including officer names, location, and time..."
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${isSubmitting
                                        ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                                        : 'bg-amber-500 hover:bg-amber-400 text-black shadow-lg shadow-amber-500/20'
                                    }`}
                            >
                                {isSubmitting ? 'Transmitting...' : <><FaPaperPlane /> Submit Complaint</>}
                            </button>
                        </div>

                        <p className="text-center text-xs text-slate-400">
                            By submitting, you attest that all information is true and accurate.
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
}
