"use client";

import { useState } from 'react';
import { collection, query, where, getDocs, updateDoc, doc, getDoc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaSearch, FaUser, FaShieldAlt, FaClock, FaPaperPlane } from 'react-icons/fa';

interface Message {
    sender: string;
    role: 'civilian' | 'official';
    content: string;
    timestamp: string;
}

interface ComplaintData {
    id: string;
    accessCode: string;
    status: string;
    department: string;
    messages: Message[];
    name: string;
    isReadByUser: boolean;
}

export default function ComplaintLookup() {
    const [accessCode, setAccessCode] = useState('');
    const [complaint, setComplaint] = useState<ComplaintData | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [reply, setReply] = useState('');
    const [sending, setSending] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!accessCode.trim()) return;

        setLoading(true);
        setError('');
        setComplaint(null);

        try {
            const q = query(collection(db, 'complaints'), where('accessCode', '==', accessCode.trim()));
            const snapshot = await getDocs(q);

            if (snapshot.empty) {
                setError('Invalid Access Code. Please check and try again.');
            } else {
                const docData = snapshot.docs[0];
                const data = { id: docData.id, ...docData.data() } as ComplaintData;
                setComplaint(data);

                // Mark as read by user if it wasn't
                if (!data.isReadByUser) {
                    await updateDoc(doc(db, 'complaints', docData.id), { isReadByUser: true });
                }
            }
        } catch (err) {
            console.error(err);
            setError('System error. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reply.trim() || !complaint) return;

        setSending(true);
        try {
            const newMessage: Message = {
                sender: complaint.name,
                role: 'civilian',
                content: reply,
                timestamp: new Date().toISOString()
            };

            const complaintRef = doc(db, 'complaints', complaint.id);
            await updateDoc(complaintRef, {
                messages: arrayUnion(newMessage),
                isReadByAdmin: false // Mark as unread for admin
            });

            // Update local state
            setComplaint(prev => prev ? {
                ...prev,
                messages: [...prev.messages, newMessage]
            } : null);
            setReply('');
        } catch (err) {
            console.error(err);
            alert("Failed to send reply.");
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Search Bar */}
            {!complaint && (
                <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-xl">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">Check Complaint Status</h3>
                    <form onSubmit={handleSearch} className="flex gap-2">
                        <input
                            type="text"
                            value={accessCode}
                            onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                            placeholder="Enter Check Code (e.g. CP-X9Y2)"
                            className="flex-1 bg-slate-900/50 border border-slate-700 text-white p-4 rounded-xl font-mono text-lg tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-8 rounded-xl font-bold transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Searching...' : <FaSearch />}
                        </button>
                    </form>
                    {error && <p className="text-red-400 mt-4 text-center bg-red-900/20 p-2 rounded-lg border border-red-500/20">{error}</p>}
                </div>
            )}

            {/* Complaint View */}
            {complaint && (
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 animate-fade-in-up">
                    {/* Header */}
                    <div className="p-6 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        <div>
                            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{complaint.department} INTERNAL AFFAIRS</span>
                            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">Case #{complaint.accessCode}</h2>
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider ${complaint.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                complaint.status === 'Dismissed' ? 'bg-red-100 text-red-700' :
                                    'bg-amber-100 text-amber-700'
                            }`}>
                            {complaint.status}
                        </div>
                    </div>

                    {/* Messages Area */}
                    <div className="h-96 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 bg-slate-100 dark:bg-slate-950/50">
                        <div className="space-y-6">
                            {complaint.messages.map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'civilian' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'civilian'
                                            ? 'bg-blue-600 text-white rounded-tr-none'
                                            : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                                        }`}>
                                        <div className="flex items-center gap-2 mb-2 text-xs opacity-70">
                                            {msg.role === 'official' ? <FaShieldAlt /> : <FaUser />}
                                            <span className="font-bold uppercase">{msg.sender}</span>
                                            <span>•</span>
                                            <span className="font-mono">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Reply Input */}
                    <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                        <form onSubmit={handleReply} className="flex gap-3">
                            <input
                                type="text"
                                value={reply}
                                onChange={(e) => setReply(e.target.value)}
                                placeholder="Type your reply..."
                                disabled={complaint.status !== 'Pending' && complaint.status !== 'Under Investigation'}
                                className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                            <button
                                type="submit"
                                disabled={sending || (complaint.status !== 'Pending' && complaint.status !== 'Under Investigation')}
                                className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {sending ? <span className="animate-spin text-xl">↻</span> : <FaPaperPlane />}
                            </button>
                        </form>
                        {complaint.status === 'Resolved' && (
                            <p className="text-center text-xs text-green-600 mt-2 font-bold">This case has been resolved. Replies are closed.</p>
                        )}
                    </div>

                    {/* Close Button */}
                    <button onClick={() => setComplaint(null)} className="w-full py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
                        Close Case View
                    </button>
                </div>
            )}
        </div>
    );
}
