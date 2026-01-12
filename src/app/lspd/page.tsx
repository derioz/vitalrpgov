"use client";

import { useState } from 'react';
import FactionJobs from '@/components/FactionJobs';
import FactionAnnouncements from '@/components/FactionAnnouncements';
import RoleGate from '@/components/RoleGate';
import FactionQuickNav from '@/components/FactionQuickNav';
import ComplaintForm from '@/components/ComplaintForm';
import FactionRoster from "@/components/FactionRoster";
import FactionResources from "@/components/FactionResources";
import { FaBullhorn, FaUserSecret, FaNewspaper, FaShieldAlt, FaIdCard, FaCar, FaGavel, FaPhone, FaChevronRight, FaBook, FaBriefcase, FaExclamationTriangle } from 'react-icons/fa';

export default function LSPDPage() {
    const [showComplaintForm, setShowComplaintForm] = useState(false);

    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 relative overflow-hidden font-sans selection:bg-blue-500/30">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 max-w-[1600px]">

                {/* Massive Header */}
                <header className="mb-16 relative">
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-blue-500 font-mono text-[10px] tracking-[0.3em] uppercase opacity-80 animate-fade-in-up">
                            <span className="w-8 h-[1px] bg-blue-500"></span>
                            Official Portal
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mix-blend-overlay opacity-90 animate-fade-in">
                            LSPD
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 text-xl md:text-3xl mt-1 tracking-normal font-bold">
                                Los Santos Police Dept.
                            </span>
                        </h1>
                    </div>
                    {/* Floating Watermark Icon */}
                    <FaShieldAlt className="absolute top-1/2 right-0 -translate-y-1/2 text-[15rem] text-blue-900/10 pointer-events-none rotate-12" />
                </header>



                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Feed (8 cols) */}
                    <div className="lg:col-span-8 space-y-8 animate-fade-in-up delay-200">
                        <FactionAnnouncements
                            department="LSPD"
                            title="Briefing Room"
                            color="blue"
                            icon={FaBullhorn}
                        />

                        {/* Job Offerings */}
                        <div id="apply">
                            <FactionJobs
                                department="LSPD"
                                title="Career Opportunities"
                                color="blue"
                                icon={FaBriefcase}
                            />
                        </div>

                        {/* Roster */}
                        <div id="roster">
                            <FactionRoster
                                department="LSPD"
                                title="Staff Roster"
                                color="blue"
                            />
                        </div>
                    </div>

                    {/* Right Column: Interactive panels (4 cols) */}
                    <div className="lg:col-span-4 space-y-6 animate-fade-in-up delay-300">
                        {/* LSPD Quick Links Sidebar */}
                        <FactionResources
                            faction="LSPD"
                            variant="sidebar"
                            title="Quick Links"
                            settingId="lspd_quicklinks"
                            customDefaults={[
                                { title: "Join LSPD", desc: "Police Academy", url: "#apply", icon: "id-card", color: "blue" },
                                { title: "Staff Roster", desc: "Command Chain", url: "#roster", icon: "shield", color: "indigo" },
                                { title: "SOP Handbook", desc: "Procedural Guides", url: "#sop", icon: "book", color: "sky" },
                                { title: "Impound Lot", desc: "Vehicle Recovery", url: "#impound", icon: "car", color: "slate" }
                            ]}
                        />

                        {/* LSPD Resources Sidebar */}
                        <FactionResources faction="LSPD" variant="sidebar" />

                        <div className="grid grid-cols-2 gap-3">
                            {/* File Complaint Button */}
                            <button
                                onClick={() => setShowComplaintForm(true)}
                                className="col-span-2 relative overflow-hidden p-4 rounded-xl bg-amber-600 text-white shadow-lg shadow-amber-600/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300 group text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-1">
                                            <FaExclamationTriangle className="text-xl" />
                                            <span className="font-black text-base uppercase tracking-wider">File Complaint</span>
                                        </div>
                                        <p className="text-amber-100 text-[10px] font-bold leading-tight max-w-[80%]">Submit a formal report to Internal Affairs.</p>
                                    </div>
                                    <FaChevronRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                        </div>

                    </div>

                </div>
            </div>
            {/* Complaint Form Modal */}
            <ComplaintForm
                department="LSPD"
                isOpen={showComplaintForm}
                onClose={() => setShowComplaintForm(false)}
            />
        </div>
    );
}
