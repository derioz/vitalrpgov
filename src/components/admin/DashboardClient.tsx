"use client";

import { useEffect, useState } from 'react';
import { FaUsers, FaGavel, FaBullhorn, FaGlobeAmericas, FaArrowUp, FaClock, FaExclamationCircle, FaUserShield, FaBriefcase, FaSpinner, FaCode } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { collection, query, where, getDocs, orderBy, limit, getCountFromServer } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { ChangelogItem } from '@/lib/changelog'; // Import interface
import ReactMarkdown from 'react-markdown';

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

interface DashboardClientProps {
}

export default function DashboardClient() {
    const { userProfile } = useAuth();

    // Stats
    const [stats, setStats] = useState<DashboardStat[]>([
        { label: "Total Users", value: "-", icon: FaUsers, color: "blue", trend: "..." },
        { label: "Active Complaints", value: "-", icon: FaExclamationCircle, color: "amber", trend: "..." },
        { label: "Total Personnel", value: "-", icon: FaUserShield, color: "purple", trend: "..." },
        { label: "Open Jobs", value: "-", icon: FaBriefcase, color: "emerald", trend: "..." },
    ]);

    // Feed
    const [activity, setActivity] = useState<ActivityItem[]>([]);
    const [loading, setLoading] = useState(true);

    const isSuperAdmin = userProfile?.roles?.includes('superadmin');
    const isDeptLeader = userProfile?.roles?.includes('admin');
    const userDepts = userProfile?.roles?.filter(r => ['lspd', 'lsems', 'safd', 'doj'].includes(r)).map(r => r.toUpperCase()) || [];

    const fetchData = async () => {
        if (!userProfile) return;
        setLoading(true);

        try {
            // --- 1. STATS ---
            let usersCount = "Restricted";
            if (isSuperAdmin) {
                try {
                    const usersSnap = await getCountFromServer(collection(db, 'users'));
                    usersCount = usersSnap.data().count.toLocaleString();
                } catch (e) {
                    console.warn("User count failed", e);
                }
            } else {
                usersCount = "N/A";
            }

            let complaintsQ;
            if (isSuperAdmin) {
                complaintsQ = query(collection(db, 'complaints'), where('status', '!=', 'Resolved'));
            } else if (userDepts.length > 0) {
                complaintsQ = query(collection(db, 'complaints'), where('status', '!=', 'Resolved'), where('department', 'in', userDepts));
            } else {
                complaintsQ = null;
            }

            let complaintsCount = "-";
            if (complaintsQ) {
                const complaintsSnap = await getCountFromServer(complaintsQ);
                complaintsCount = complaintsSnap.data().count.toString();
            }

            // Personnel
            let rosterQ;
            if (isSuperAdmin) {
                rosterQ = query(collection(db, 'rosters'));
            } else if (userDepts.length > 0) {
                rosterQ = query(collection(db, 'rosters'), where('department', 'in', userDepts));
            } else {
                rosterQ = null;
            }

            let rosterCount = "-";
            if (rosterQ) {
                const rosterSnap = await getCountFromServer(rosterQ);
                rosterCount = rosterSnap.data().count.toString();
            }

            // Jobs
            let jobsQ;
            if (isSuperAdmin) {
                jobsQ = query(collection(db, 'jobs'));
            } else if (userDepts.length > 0) {
                jobsQ = query(collection(db, 'jobs'), where('department', 'in', userDepts));
            } else {
                jobsQ = null;
            }

            let jobsCount = "-";
            if (jobsQ) {
                const jobsSnap = await getCountFromServer(jobsQ);
                jobsCount = jobsSnap.data().count.toString();
            }

            setStats([
                { label: "Total Users", value: usersCount, icon: FaUsers, color: "blue", trend: isSuperAdmin ? "Registered" : "Hidden" },
                { label: "Active Complaints", value: complaintsCount, icon: FaExclamationCircle, color: "amber", trend: "Pending" },
                { label: "Personnel", value: rosterCount, icon: FaUserShield, color: "purple", trend: "On Roster" },
                { label: "Open Jobs", value: jobsCount, icon: FaBriefcase, color: "emerald", trend: "Available" },
            ]);

            // --- 2. ACTIVITY FEED ---
            const feedItems: ActivityItem[] = [];

            let recentComplaintsQ;
            if (isSuperAdmin) {
                recentComplaintsQ = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'), limit(50));
            } else if (userDepts.length > 0) {
                recentComplaintsQ = query(collection(db, 'complaints'), where('department', 'in', userDepts), orderBy('createdAt', 'desc'), limit(50));
            }

            if (recentComplaintsQ) {
                const cSnap = await getDocs(recentComplaintsQ);
                cSnap.forEach(doc => {
                    const data = doc.data();
                    feedItems.push({
                        id: doc.id,
                        type: 'complaint',
                        department: data.department,
                        description: `Complaint #${data.accessCode || doc.id.substring(0, 6)}`,
                        timestamp: data.createdAt,
                        author: 'System'
                    });
                });
            }

            let recentAnnouncementsQ;
            if (isSuperAdmin) {
                recentAnnouncementsQ = query(collection(db, 'announcements'), orderBy('createdAt', 'desc'), limit(50));
            } else if (userDepts.length > 0) {
                recentAnnouncementsQ = query(collection(db, 'announcements'), where('department', 'in', userDepts), orderBy('createdAt', 'desc'), limit(50));
            }

            if (recentAnnouncementsQ) {
                const aSnap = await getDocs(recentAnnouncementsQ);
                aSnap.forEach(doc => {
                    const data = doc.data();
                    feedItems.push({
                        id: doc.id,
                        type: 'announcement',
                        department: data.department,
                        description: `Announcement: "${data.title}"`,
                        timestamp: data.createdAt,
                        author: data.author || 'Admin'
                    });
                });
            }

            // Sort merged feed
            feedItems.sort((a, b) => {
                const timeA = a.timestamp?.seconds || 0;
                const timeB = b.timestamp?.seconds || 0;
                return timeB - timeA;
            });

            setActivity(feedItems.slice(0, 7)); // Top 7 items

        } catch (error) {
            console.error("Dashboard fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userProfile, isSuperAdmin]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const totalPages = Math.ceil(activity.length / itemsPerPage);
    const paginatedActivity = activity.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
        <div className="space-y-8">

            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-slate-200">
                    Overview
                    {userDepts.length > 0 && !isSuperAdmin && <span className="text-sm font-normal text-slate-500 ml-2">({userDepts.join(', ')})</span>}
                    {isSuperAdmin && <span className="text-sm font-normal text-slate-500 ml-2">(Global Access)</span>}
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity Feed (2/3 width) */}
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8 flex flex-col h-full">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-3">
                            <FaClock className="text-indigo-500" />
                            Recent Activity
                        </h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors border border-white/5"
                            >
                                Previous
                            </button>
                            <span className="text-xs font-mono self-center text-slate-500">
                                Page {currentPage} of {totalPages || 1}
                            </span>
                            <button
                                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                disabled={currentPage === totalPages || totalPages === 0}
                                className="px-3 py-1 text-xs font-bold bg-white/5 hover:bg-white/10 disabled:opacity-30 rounded-lg transition-colors border border-white/5"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4 flex-1">
                        {paginatedActivity.length === 0 && !loading && (
                            <div className="text-center py-8 text-slate-500 italic">No recent activity found.</div>
                        )}

                        {paginatedActivity.map((item) => (
                            <div key={`${item.type}-${item.id}`} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl border border-white/10 
                                    ${item.type === 'complaint' ? 'bg-amber-500/20 text-amber-500' : 'bg-purple-500/20 text-purple-500'}
                                `}>
                                    {item.type === 'complaint' ? <FaExclamationCircle /> : <FaBullhorn />}
                                </div>
                                <div className="flex-1">
                                    <p className="text-slate-200 font-medium text-sm">
                                        <span className="text-slate-400 font-bold text-[10px] uppercase mr-2 tracking-wider px-1.5 py-0.5 rounded bg-white/5">{item.department}</span>
                                        {item.description}
                                    </p>
                                    <p className="text-slate-500 text-[10px] mt-1 flex items-center gap-2">
                                        <span>{item.author}</span>
                                        <span>•</span>
                                        <span>
                                            {item.timestamp?.toDate
                                                ? item.timestamp.toDate().toLocaleString()
                                                : typeof item.timestamp === 'string'
                                                    ? new Date(item.timestamp).toLocaleString()
                                                    : 'Just now'}
                                        </span>
                                    </p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Link
                                        href={item.type === 'complaint' ? `/admin/complaints?dept=${item.department}` : `/admin/announcements?dept=${item.department}`}
                                        className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 uppercase tracking-widest border border-indigo-500/30 px-3 py-1 rounded-lg hover:bg-indigo-500/10 transition-colors"
                                    >
                                        View
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Widget (1/3 width) - Replaces Changelog */}
                <div className="bg-black/20 backdrop-blur-xl border border-pink-500/20 rounded-3xl p-8 relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500"></div>

                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-3 mb-4">
                            <FaCode className="text-pink-500" />
                            System Updates
                        </h2>
                        <p className="text-slate-400 text-sm mb-6">
                            Stay up to date with the latest features, security patches, and improvements to the San Andreas Government portal.
                        </p>
                    </div>

                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5 mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                                <img src="/vitalrpgov/images/damon_icon.png" alt="Dev" className="w-full h-full object-cover" />
                            </div>
                            <div>
                                <p className="text-xs text-slate-300 font-bold">Maintained by Damon</p>
                                <p className="text-[10px] text-slate-500">Certified Developer</p>
                            </div>
                        </div>
                    </div>

                    <Link
                        href="/admin/changelog"
                        className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700 group"
                    >
                        View Full Changelog
                        <FaArrowUp className="rotate-45 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
