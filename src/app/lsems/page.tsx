"use client";

import { useState } from 'react';
import { FaAmbulance, FaHeartbeat, FaNotesMedical, FaSyringe, FaUserMd, FaHospital, FaChevronRight, FaPhone, FaBriefcase, FaExclamationTriangle } from "react-icons/fa";
import FactionAnnouncements from "@/components/FactionAnnouncements";
import FactionJobs from "@/components/FactionJobs";
import FactionQuickNav from "@/components/FactionQuickNav";
import ComplaintForm from "@/components/ComplaintForm";

import FactionRoster from "@/components/FactionRoster";

export default function LSEMSPage() {
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 relative overflow-hidden font-sans selection:bg-red-500/30">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-red-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-pink-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 max-w-[1600px]">

                {/* Massive Header */}
                <header className="mb-20 relative">
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-red-500 font-mono text-xs tracking-[0.3em] uppercase opacity-80 animate-fade-in-up">
                            <span className="w-8 h-[1px] bg-red-500"></span>
                            Emergency Services
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mix-blend-overlay opacity-90 animate-fade-in">
                            EMS
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300 text-4xl md:text-6xl mt-2 tracking-normal font-bold">
                                Medical Center
                            </span>
                        </h1>
                    </div>
                    {/* Floating Watermark Icon */}
                    <FaHeartbeat className="absolute top-1/2 right-0 -translate-y-1/2 text-[20rem] text-red-900/10 pointer-events-none -rotate-12" />
                </header>

                {/* Quick Navigation / Key Resources */}
                <FactionQuickNav items={[
                    { label: 'Join EMS', subLabel: 'Medical Training', icon: FaUserMd, color: 'red', href: '#apply' },
                    { label: 'Staff Roster', subLabel: 'On-Call Medics', icon: FaNotesMedical, color: 'pink', href: '#roster' },
                    { label: 'Protocols', subLabel: 'Treatment Guides', icon: FaHeartbeat, color: 'emerald', href: '#protocols' },
                    { label: 'Hospitals', subLabel: 'Facilities', icon: FaHospital, color: 'blue', href: '#hospitals' },
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Actions (4 cols) */}
                    <div className="lg:col-span-4 space-y-8 animate-fade-in-up delay-300 order-2 lg:order-1">

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* File Complaint Button */}
                            <button
                                onClick={() => setShowComplaintForm(true)}
                                className="col-span-2 relative overflow-hidden p-6 rounded-2xl bg-amber-500 text-white shadow-lg shadow-amber-500/20 hover:shadow-amber-500/40 hover:-translate-y-1 transition-all duration-300 group text-left"
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2 mb-2">
                                            <FaExclamationTriangle className="text-2xl" />
                                            <span className="font-black text-lg uppercase tracking-wider">File Complaint</span>
                                        </div>
                                        <p className="text-amber-100 text-xs font-bold leading-tight max-w-[80%]">Report medical negligence or misconduct.</p>
                                    </div>
                                    <FaChevronRight className="text-xl transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                            {[
                                { icon: FaUserMd, label: 'Roster', color: 'pink' },
                                { icon: FaSyringe, label: 'Pharmacy', color: 'emerald' },
                                { icon: FaHospital, label: 'Wards', color: 'blue' },
                            ].map((action, i) => (
                                <button key={i} className={`
                                relative overflow-hidden p-6 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 
                                hover:bg-red-600 hover:border-red-500 hover:shadow-[0_0_30px_rgba(220,38,38,0.3)]
                                transition-all duration-300 group text-left
                            `}>
                                    <action.icon className="text-3xl text-slate-500 dark:text-slate-400 group-hover:text-white mb-4 transition-colors" />
                                    <span className="block font-bold text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                                    <FaChevronRight className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                </button>
                            ))}
                        </div>

                        {/* Dispatch Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-rose-700 p-8 shadow-2xl shadow-red-900/20 text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <h3 className="text-2xl font-bold mb-2 relative z-10">Medical Emergency</h3>
                            <p className="text-red-100 mb-6 relative z-10">Immediate dispatch for critical response.</p>
                            <button className="w-full py-4 bg-white text-red-900 font-black rounded-xl shadow-lg hover:bg-red-50 transform hover:-translate-y-1 transition-all duration-300 relative z-10 flex items-center justify-center gap-2">
                                <FaPhone /> CALL 911
                            </button>
                        </div>
                    </div>

                    {/* Right Column: Feed (8 cols) */}
                    <div className="lg:col-span-8 space-y-10 animate-fade-in-up delay-200 order-1 lg:order-2">
                        <FactionAnnouncements
                            department="LSEMS"
                            title="Medical Bulletins"
                            color="red"
                            icon={FaHospital}
                        />

                        {/* Job Offerings */}
                        <div id="apply">
                            <FactionJobs
                                department="LSEMS"
                                title="Career Opportunities"
                                color="red"
                                icon={FaBriefcase}
                            />
                        </div>

                        {/* Roster */}
                        <div id="roster">
                            <FactionRoster
                                department="LSEMS"
                                title="On-Duty Personnel"
                                color="red"
                            />
                        </div>
                    </div>

                </div>
            </div>
            {/* Complaint Form Modal */}
            <ComplaintForm
                department="LSEMS"
                isOpen={showComplaintForm}
                onClose={() => setShowComplaintForm(false)}
            />
        </div>
    );
}
