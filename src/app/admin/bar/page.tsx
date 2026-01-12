"use client";

import { useEffect, useState } from "react";
import { getAllDocuments, deleteDocument, addDocument, updateDocument } from "@/lib/firestoreUtils";
import { FaBalanceScale, FaUserPlus, FaTrash, FaPhone, FaCircle, FaPencilAlt, FaCamera, FaSpinner } from "react-icons/fa";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";

interface Member {
    id: string;
    name: string;
    status: string;
    phone?: string;
    photoURL?: string;
    barNumber?: string;
    firm?: string;
}

export default function AdminBarPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: "",
        status: "Active",
        phone: "",
        photoURL: "",
        barNumber: "",
        firm: ""
    });

    const fetchMembers = async () => {
        setLoading(true);
        const data = await getAllDocuments<Member>("bar_members");
        setMembers(data);
        setLoading(false);
    };

    useEffect(() => {
        fetchMembers();
    }, []);

    const resetForm = () => {
        setFormData({
            name: "",
            status: "Active",
            phone: "",
            photoURL: "",
            barNumber: "",
            firm: ""
        });
        setEditingId(null);
    };

    const handleEdit = (m: Member) => {
        setEditingId(m.id);
        setFormData({
            name: m.name,
            status: m.status,
            phone: m.phone || "",
            photoURL: m.photoURL || "",
            barNumber: m.barNumber || "",
            firm: m.firm || ""
        });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `bar_members/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setFormData(prev => ({ ...prev, photoURL: downloadURL }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingId) {
                await updateDocument("bar_members", editingId, formData);
            } else {
                await addDocument("bar_members", formData);
            }
            resetForm();
            fetchMembers();
        } catch (error) {
            console.error("Submission failed", error);
            alert("Error saving member.");
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Remove this member? This action cannot be undone.")) {
            await deleteDocument("bar_members", id);
            fetchMembers();
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-slate-800 dark:text-slate-100 uppercase tracking-tighter">
                        <div className="p-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl text-indigo-600">
                            <FaBalanceScale size={24} />
                        </div>
                        State Bar Association
                    </h1>
                    <p className="text-slate-500 mt-1 ml-12 text-sm font-medium">Administrative Control Panel - Licensed Attorney Directory</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-4">
                    <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-3xl shadow-2xl border border-slate-200 dark:border-white/10 p-8 sticky top-[100px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-3 dark:text-white uppercase tracking-tight">
                                {editingId ? (
                                    <>
                                        <div className="p-2 bg-amber-500/20 rounded-lg text-amber-500"><FaPencilAlt /></div>
                                        Edit Attorney
                                    </>
                                ) : (
                                    <>
                                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500"><FaUserPlus /></div>
                                        New Attorney
                                    </>
                                )}
                            </h3>
                            {editingId && (
                                <button onClick={resetForm} className="text-[10px] font-black uppercase text-slate-500 hover:text-white transition-colors">
                                    Cancel
                                </button>
                            )}
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest pl-1">Full Name</label>
                                    <input
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        required
                                        placeholder="Saul Goodman"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest pl-1">Bar Number</label>
                                    <input
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all"
                                        value={formData.barNumber}
                                        onChange={e => setFormData({ ...formData, barNumber: e.target.value })}
                                        placeholder="#00123"
                                    />
                                </div>
                                <div className="col-span-1">
                                    <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest pl-1">Contact</label>
                                    <input
                                        className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                        placeholder="555-0199"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest pl-1">Firm / Organization</label>
                                <input
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all"
                                    value={formData.firm}
                                    onChange={e => setFormData({ ...formData, firm: e.target.value })}
                                    placeholder="Goodman & Associates"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest pl-1">Photo</label>
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-zinc-950/50 border border-white/10 overflow-hidden flex items-center justify-center shrink-0">
                                        {formData.photoURL ? (
                                            <img src={formData.photoURL} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <FaCamera className="text-zinc-700 text-xl" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <label className={`
                                            flex items-center justify-center w-full p-3 rounded-xl border border-dashed border-white/20 
                                            bg-white/5 hover:bg-white/10 cursor-pointer transition-all text-[10px] font-bold uppercase tracking-widest
                                            ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
                                        `}>
                                            {uploading ? (
                                                <><FaSpinner className="animate-spin mr-2" /> Uploading...</>
                                            ) : (
                                                'Choose Profile Photo'
                                            )}
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                        <p className="text-[9px] text-slate-500 mt-2 italic px-1">Recommended: Square aspect ratio (1:1)</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] font-black text-slate-500 uppercase mb-2 tracking-widest pl-1">Status</label>
                                <select
                                    className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950/50 focus:ring-2 focus:ring-blue-500 outline-none text-sm dark:text-white transition-all appearance-none cursor-pointer"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="Active">Active (Licensed)</option>
                                    <option value="Suspended">Suspended</option>
                                    <option value="Disbarred">Disbarred</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                className={`w-full font-black py-4 rounded-2xl transition-all shadow-xl text-sm uppercase tracking-widest mt-4
                                    ${editingId ? 'bg-amber-500 hover:bg-amber-400 text-black' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'}
                                `}
                            >
                                {editingId ? "Update Attorney Profile" : "Register Attorney"}
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-8">
                    <div className="bg-white dark:bg-zinc-900/40 backdrop-blur-sm rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/10 overflow-hidden">
                        <div className="p-6 border-b border-slate-200 dark:border-white/5 bg-slate-50/50 dark:bg-zinc-950/50 flex justify-between items-center">
                            <h3 className="font-black text-slate-700 dark:text-white text-xs uppercase tracking-widest">
                                Registered Directory ({members.length})
                            </h3>
                            <div className="text-[10px] font-bold text-slate-500">Sorted by newest</div>
                        </div>

                        {loading ? (
                            <div className="p-20 text-center">
                                <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                                <p className="mt-4 text-slate-500 font-bold text-sm uppercase tracking-widest pulse">Syncing with State Database...</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-white/5 max-h-[800px] overflow-y-auto custom-scrollbar">
                                {members.map(m => (
                                    <div key={m.id} className="p-5 flex items-center justify-between group hover:bg-white/5 transition-all duration-300">
                                        <div className="flex items-center gap-6">
                                            <div className="relative">
                                                <div className="w-14 h-14 rounded-2xl bg-zinc-800 border border-white/10 overflow-hidden shadow-lg group-hover:border-blue-500/50 transition-colors">
                                                    {m.photoURL ? (
                                                        <img src={m.photoURL} alt={m.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-zinc-600 font-black text-xl bg-gradient-to-br from-zinc-800 to-zinc-950">
                                                            {m.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-4 border-zinc-900 
                                                    ${m.status === 'Active' ? 'bg-green-500' : m.status === 'Suspended' ? 'bg-amber-500' : 'bg-red-500'}
                                                `}></div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <h4 className="font-black text-slate-800 dark:text-white text-base tracking-tight">{m.name}</h4>
                                                    <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-slate-500 tracking-tighter uppercase">{m.barNumber || 'No Bar #'}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-1.5 font-medium uppercase tracking-tight">
                                                    <span className="flex items-center gap-1.5"><FaPhone size={10} className="text-blue-500" /> {m.phone || 'N/A'}</span>
                                                    <span className="flex items-center gap-1.5 text-slate-400 underline decoration-indigo-500/50 underline-offset-2">{m.firm || 'Criminal Law'}</span>
                                                    <span className={`flex items-center gap-1.5 font-black ${m.status === 'Active' ? 'text-green-500' :
                                                        m.status === 'Suspended' ? 'text-amber-500' : 'text-red-500'
                                                        }`}>
                                                        {m.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(m)}
                                                className="p-3 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-blue-400/20"
                                                title="Edit Member"
                                            >
                                                <FaPencilAlt size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(m.id)}
                                                className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-red-500/20"
                                                title="Remove Member"
                                            >
                                                <FaTrash size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {members.length === 0 && (
                                    <div className="p-20 text-center">
                                        <FaBalanceScale className="mx-auto text-6xl text-slate-800 mb-4 opacity-20" />
                                        <p className="text-slate-500 font-bold text-sm uppercase tracking-widest italic">No attorneys registered in the system.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
