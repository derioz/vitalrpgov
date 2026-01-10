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
    changelogs: ChangelogItem[];
}

export default function DashboardClient({ changelogs }: DashboardClientProps) {
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
            if (isSuperAdmin) {
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

            {/* Developer Changelog Section (Stateless/Prop-based) */}
            <div className="bg-black/20 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                        <FaCode className="text-pink-500" />
                        Developer Changelog
                    </h2>
                    {/* Access to changelog file means we don't need manual add */}
                </div>

                <div className="space-y-6">
                    {changelogs.length === 0 && (
                        <div className="text-center py-6 text-slate-500 italic">No changelogs found.</div>
                    )}

                    {changelogs.map((log) => (
                        <div key={log.id} className="relative pl-6 border-l-2 border-slate-700 hover:border-indigo-500 transition-colors">
                            <span className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-slate-700 border-2 border-slate-900 group-hover:bg-indigo-500"></span>
                            <div className="flex items-baseline gap-3 mb-1">
                                <span className="text-sm font-bold text-pink-400 font-mono bg-pink-500/10 px-2 py-0.5 rounded">{log.version}</span>
                                <h3 className="text-white font-bold">{log.title}</h3>
                                <span className="text-xs text-slate-500 ml-auto">{log.date || 'Unknown Date'}</span>
                            </div>
                            <div className="text-slate-400 text-sm prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-slate-900/50 prose-pre:border prose-pre:border-white/10">
                                <ReactMarkdown>{log.content}</ReactMarkdown>
                            </div>
                            <p className="text-slate-500 text-[10px] mt-2 font-mono uppercase">Posted by {log.author}</p>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    );
}
