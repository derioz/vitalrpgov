"use client";

import { useState, useEffect } from "react";
import { addDocument } from "@/lib/firestoreUtils";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FaLock, FaLockOpen } from "react-icons/fa";

const SUGGESTED_TAGS: Record<string, string[]> = {
    "LSPD": ["Sworn Officer", "Civilian", "High Command", "Detective", "SWAT", "Dispatcher", "Cadet"],
    "LSEMS": ["Doctor", "Nurse", "Paramedic", "Therapist", "High Command", "Surgeon"],
    "SAFD": ["Firefighter", "Pilot", "High Command", "Search & Rescue", "Inspector"],
    "DOJ": ["Judge", "Attorney", "Paralegal", "Clerk", "Justices"],
};

export default function NewJobPage() {
    const [title, setTitle] = useState("");
    const [department, setDepartment] = useState("");
    const [salary, setSalary] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();
    const { userProfile } = useAuth();
    const isAdmin = userProfile?.roles?.some(r => ['admin', 'superadmin'].includes(r));
    const [isLocked, setIsLocked] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const deptParam = params.get('dept');
        if (deptParam) {
            setDepartment(deptParam);
            setIsLocked(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDocument("jobs", {
                title,
                department,
                salary,
                description,
                tags,
                createdAt: new Date().toISOString()
            });
            router.push("/admin/careers");
        } catch (error) {
            console.error("Error adding document: ", error);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight">Post New Job</h2>
                    <p className="text-slate-400 mt-2">Create a new career opportunity listing.</p>
                </div>
            </div>

            <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Job Title</label>
                            <input
                                value={title}
                                onChange={e => setTitle(e.target.value)}
                                required
                                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="e.g. Senior Officer"
                            />
                        </div>
                        <div className="space-y-2 relative">
                            <div className="flex justify-between items-center">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    Department
                                    {isLocked && <FaLock className="text-slate-600" size={10} />}
                                </label>
                                {isLocked && isAdmin && (
                                    <button
                                        type="button"
                                        onClick={() => setIsLocked(false)}
                                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 uppercase tracking-widest transition-colors"
                                    >
                                        <FaLockOpen size={10} /> Override Lock
                                    </button>
                                )}
                            </div>
                            <select
                                value={department}
                                onChange={e => setDepartment(e.target.value)}
                                required
                                disabled={isLocked}
                                className={`w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors appearance-none ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                <option value="" disabled>Select Department</option>
                                <option value="LSPD">Los Santos Police (LSPD)</option>
                                <option value="LSEMS">Medical Services (LSEMS)</option>
                                <option value="SAFD">Fire Department (SAFD)</option>
                                <option value="DOJ">Department of Justice (DOJ)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Salary Range</label>
                        <input
                            value={salary}
                            onChange={e => setSalary(e.target.value)}
                            required
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
                            placeholder="$50,000 - $70,000"
                        />
                    </div>

                    <div className="space-y-4 pt-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Role Tags</label>

                        {/* Selected Tags */}
                        <div className="flex flex-wrap gap-2 min-h-[32px]">
                            {tags.map(tag => (
                                <span key={tag} className="bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => setTags(tags.filter(t => t !== tag))}
                                        className="hover:text-white transition-colors"
                                    >
                                        &times;
                                    </button>
                                </span>
                            ))}
                        </div>

                        {/* Input & Suggestions */}
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input
                                    value={newTag}
                                    onChange={e => setNewTag(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            if (newTag.trim() && !tags.includes(newTag.trim())) {
                                                setTags([...tags, newTag.trim()]);
                                                setNewTag("");
                                            }
                                        }
                                    }}
                                    className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors text-sm"
                                    placeholder="Type a tag and press Enter..."
                                />
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (newTag.trim() && !tags.includes(newTag.trim())) {
                                            setTags([...tags, newTag.trim()]);
                                            setNewTag("");
                                        }
                                    }}
                                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-colors"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Suggested Tags Area */}
                            {department && SUGGESTED_TAGS[department] && (
                                <div className="flex flex-wrap gap-2 animate-fade-in-up">
                                    <span className="text-xs text-slate-500 font-mono self-center mr-2">SUGGESTED:</span>
                                    {SUGGESTED_TAGS[department].filter(t => !tags.includes(t)).map(tag => (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => setTags([...tags, tag])}
                                            className="px-3 py-1 text-xs font-bold bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 rounded-lg transition-all"
                                        >
                                            + {tag}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Description</label>
                        <textarea
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                            rows={10}
                            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors resize-none"
                            placeholder="Detailed job description..."
                        />
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex justify-end">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold rounded-xl shadow-lg shadow-blue-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? "Publishing..." : "Post Job Opening"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
