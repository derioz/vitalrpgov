"use client";

import { useEffect, useState } from 'react';
import { FaUsers, FaGavel, FaBullhorn, FaGlobeAmericas, FaArrowUp, FaClock, FaExclamationCircle, FaUserShield, FaBriefcase, FaSpinner, FaCode, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy, limit, getCountFromServer, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';

interface DashboardStat {
    label: string;
    value: string;
    icon: any;
    color: string;
    trend: string;
}

interface ActivityItem {
    id: string;
    type: 'complaint' | 'announcement';
    department: string;
    description: string;
    timestamp: any; // Firestore Timestamp
    author?: string;
}

interface ChangelogItem {
    id: string;
    version: string;
    title: string;
    content: string;
    date: any;
    author: string;
}

export default function AdminDashboard() {
    const { userProfile } = useAuth();

    // Stats
    const [stats, setStats] = useState<DashboardStat[]>([
        { label: "Total Users", value: "-", icon: FaUsers, color: "blue", trend: "..." },
        { label: "Active Complaints", value: "-", icon: FaExclamationCircle, color: "amber", trend: "..." },
        { label: "Total Personnel", value: "-", icon: FaUserShield, color: "purple", trend: "..." },
        { label: "Open Jobs", value: "-", icon: FaBriefcase, color: "emerald", trend: "..." },
    ]);

    // Feeds
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [changelogs, setChangelogs] = useState<ChangelogItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [showLogModal, setShowLogModal] = useState(false);
    const [newLogVersion, setNewLogVersion] = useState('');
    const [newLogTitle, setNewLogTitle] = useState('');
    const [newLogContent, setNewLogContent] = useState('');
    const [submittingLog, setSubmittingLog] = useState(false);

    const isAdmin = userProfile?.roles?.includes('admin');
    const userDepts = userProfile?.roles?.filter(r => ['lspd', 'lsems', 'safd', 'doj'].includes(r)).map(r => r.toUpperCase()) || [];

    const fetchData = async () => {
        if (!userProfile) return;
        setLoading(true);

        try {
            // --- 1. STATS ---
            let usersCount = "N/A";
            if (isAdmin) {
                try {
                    const usersSnap = await getCountFromServer(collection(db, 'users'));
                    usersCount = usersSnap.data().count.toLocaleString();
                } catch (e) {
                    console.warn("User count failed", e);
                }
            }

            let complaintsQ;
            if (isAdmin) {
                complaintsQ = query(collection(db, 'complaints'), where('status', '!=', 'Resolved'));
            } else if (userDepts.length > 0) {
                complaintsQ = query(collection(db, 'complaints'), where('status', '!=', 'Resolved'), where('department', 'in', userDepts));
            } else {
                complaintsQ = query(collection(db, 'complaints'), where('status', '!=', 'Resolved')); // Fallback
            }
            const complaintsSnap = await getCountFromServer(complaintsQ);
            const complaintsCount = complaintsSnap.data().count.toString();

            // Personnel
            let rosterQ;
            if (isAdmin) {
                rosterQ = query(collection(db, 'rosters'));
            } else if (userDepts.length > 0) {
                rosterQ = query(collection(db, 'rosters'), where('department', 'in', userDepts));
            } else {
                rosterQ = query(collection(db, 'rosters'));
            }
            const rosterSnap = await getCountFromServer(rosterQ);
            const rosterCount = rosterSnap.data().count.toString();

            // Jobs
            let jobsQ;
            if (isAdmin) {
                jobsQ = query(collection(db, 'jobs'));
            } else if (userDepts.length > 0) {
                jobsQ = query(collection(db, 'jobs'), where('department', 'in', userDepts));
            } else {
                jobsQ = query(collection(db, 'jobs'));
            }
            const jobsSnap = await getCountFromServer(jobsQ);
            const jobsCount = jobsSnap.data().count.toString();

            setStats([
                { label: "Total Users", value: usersCount, icon: FaUsers, color: "blue", trend: "Registered" },
                { label: "Active Complaints", value: complaintsCount, icon: FaExclamationCircle, color: "amber", trend: "Pending" },
                { label: "Total Personnel", value: rosterCount, icon: FaUserShield, color: "purple", trend: "On Roster" },
                { label: "Open Jobs", value: jobsCount, icon: FaBriefcase, color: "emerald", trend: "Available" },
            ]);

            // --- 2. ACTIVITY FEED ---
            const feedItems: ActivityItem[] = [];

            let recentComplaintsQ;
            if (isAdmin) {
                recentComplaintsQ = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'), limit(5));
            } else if (userDepts.length > 0) {
                recentComplaintsQ = query(collection(db, 'complaints'), where('department', 'in', userDepts), orderBy('createdAt', 'desc'), limit(5));
            }

            if (recentComplaintsQ) {
                const cSnap = await getDocs(recentComplaintsQ);
                cSnap.forEach(doc => {
                    const data = doc.data();
                    feedItems.push({
                        id: doc.id,
                        type: 'complaint',
                        department: data.department,
                        description: `New Complaint filed against ${data.department}`,
                        timestamp: data.createdAt,
                        author: 'System'
                    });
                });
            }

            let recentAnnouncementsQ;
            if (isAdmin) {
                recentAnnouncementsQ = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(5));
            } else if (userDepts.length > 0) {
                recentAnnouncementsQ = query(collection(db, 'announcements'), where('department', 'in', userDepts), orderBy('createdAt', 'desc'), limit(5));
            }

            if (recentAnnouncementsQ) {
                const aSnap = await getDocs(recentAnnouncementsQ);
                aSnap.forEach(doc => {
                    const data = doc.data();
                    feedItems.push({
                        id: doc.id,
                        type: 'announcement',
                        department: data.department,
                        description: `Announcement posted: "${data.title}"`,
                        timestamp: data.createdAt,
                        author: data.author || 'Admin'
                    });
                });
            }

            // Sort merged feed
            feedItems.sort((a, b) => {
                // Handle mixed timestamp types (Firestore Timestamp vs Date) safely or just use simple comparison if consistent
                const timeA = a.timestamp?.seconds || 0;
                const timeB = b.timestamp?.seconds || 0;
                return timeB - timeA;
            });

            setActivity(feedItems.slice(0, 7)); // Top 7 items

            // --- 3. CHANGELOGS ---
            try {
                const logsQ = query(collection(db, 'changelogs'), orderBy('date', 'desc'), limit(5));
                const logsSnap = await getDocs(logsQ);
                const logsData = logsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChangelogItem));
                setChangelogs(logsData);
            } catch (err) {
                console.warn("Retrying changelog fetch", err);
            }

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userProfile, isAdmin]); // Re-run if profile loads

    const handleAddChangelog = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newLogVersion || !newLogTitle || !newLogContent) return;

        setSubmittingLog(true);
        try {
            await addDoc(collection(db, 'changelogs'), {
                version: newLogVersion,
                title: newLogTitle,
                content: newLogContent,
                date: serverTimestamp(),
                author: userProfile?.icName || 'Admin'
            });
            setShowLogModal(false);
            setNewLogVersion('');
            setNewLogTitle('');
            setNewLogContent('');
            fetchData(); // Refresh list
        } catch (error) {
            console.error("Error adding log:", error);
            alert("Failed to add changelog.");
        } finally {
            setSubmittingLog(false);
        }
    };

    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-200">
                    Overview
                    {userDepts.length > 0 && !isAdmin && <span className="text-sm font-normal text-slate-500 ml-2">({userDepts.join(', ')})</span>}
                </h2>
                {loading && <div className="text-indigo-400 flex items-center gap-2 text-sm"><FaSpinner className="animate-spin" /> Syncing data...</div>}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl relative overflow-hidden group hover:bg-slate-800/40 transition-all duration-300">
                        <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
                            <stat.icon className={`text-6xl text-${stat.color}-500 transform rotate-12`} />
                        </div>

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className={`p-3 rounded-xl bg-${stat.color}-500/10 text-${stat.color}-500 border border-${stat.color}-500/20`}>
                                    <stat.icon size={20} />
                                </div>
                                <span className={`text-xs font-bold px-2 py-1 rounded-full bg-${stat.color}-500/10 text-${stat.color}-400 flex items-center gap-1`}>
                                    {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity Feed (Full Width) */}
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                    <FaClock className="text-indigo-500" />
                    Recent Activity
                </h2>

                <div className="space-y-4">
                    {activity.length === 0 && !loading && (
                        <div className="text-center py-8 text-slate-500 italic">No recent activity found.</div>
                    )}

                    {activity.map((item) => (
                        <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border border-white/10 
                                ${item.type === 'complaint' ? 'bg-amber-500/20 text-amber-500' : 'bg-purple-500/20 text-purple-500'}
                            `}>
                                {item.type === 'complaint' ? <FaExclamationCircle /> : <FaBullhorn />}
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-200 font-medium">
                                    <span className="text-slate-400 font-bold text-xs uppercase mr-2 tracking-wider px-1.5 py-0.5 rounded bg-white/5">{item.department}</span>
                                    {item.description}
                                </p>
                                <p className="text-slate-500 text-xs mt-1 flex items-center gap-2">
                                    <span>{item.author}</span>
                                    <span>•</span>
                                    <span>{item.timestamp?.toDate ? item.timestamp.toDate().toLocaleString() : 'Just now'}</span>
                                </p>
                            </div>
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                <Link
                                    href={item.type === 'complaint' ? `/admin/complaints?dept=${item.department}` : `/admin/announcements?dept=${item.department}`}
                                    className="text-xs font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest"
                                >
                                    View
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Developer Changelog Section */}
            <div className="bg-black/20 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <FaCode className="text-pink-500" />
                        Developer Changelog
                    </h2>
                    {isAdmin && (
                        <button
                            onClick={() => setShowLogModal(true)}
                            className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-lg flex items-center gap-2 transition-all"
                        >
                            <FaPlus /> Add Log
                        </button>
                    )}
                </div>

                <div className="space-y-6">
                    {changelogs.length === 0 && !loading && (
                        <div className="text-center py-6 text-slate-500 italic">No changelogs posted yet.</div>
                    )}

                    {changelogs.map((log) => (
                        <div key={log.id} className="relative pl-6 border-l-2 border-slate-700 hover:border-indigo-500 transition-colors">
                            <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-900 group-hover:bg-indigo-500"></span>
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-sm font-bold text-pink-400 font-mono bg-pink-500/10 px-2 py-0.5 rounded">{log.version}</span>
                                <h3 className="text-white font-bold">{log.title}</h3>
                                <span className="text-xs text-slate-500 ml-auto">{log.date?.toDate ? log.date.toDate().toLocaleDateString() : 'Just now'}</span>
                            </div>
                            <p className="text-slate-400 text-sm whitespace-pre-wrap leading-relaxed">{log.content}</p>
                            <p className="text-[10px] text-slate-600 mt-2 font-mono uppercase">Posted by {log.author}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Add Changelog Modal */}
            {showLogModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-scale-in">
                        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <FaCode className="text-pink-500" /> New Changelog
                            </h3>
                            <button onClick={() => setShowLogModal(false)} className="text-slate-400 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleAddChangelog} className="p-6 space-y-4">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="col-span-1">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Version</label>
                                    <input
                                        type="text"
                                        required
                                        value={newLogVersion}
                                        onChange={e => setNewLogVersion(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-indigo-500"
                                        placeholder="v1.0"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newLogTitle}
                                        onChange={e => setNewLogTitle(e.target.value)}
                                        className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-indigo-500"
                                        placeholder="Major Update..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Content</label>
                                <textarea
                                    required
                                    value={newLogContent}
                                    onChange={e => setNewLogContent(e.target.value)}
                                    className="w-full h-32 bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white outline-none focus:border-indigo-500 resize-none font-mono text-sm"
                                    placeholder="- Added feature X&#10;- Fixed bug Y"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submittingLog}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
                            >
                                {submittingLog ? 'Posting...' : 'Post Changelog'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
