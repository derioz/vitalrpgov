"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
    collection, query, where, orderBy, getDocs, addDoc, deleteDoc, doc, serverTimestamp, updateDoc
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaUserShield, FaPlus, FaTrash, FaDiscord, FaIdBadge, FaFilter, FaCamera, FaSave, FaTimes, FaEdit, FaSpinner, FaCloudUploadAlt } from 'react-icons/fa';

interface RosterMember {
    id: string;
    name: string;
    rank: string;
    department: string;
    discord: string;
    image?: string;
}

function AdminRosterContent() {
    const { userProfile } = useAuth();
    const searchParams = useSearchParams();
    const [members, setMembers] = useState<RosterMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterDept, setFilterDept] = useState('ALL');
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [newName, setNewName] = useState('');
    const [newRank, setNewRank] = useState('');
    const [newDiscord, setNewDiscord] = useState('');
    const [newImage, setNewImage] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const isAdmin = userProfile?.roles?.includes('admin');
    const userDepts = userProfile?.roles?.filter(r => ['lspd', 'lsems', 'safd', 'doj'].includes(r)).map(r => r.toUpperCase()) || [];
    // Superadmin check will be added later, assuming current admin roles for now

    // Auto-set filter
    useEffect(() => {
        const deptParam = searchParams.get('dept');
        if (deptParam) {
            setFilterDept(deptParam);
        } else if (!isAdmin && userDepts.length === 1) {
            setFilterDept(userDepts[0]);
        }
    }, [isAdmin, userDepts, searchParams]);

    // Fetch Members
    const fetchMembers = async () => {
        setLoading(true);
        try {
            let q;
            if (filterDept !== 'ALL') {
                q = query(
                    collection(db, 'rosters'),
                    where('department', '==', filterDept),
                    orderBy('rank', 'asc')
                );
            } else {
                q = query(collection(db, 'rosters'));
            }

            try {
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as RosterMember));
                setMembers(data);
            } catch (err) {
                // Fallback if index missing
                const qFallback = query(collection(db, 'rosters'), where('department', '==', filterDept));
                const snapFallback = await getDocs(qFallback);
                const dataFallback = snapFallback.docs.map(doc => ({ id: doc.id, ...doc.data() } as RosterMember));
                setMembers(dataFallback);
            }

        } catch (error) {
            console.error("Error fetching roster:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (filterDept) fetchMembers();
    }, [filterDept]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName || !newRank) return;
        if (filterDept === 'ALL') {
            alert("Please select a specific department first.");
            return;
        }

        setSubmitting(true);
        try {
            // 1. Upload Image if selected
            let imageUrl = newImage;
            if (imageFile) {
                const storageRef = ref(storage, `rosters/${filterDept.toLowerCase()}/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                imageUrl = await getDownloadURL(storageRef);
            }

            const memberData = {
                name: newName,
                rank: newRank,
                discord: newDiscord,
                image: imageUrl,
                department: filterDept,
                updatedAt: serverTimestamp()
            };

            if (editingId) {
                // UPDATE
                await updateDoc(doc(db, 'rosters', editingId), memberData);
            } else {
                // CREATE
                await addDoc(collection(db, 'rosters'), {
                    ...memberData,
                    createdAt: serverTimestamp()
                });
            }

            setShowModal(false);
            resetForm();
            fetchMembers();
        } catch (error) {
            console.error("Error saving member:", error);
            alert("Failed to save member.");
        } finally {
            setSubmitting(false);
        }
    };

    const resetForm = () => {
        setEditingId(null);
        setNewName('');
        setNewRank('');
        setNewDiscord('');
        setNewImage('');
        setImageFile(null);
    };

    const openEditModal = (member: RosterMember) => {
        setEditingId(member.id);
        setNewName(member.name);
        setNewRank(member.rank);
        setNewDiscord(member.discord);
        setNewImage(member.image || '');
        setFilterDept(member.department); // Ensure context is correct
        setShowModal(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to remove this member?")) return;
        try {
            await deleteDoc(doc(db, 'rosters', id));
            setMembers(prev => prev.filter(m => m.id !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to delete.");
        }
    };

    return (
        <div className="p-8 h-[calc(100vh-64px)] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="mb-8 flex justify-between items-center bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                            <FaUserShield size={24} />
                        </div>
                        Roster Management
                    </h1>
                    <p className="text-slate-500 mt-1 ml-12">Manage personnel listings for department pages.</p>
                </div>

                <div className="flex items-center gap-4">
                    {isAdmin && (
                        <div className="flex gap-2 mr-4">
                            {['LSPD', 'LSEMS', 'SAFD', 'DOJ'].map(dept => (
                                <button
                                    key={dept}
                                    onClick={() => setFilterDept(dept)}
                                    className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filterDept === dept
                                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-lg'
                                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400'
                                        }`}
                                >
                                    {dept}
                                </button>
                            ))}
                        </div>
                    )}
                    {filterDept !== 'ALL' && (
                        <button
                            onClick={() => { resetForm(); setShowModal(true); }}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-indigo-500/20"
                        >
                            <FaPlus /> Add Member
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse">Loading roster...</div>
                ) : members.length === 0 ? (
                    <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <FaUserShield size={40} className="mx-auto text-slate-300 mb-4" />
                        <p className="text-slate-500 font-bold">No members found for {filterDept === 'ALL' ? 'any department' : filterDept}.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {members.map(member => (
                            <div key={member.id} className="group relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 hover:shadow-xl transition-all hover:-translate-y-1">
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-900 p-1 rounded-lg border border-slate-100 dark:border-slate-800 shadow-sm">
                                    <button
                                        onClick={() => openEditModal(member)}
                                        className="p-2 text-indigo-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(member.id)}
                                        className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>

                                <div className="flex items-center gap-4 mb-4">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700">
                                        {member.image ? (
                                            <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-300">
                                                <FaUserShield size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 dark:text-slate-100">{member.name}</h3>
                                        <p className="text-xs font-mono uppercase text-indigo-500 font-bold">{member.rank}</p>
                                    </div>
                                </div>

                                {member.discord && (
                                    <div className="flex items-center gap-2 text-slate-500 text-sm border-t border-slate-100 dark:border-slate-800 pt-4">
                                        <FaDiscord className="text-[#5865F2]" />
                                        <span>{member.discord}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scale-in border border-slate-200 dark:border-slate-800">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                {editingId ? <FaEdit className="text-amber-500" /> : <FaPlus className="text-indigo-500" />}
                                {editingId ? 'Edit Member' : `Add ${filterDept} Member`}
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Full Name</label>
                                <div className="relative">
                                    <FaIdBadge className="absolute top-3 left-3 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={newName}
                                        onChange={e => setNewName(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                        placeholder="e.g. John Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Rank / Title</label>
                                <div className="relative">
                                    <FaUserShield className="absolute top-3 left-3 text-slate-400" />
                                    <input
                                        type="text"
                                        required
                                        value={newRank}
                                        onChange={e => setNewRank(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                        placeholder="e.g. Chief of Police"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Discord Username (Optional)</label>
                                <div className="relative">
                                    <FaDiscord className="absolute top-3 left-3 text-slate-400" />
                                    <input
                                        type="text"
                                        value={newDiscord}
                                        onChange={e => setNewDiscord(e.target.value)}
                                        className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                                        placeholder="e.g. user#1234"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Portrait Image</label>
                                <div className="space-y-3">
                                    {/* Upload Input */}
                                    <div className="relative">
                                        <FaCloudUploadAlt className="absolute top-3 left-3 text-slate-400" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-10 text-sm text-slate-500 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                        />
                                    </div>

                                    {/* OR URL Input */}
                                    <div className="relative">
                                        <FaCamera className="absolute top-3 left-3 text-slate-400" />
                                        <input
                                            type="url"
                                            value={newImage}
                                            onChange={e => setNewImage(e.target.value)}
                                            className="w-full bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl py-2.5 pl-10 pr-4 outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium text-sm"
                                            placeholder="OR paste Image URL directly"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:transform-none mt-4 flex items-center justify-center gap-2"
                            >
                                {submitting && <FaSpinner className="animate-spin" />}
                                {submitting ? 'Saving...' : 'Save Member'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function AdminRosterPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Loading Roster System...</div>}>
            <AdminRosterContent />
        </Suspense>
    );
}
