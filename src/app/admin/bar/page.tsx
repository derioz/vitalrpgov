"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument, addDocument } from "@/lib/firestoreUtils";
import { FaBalanceScale, FaUserPlus, FaTrash, FaPhone, FaCircle } from "react-icons/fa";

interface Member {
    id: string;
    name: string;
    status: string;
    phone?: string;
}

export default function AdminBarPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [newName, setNewName] = useState("");
    const [newStatus, setNewStatus] = useState("Active");
    const [newPhone, setNewPhone] = useState("");
    const [loading, setLoading] = useState(true);

    const fetchMembers = async () => {
        const data = await getAllDocuments<Member>("bar_members");
        setMembers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await addDocument("bar_members", { name: newName, status: newStatus, phone: newPhone });
        setNewName("");
        setNewPhone("");
        fetchMembers();
    };

    const handleDelete = async (id: string) => {
        if (confirm("Remove this member?")) {
            await deleteDocument("bar_members", id);
            fetchMembers();
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                        <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600">
                            <FaBalanceScale size={24} />
                        </div>
                        State Bar Association
                    </h1>
                    <p className="text-slate-500 mt-1 ml-12">Manage licensed attorneys and their status.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sticky top-[130px]">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <FaUserPlus className="text-blue-500" /> New Attorney
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                                <input
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newName}
                                    onChange={e => setNewName(e.target.value)}
                                    required
                                    placeholder="e.g. Saul Goodman"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact / Phone</label>
                                <input
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newPhone}
                                    onChange={e => setNewPhone(e.target.value)}
                                    required
                                    placeholder="555-0123"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Bar Status</label>
                                <select
                                    className="w-full p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={newStatus}
                                    onChange={e => setNewStatus(e.target.value)}
                                >
                                    <option value="Active">Active (Licensed)</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Disbarred">Disbarred</option>
                                </select>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-slate-900 dark:bg-slate-700 text-white font-bold py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-slate-600 transition-all shadow-lg hover:shadow-xl"
                            >
                                Register Member
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2">
                    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
                        <div className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                            <h3 className="font-bold text-slate-700 dark:text-slate-300">Registered Attorneys ({members.length})</h3>
                        </div>

                        {loading ? (
                            <div className="p-12 text-center text-slate-500 animate-pulse">Loading directory...</div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[600px] overflow-y-auto">
                                {members.map(m => (
                                    <div key={m.id} className="p-5 flex items-center justify-between group hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 font-serif font-bold text-lg">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-800 dark:text-slate-100">{m.name}</h4>
                                                <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                    <span className="flex items-center gap-1"><FaPhone size={10} /> {m.phone || 'N/A'}</span>
                                                    <span className={`flex items-center gap-1 font-bold ${m.status === 'Active' ? 'text-green-600' :
                                                            m.status === 'Suspended' ? 'text-amber-500' : 'text-red-600'
                                                        }`}>
                                                        <FaCircle size={6} /> {m.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(m.id)}
                                            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove Member"
                                        >
                                            <FaTrash />
                                        </button>
                                    </div>
                                ))}
                                {members.length === 0 && (
                                    <div className="p-8 text-center text-slate-400 italic">No members found.</div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
