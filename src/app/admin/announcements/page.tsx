"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { collection, query, orderBy, getDocs, deleteDoc, doc, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaTrash, FaPlus, FaBullhorn, FaFilter } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

import { useSearchParams } from 'next/navigation';

export default function AdminAnnouncementsPage() {
    const { userProfile } = useAuth(); // Get user roles
    const searchParams = useSearchParams();
    const deptParam = searchParams.get('dept');

    // Default filter to URL param or 'ALL'
    const [filterDept, setFilterDept] = useState(deptParam || 'ALL');
    const [announcements, setAnnouncements] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Sync state if URL changes
    useEffect(() => {
        if (deptParam) setFilterDept(deptParam);
        else setFilterDept('ALL');
    }, [deptParam]);

    useEffect(() => {
        fetchAnnouncements();
    }, [filterDept]); // Refetch when filter changes

    const fetchAnnouncements = async () => {
        setLoading(true);
        try {
            let q;
            if (filterDept !== 'ALL') {
                q = query(
                    collection(db, 'announcements'),
                    where('department', '==', filterDept),
                    orderBy('createdAt', 'desc')
                );
            } else {
                q = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'));
            }

            const querySnapshot = await getDocs(q);
            const data = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAnnouncements(data);
        } catch (error) {
            console.error("Error fetching announcements:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this announcement?')) {
            try {
                await deleteDoc(doc(db, 'announcements', id));
                fetchAnnouncements();
            } catch (error) {
                console.error("Error deleting:", error);
                alert("Failed to delete.");
            }
        }
    };

    // Determine allowed departments based on role
    const isAdmin = userProfile?.roles?.includes('admin');

    return (
        <div className="p-6 space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <FaBullhorn className="text-blue-500" />
                        {filterDept !== 'ALL' ? `${filterDept} Announcements` : 'All Announcements'}
                    </h1>
                    <p className="text-slate-400 mt-1">
                        {filterDept !== 'ALL' ? `Manage updates for the ${filterDept} portal.` : 'Broadcast updates to department portals.'}
                    </p>
                </div>
                <Link
                    href={`/admin/announcements/new?dept=${filterDept !== 'ALL' ? filterDept : ''}`}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-500 transition shadow-lg shadow-blue-600/20"
                >
                    <FaPlus /> New Announcement
                </Link>
            </div>

            {/* Filter Bar - Hide if Dept Param is Locked (Optional, but let's keep it for context if User is Admin) */}
            {!deptParam && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2">
                    <FaFilter className="text-slate-500 ml-2" />
                    <button
                        onClick={() => setFilterDept('ALL')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${filterDept === 'ALL' ? 'bg-white text-slate-900 border-white' : 'bg-slate-900/50 text-slate-400 border-white/10 hover:bg-white/10'}`}
                    >
                        ALL
                    </button>
                    {['LSPD', 'LSEMS', 'SAFD', 'DOJ'].map(dept => (
                        <button
                            key={dept}
                            onClick={() => setFilterDept(dept)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all border ${filterDept === dept ? 'bg-white text-slate-900 border-white' : 'bg-slate-900/50 text-slate-400 border-white/10 hover:bg-white/10'}`}
                        >
                            {dept}
                        </button>
                    ))}
                </div>
            )}

            {loading ? (
                <div className="text-center py-20 text-slate-500 animate-pulse">Loading feed...</div>
            ) : (
                <div className="grid gap-4">
                    {announcements.map((item) => (
                        <div key={item.id} className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:bg-slate-800/40 transition-colors group">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${item.department === 'LSPD' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                            item.department === 'LSEMS' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                                                item.department === 'SAFD' ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                                                    'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        }`}>
                                        {item.department}
                                    </span>
                                    <span className="text-slate-500 text-xs font-mono">
                                        {item.createdAt?.toDate().toLocaleDateString()}
                                    </span>
                                </div>
                                <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">{item.title}</h3>
                                <p className="text-slate-400 text-sm line-clamp-1">by {item.author}</p>
                            </div>

                            {/* Permission Check for Delete: Admin OR Author OR Matching Role */}
                            {(isAdmin || item.author === userProfile?.email) && (
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-3 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/20"
                                    title="Delete Announcement"
                                >
                                    <FaTrash />
                                </button>
                            )}
                        </div>
                    ))}

                    {announcements.length === 0 && (
                        <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                            No announcements found for {filterDept}.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
