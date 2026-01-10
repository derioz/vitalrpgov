"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import { collection, query, where, orderBy, getDocs, updateDoc, doc, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaExclamationCircle, FaUser, FaPhone, FaCheck, FaTimes, FaInbox, FaFilter, FaPaperPlane, FaShieldAlt } from "react-icons/fa";

interface Message {
    sender: string;
    role: 'civilian' | 'official';
    content: string;
    timestamp: string;
}

interface Complaint {
    id: string;
    name: string;
    contact: string;
    details: string;
    status: string;
    department: string;
    accessCode: string;
    createdAt: any;
    messages: Message[];
    isReadByAdmin: boolean;
}

export default function AdminComplaintsPage() {
    const { userProfile } = useAuth();
    const searchParams = useSearchParams();
    const [complaints, setComplaints] = useState<Complaint[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDept, setFilterDept] = useState('ALL');
    const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    // Determine allowed departments
    const isAdmin = userProfile?.roles?.includes('admin');
    const userDepts = userProfile?.roles?.filter(r => ['lspd', 'lsems', 'safd', 'doj'].includes(r)) || [];

    // Auto-set filter if not admin and has only one dept role
    // Auto-set filter: URL param -> single role -> ALL
    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            setFilterDept(deptParam);
        } else if (!isAdmin && userDepts.length === 1) {
            setFilterDept(userDepts[0].toUpperCase());
        }
    }, [isAdmin, userDepts, searchParams]);

    const fetchComplaints = async () => {
        setLoading(true);
        try {
            let q;
            const collectionRef = collection(db, 'complaints');

            if (filterDept !== 'ALL') {
                q = query(collectionRef, where('department', '==', filterDept), orderBy('createdAt', 'desc'));
            } else {
                q = query(collectionRef, orderBy('createdAt', 'desc'));
            }

            const snapshot = await getDocs(q);
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Complaint));

            // Client-side filter for non-admins (security layer)
            const filteredData = isAdmin ? data : data.filter(c =>
                userDepts.includes(c.department.toLowerCase())
            );

            setComplaints(filteredData);
        } catch (error) {
            console.error("Error fetching complaints:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchComplaints();
    }, [filterDept]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        if (!confirm(`Mark this complaint as ${newStatus}?`)) return;
        await updateDoc(doc(db, 'complaints', id), { status: newStatus });
        fetchComplaints();
        if (selectedComplaint?.id === id) {
            setSelectedComplaint(prev => prev ? { ...prev, status: newStatus } : null);
        }
    };

    const handleView = async (complaint: Complaint) => {
        setSelectedComplaint(complaint);
        // Mark as read by admin if unread
        if (!complaint.isReadByAdmin) {
            await updateDoc(doc(db, 'complaints', complaint.id), { isReadByAdmin: true });
            // Update local list to reflect read status
            setComplaints(prev => prev.map(c => c.id === complaint.id ? { ...c, isReadByAdmin: true } : c));
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !selectedComplaint) return;

        setSending(true);
        try {
            const newMessage: Message = {
                sender: userProfile?.icName || 'Official',
                role: 'official',
                content: replyText,
                timestamp: new Date().toISOString()
            };

            await updateDoc(doc(db, 'complaints', selectedComplaint.id), {
                messages: arrayUnion(newMessage),
                isReadByUser: false, // Mark unread for user
                status: 'Under Investigation' // Auto-update status on reply
            });

            // Update local state
            const updatedComplaint = {
                ...selectedComplaint,
                messages: [...(selectedComplaint.messages || []), newMessage],
                status: 'Under Investigation'
            };
            setSelectedComplaint(updatedComplaint);
            setComplaints(prev => prev.map(c => c.id === selectedComplaint.id ? updatedComplaint : c));
            setReplyText('');
        } catch (err) {
            console.error(err);
            alert("Failed to send reply.");
        } finally {
            setSending(false);
        }
    };

    const [viewMode, setViewMode] = useState<'active' | 'history'>('active');

    // ... (existing code, keep filters)

    const filteredComplaints = complaints.filter(c => {
        const isResolved = ['Resolved', 'Dismissed'].includes(c.status);
        return viewMode === 'active' ? !isResolved : isResolved;
    });

    return (
        <div className="p-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            <div className="mb-6 flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg text-red-600">
                            <FaExclamationCircle size={24} />
                        </div>
                        Internal Affairs
                    </h1>
                    <p className="text-slate-500 mt-1 ml-12">Adjudicate citizen complaints and conduct internal investigations.</p>
                </div>

                <div className="flex flex-col gap-3 items-end">
                    {/* View Mode Toggles */}
                    <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-lg flex">
                        <button
                            onClick={() => setViewMode('active')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'active'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            Active Cases
                        </button>
                        <button
                            onClick={() => setViewMode('history')}
                            className={`px-4 py-2 rounded-md text-sm font-bold transition-all ${viewMode === 'history'
                                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                                : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
                                }`}
                        >
                            Case History
                        </button>
                    </div>

                    {isAdmin && (
                        <div className="flex gap-2">
                            {['ALL', 'LSPD', 'LSEMS', 'SAFD', 'DOJ'].map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setFilterDept(dept)}
                                    className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all ${filterDept === dept
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-6 flex-1 overflow-hidden">
                {/* List Column */}
                <div className={`flex-1 overflow-y-auto pr-2 space-y-4 ${selectedComplaint ? 'hidden md:block md:w-1/3 md:flex-none' : 'w-full'}`}>
                    {loading ? (
                        <div className="text-center py-20 text-slate-500 animate-pulse">Loading cases...</div>
                    ) : filteredComplaints.length === 0 ? (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                            <FaInbox size={40} className="mx-auto text-slate-300 mb-4" />
                            <p className="text-slate-500 font-bold">No {viewMode} cases found.</p>
                        </div>
                    ) : (
                        filteredComplaints.map(c => (
                            <div
                                key={c.id}
                                onClick={() => handleView(c)}
                                className={`cursor-pointer p-5 rounded-2xl border transition-all ${selectedComplaint?.id === c.id
                                    ? 'bg-blue-50 border-blue-500 shadow-md dark:bg-blue-900/20 dark:border-blue-500'
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-blue-700'
                                    } ${!c.isReadByAdmin && viewMode === 'active' ? 'border-l-4 border-l-red-500' : ''}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{c.department} • {c.accessCode}</span>
                                    {!c.isReadByAdmin && viewMode === 'active' && <span className="w-2 h-2 rounded-full bg-red-500"></span>}
                                </div>
                                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{c.name}</h3>
                                <p className="text-sm text-slate-500 line-clamp-2">{c.details}</p>
                                <div className="flex items-center gap-3 mt-3 text-xs font-mono text-slate-400">
                                    <span className={`px-2 py-0.5 rounded ${c.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                                        c.status === 'Dismissed' ? 'bg-red-100 text-red-700' :
                                            'bg-amber-100 text-amber-700'
                                        }`}>{c.status}</span>
                                    <span>{c.createdAt?.toDate ? c.createdAt.toDate().toLocaleDateString() : 'N/A'}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Detail Column */}
                {selectedComplaint ? (
                    <div className="flex-[2] bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-fade-in relative z-10 w-full md:w-auto absolute md:relative inset-0 md:inset-auto">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                            <div>
                                <button onClick={() => setSelectedComplaint(null)} className="md:hidden text-sm text-slate-500 mb-2">← Back to List</button>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                                    {selectedComplaint.name}
                                    <span className="text-sm font-normal text-slate-400 font-mono">({selectedComplaint.contact})</span>
                                </h2>
                                <div className="text-xs font-mono text-slate-400 mt-1 select-all">Code: {selectedComplaint.accessCode}</div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleStatusChange(selectedComplaint.id, 'Resolved')}
                                    className="p-2 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-colors"
                                    title="Mark Resolved"
                                >
                                    <FaCheck />
                                </button>
                                <button
                                    onClick={() => handleStatusChange(selectedComplaint.id, 'Dismissed')}
                                    className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                                    title="Dismiss"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50 dark:bg-black/20">
                            {/* Original Complaint */}
                            <div className="bg-amber-50 dark:bg-amber-900/10 p-6 rounded-2xl border border-amber-100 dark:border-amber-900/20">
                                <h4 className="text-xs font-bold text-amber-600 uppercase mb-2 flex items-center gap-2">
                                    <FaExclamationCircle /> Original Incident Report
                                </h4>
                                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{selectedComplaint.details}</p>
                            </div>

                            {/* Thread */}
                            {(selectedComplaint.messages || []).map((msg, idx) => (
                                <div key={idx} className={`flex ${msg.role === 'official' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm ${msg.role === 'official'
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

                        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
                            <form onSubmit={handleReply} className="flex gap-3">
                                <input
                                    type="text"
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    placeholder="Type an official response..."
                                    className="flex-1 bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    disabled={sending}
                                    className="bg-blue-600 hover:bg-blue-500 text-white p-4 rounded-xl transition-colors disabled:opacity-50"
                                >
                                    {sending ? <span className="animate-spin text-xl">↻</span> : <FaPaperPlane />}
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="hidden md:flex flex-[2] bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 items-center justify-center flex-col text-slate-400">
                        <FaShieldAlt size={64} className="mb-4 opacity-20" />
                        <p>Select a case to view details and respond.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
