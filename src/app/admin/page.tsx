"use client";

import { FaUsers, FaGavel, FaBullhorn, FaGlobeAmericas, FaArrowUp, FaClock } from 'react-icons/fa';

export default function AdminDashboard() {
    return (
        <div className="space-y-8">

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Users", value: "1,248", icon: FaUsers, color: "blue", trend: "+12%" },
                    { label: "Active Laws", value: "86", icon: FaGavel, color: "amber", trend: "+3" },
                    { label: "Announcements", value: "24", icon: FaBullhorn, color: "purple", trend: "New" },
                    { label: "Server Status", value: "99.9%", icon: FaGlobeAmericas, color: "emerald", trend: "Good" },
                ].map((stat, i) => (
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
                                    <FaArrowUp size={10} /> {stat.trend}
                                </span>
                            </div>
                            <h3 className="text-3xl font-black text-white mb-1">{stat.value}</h3>
                            <p className="text-slate-400 text-sm font-medium uppercase tracking-wide">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Quick Actions / Recent Activity */}
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-8">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                        <FaClock className="text-indigo-500" />
                        Recent System Activity
                    </h2>

                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors border border-white/5">
                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold text-xs border border-white/10">
                                    {i}m
                                </div>
                                <div>
                                    <p className="text-slate-200 font-medium">
                                        <span className="text-indigo-400 font-bold">Admin</span> updated <span className="text-white">Penal Code §402</span>
                                    </p>
                                    <p className="text-slate-500 text-xs mt-0.5">Automated Audit Log • ID #992{i}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* System Status Panel */}
                <div className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 backdrop-blur-xl border border-indigo-500/20 rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/5 mix-blend-overlay"></div>

                    <div className="relative z-10">
                        <h3 className="text-lg font-bold text-white mb-2">System Health</h3>
                        <p className="text-indigo-200/60 text-sm mb-8">All services operating normally.</p>

                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                    <span>CPU LOAD</span>
                                    <span className="text-emerald-400">12%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[12%] bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                    <span>MEMORY</span>
                                    <span className="text-blue-400">45%</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[45%] bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                                    <span>DB LATENCY</span>
                                    <span className="text-amber-400">24ms</span>
                                </div>
                                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                    <div className="h-full w-[24%] bg-amber-500 rounded-full shadow-[0_0_10px_rgba(245,158,11,0.5)]"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 relative z-10">
                        <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-900/20 transition-all">
                            Run Diagnostics
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
