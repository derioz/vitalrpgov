"use client";

import { useState } from 'react';
import { FaFireExtinguisher, FaFire, FaHardHat, FaTruckMonster, FaClipboardCheck, FaTools, FaPhone, FaChevronRight, FaBriefcase, FaExclamationTriangle } from "react-icons/fa";
import FactionAnnouncements from "@/components/FactionAnnouncements";
import FactionJobs from "@/components/FactionJobs";
import FactionQuickNav from "@/components/FactionQuickNav";
import ComplaintForm from "@/components/ComplaintForm";

import FactionRoster from "@/components/FactionRoster";

export default function SAFDPage() {
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 relative overflow-hidden font-sans selection:bg-orange-500/30">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-orange-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-red-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 max-w-[1600px]">

                {/* Massive Header */}
                <header className="mb-16 relative">
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-orange-500 font-mono text-[10px] tracking-[0.3em] uppercase opacity-80 animate-fade-in-up">
                            <span className="w-8 h-[1px] bg-orange-500"></span>
                            Fire & Rescue
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mix-blend-overlay opacity-90 animate-fade-in">
                            SAFD
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300 text-xl md:text-3xl mt-1 tracking-normal font-bold">
                                San Andreas Fire Dept.
                            </span>
                        </h1>
                    </div>
                    {/* Floating Watermark Icon */}
                    <FaFireExtinguisher className="absolute top-1/2 right-0 -translate-y-1/2 text-[15rem] text-orange-900/10 pointer-events-none rotate-12" />
                </header>

                {/* Quick Navigation / Key Resources */}
                <FactionQuickNav items={[
                    { label: 'Join SAFD', subLabel: 'Fire Academy', icon: FaClipboardCheck, color: 'orange', href: '#apply' },
                    { label: 'Dept. Roster', subLabel: 'Firefighters', icon: FaHardHat, color: 'red', href: '#roster' },
                    { label: 'Inspections', subLabel: 'Business Safety', icon: FaClipboardCheck, color: 'yellow', href: '#inspections' },
                    { label: 'Burn Permits', subLabel: 'Public Access', icon: FaFire, color: 'green', href: '#permit' },
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Feed (8 cols) */}
                    <div className="lg:col-span-8 space-y-8 animate-fade-in-up delay-200">
                        <FactionAnnouncements
                            department="SAFD"
                            title="Station Notices"
                            color="orange"
                            icon={FaFire}
                        />

                        {/* Job Offerings */}
                        <div id="apply">
                            <FactionJobs
                                department="SAFD"
                                title="Career Opportunities"
                                color="orange"
                                icon={FaBriefcase}
                            />
                        </div>

                        {/* Roster */}
                        <div id="roster">
                            <FactionRoster
                                department="SAFD"
                                title="Active Firefighters"
                                color="orange"
                            />
                        </div>
                    </div>

                    {/* Right Column: Interactive panels (4 cols) */}
                    <div className="lg:col-span-4 space-y-6 animate-fade-in-up delay-300">

                        {/* Quick Actions Grid */}
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
                                        <p className="text-amber-100 text-[10px] font-bold leading-tight max-w-[80%]">Repor safety violation or department issue.</p>
                                    </div>
                                    <FaChevronRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            {[
                                { icon: FaClipboardCheck, label: 'Reports', color: 'blue' },
                                { icon: FaHardHat, label: 'Roster', color: 'orange' },
                                { icon: FaTruckMonster, label: 'Fleet', color: 'red' },
                                { icon: FaTools, label: 'Equip', color: 'slate' },
                            ].map((action, i) => (
                                <button key={i} className={`
                                relative overflow-hidden p-4 rounded-xl bg-white/5 dark:bg-black/40 border border-slate-200 dark:border-white/5 
                                hover:bg-orange-600 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]
                                transition-all duration-300 group text-left
                            `}>
                                    <action.icon className="text-2xl text-slate-500 dark:text-slate-400 group-hover:text-white mb-3 transition-colors" />
                                    <span className="block font-bold text-sm text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                                    <FaChevronRight className="absolute bottom-3 right-3 text-white/0 group-hover:text-white/100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                </button>
                            ))}
                        </div>

                        {/* Dispatch Card */}
                        <div className="rounded-2xl bg-gradient-to-br from-orange-600 to-orange-800 p-6 shadow-2xl shadow-orange-900/20 text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <h3 className="text-xl font-bold mb-1 relative z-10">Fire Dispatch</h3>
                            <p className="text-orange-100 text-sm mb-4 relative z-10">Direct line to fire emergency coordination.</p>
                            <button className="w-full py-3 bg-white text-orange-900 font-black rounded-lg shadow-lg hover:bg-orange-50 transform hover:-translate-y-1 transition-all duration-300 relative z-10 flex items-center justify-center gap-2 text-sm">
                                <FaPhone /> CONNECT RADIO
                            </button>
                        </div>
                    </div>

                </div>
            </div>
            {/* Complaint Form Modal */}
            <ComplaintForm
                department="SAFD"
                isOpen={showComplaintForm}
                onClose={() => setShowComplaintForm(false)}
            />
        </div>
    );
}
