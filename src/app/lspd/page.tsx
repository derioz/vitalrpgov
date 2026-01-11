"use client";

import { useState } from 'react';
import FactionJobs from '@/components/FactionJobs';
import FactionAnnouncements from '@/components/FactionAnnouncements';
import RoleGate from '@/components/RoleGate';
import FactionQuickNav from '@/components/FactionQuickNav';
import ComplaintForm from '@/components/ComplaintForm';
import FactionRoster from "@/components/FactionRoster";
import { FaBullhorn, FaUserSecret, FaNewspaper, FaShieldAlt, FaIdCard, FaCar, FaGavel, FaPhone, FaChevronRight, FaBook, FaBriefcase, FaExclamationTriangle } from 'react-icons/fa';

export default function LSPDPage() {
    const [showComplaintForm, setShowComplaintForm] = useState(false);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 relative overflow-hidden font-sans selection:bg-blue-500/30">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 max-w-[1600px]">

                {/* Massive Header */}
                <header className="mb-20 relative">
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-blue-500 font-mono text-xs tracking-[0.3em] uppercase opacity-80 animate-fade-in-up">
                            <span className="w-8 h-[1px] bg-blue-500"></span>
                            Official Portal
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mix-blend-overlay opacity-90 animate-fade-in">
                            LSPD
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-blue-300 text-2xl md:text-4xl mt-1 tracking-normal font-bold">
                                Los Santos Police Dept.
                            </span>
                        </h1>
                    </div>
                    {/* Floating Watermark Icon */}
                    <FaShieldAlt className="absolute top-1/2 right-0 -translate-y-1/2 text-[20rem] text-blue-900/10 pointer-events-none rotate-12" />
                </header>

                {/* Quick Navigation / Key Resources */}
                <FactionQuickNav items={[
                    { label: 'Join LSPD', subLabel: 'Police Academy', icon: FaIdCard, color: 'blue', href: '#apply' },
                    { label: 'Staff Roster', subLabel: 'Command Chain', icon: FaShieldAlt, color: 'indigo', href: '#roster' },
                    { label: 'SOP Handbook', subLabel: 'Procedural Guides', icon: FaBook, color: 'sky', href: '#sop' },
                    { label: 'Impound Lot', subLabel: 'Vehicle Recovery', icon: FaCar, color: 'slate', href: '#impound' },
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Feed (8 cols) */}
                    <div className="lg:col-span-8 space-y-10 animate-fade-in-up delay-200">
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

                        <div className="grid grid-cols-2 gap-4">
                            {/* File Complaint Button */}
                            <button
                                onClick={() => setShowComplaintForm(true)}
                                className="col-span-2 relative overflow-hidden p-4 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300 group text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaExclamationTriangle className="text-2xl" />
                                            <span className="font-black text-lg uppercase tracking-wider">File Complaint</span>
                                        </div>
                                        <p className="text-amber-100 text-xs font-bold leading-tight max-w-[80%]">Submit a formal report to Internal Affairs.</p>
                                    </div>
                                    <FaChevronRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            {[
                                { icon: FaIdCard, label: 'MDT', color: 'blue' },
                                { icon: FaIdCard, label: 'MDT', color: 'blue' },
                                { icon: FaCar, label: 'Impound', color: 'slate' },
                                { icon: FaNewspaper, label: 'Evidence', color: 'cyan' },
                            ].map((action, i) => (
                                <button key={i} className={`
                                    relative overflow-hidden p-4 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 
                                    hover:bg-blue-600 hover:border-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.3)]
                                    transition-all duration-300 group text-left
                                `}>
                                    <action.icon className="text-3xl text-slate-500 dark:text-slate-400 group-hover:text-white mb-4 transition-colors" />
                                    <span className="block font-bold text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                                    <FaChevronRight className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                </button>
                            ))}
                        </div>

                        {/* Gang Intel Card (Glass Red) */}
                        <RoleGate allowedRoles={['lspd', 'admin']}>
                            <div className="relative overflow-hidden rounded-3xl bg-red-950/20 border border-red-500/20 p-8 hover:bg-red-950/30 hover:border-red-500/40 transition-all duration-500 group">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <FaUserSecret className="text-9xl text-red-500 transform rotate-12" />
                                </div>

                                <h3 className="text-2xl font-bold text-red-500 mb-2 flex items-center gap-2">
                                    <FaUserSecret /> GANG INTEL
                                </h3>
                                <p className="text-red-400/60 text-sm mb-6 font-mono tracking-wide">EYES ONLY // CLEARANCE REQUIRED</p>

                                <div className="space-y-3 relative z-10">
                                    {['Ballas', 'Vagos', 'Lost MC'].map((gang) => (
                                        <div key={gang} className="flex justify-between items-center p-3 rounded-lg bg-red-900/10 border border-red-500/10">
                                            <span className="text-red-100 font-bold">{gang}</span>
                                            <div className="flex gap-1">
                                                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </RoleGate>

                        {/* Dispatch Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-indigo-700 p-8 shadow-2xl shadow-blue-900/20 text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <h3 className="text-2xl font-bold mb-2 relative z-10">Dispatch 911</h3>
                            <p className="text-blue-100 mb-6 relative z-10">Direct link to central command.</p>
                            <button className="w-full py-4 bg-white text-blue-900 font-black rounded-xl shadow-lg hover:bg-blue-50 transform hover:-translate-y-1 transition-all duration-300 relative z-10 flex items-center justify-center gap-2">
                                <FaPhone /> CONNECT RADIO
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
