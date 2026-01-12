"use client";

import { useState } from 'react';
import { FaAmbulance, FaHeartbeat, FaNotesMedical, FaSyringe, FaUserMd, FaHospital, FaChevronRight, FaPhone, FaBriefcase, FaExclamationTriangle } from "react-icons/fa";
import FactionAnnouncements from "@/components/FactionAnnouncements";
import FactionJobs from "@/components/FactionJobs";
import FactionQuickNav from "@/components/FactionQuickNav";
import ComplaintForm from "@/components/ComplaintForm";

import FactionRoster from "@/components/FactionRoster";
import FactionResources from "@/components/FactionResources";

export default function LSEMSPage() {
    const [showComplaintForm, setShowComplaintForm] = useState(false);
    return (
        <div className="min-h-screen w-full bg-slate-50 dark:bg-black text-slate-900 dark:text-slate-200 relative overflow-hidden font-sans selection:bg-red-500/30">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-red-600/5 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-pink-900/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 max-w-[1600px]">

                {/* Massive Header */}
                <header className="mb-16 relative">
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-red-500 font-mono text-[10px] tracking-[0.3em] uppercase opacity-80 animate-fade-in-up">
                            <span className="w-8 h-[1px] bg-red-500"></span>
                            Emergency Services
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mix-blend-overlay opacity-90 animate-fade-in">
                            EMS
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-300 text-xl md:text-3xl mt-1 tracking-normal font-bold">
                                Medical Center
                            </span>
                        </h1>
                    </div>
                    {/* Floating Watermark Icon */}
                    <FaHeartbeat className="absolute top-1/2 right-0 -translate-y-1/2 text-[15rem] text-red-900/10 pointer-events-none -rotate-12" />
                </header>



                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Actions (4 cols) */}
                    <div className="lg:col-span-4 space-y-6 animate-fade-in-up delay-300 order-2 lg:order-1">
                        {/* Medical Quick Links Sidebar */}
                        <FactionResources
                            faction="LSEMS"
                            variant="sidebar"
                            title="Quick Links"
                            settingId="lsems_quicklinks"
                            customDefaults={[
                                { title: "Join EMS", desc: "Medical Training", url: "#apply", icon: "id-card", color: "red" },
                                { title: "Staff Roster", desc: "On-Call Medics", url: "#roster", icon: "heart", color: "pink" },
                                { title: "Protocols", desc: "Treatment Guides", url: "#protocols", icon: "book", color: "emerald" },
                                { title: "Hospitals", desc: "Facilities", url: "#hospitals", icon: "landmark", color: "blue" }
                            ]}
                        />

                        {/* Medical Resources Sidebar */}
                        <FactionResources faction="LSEMS" variant="sidebar" />

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
                                        <p className="text-amber-100 text-[10px] font-bold leading-tight max-w-[80%]">Report medical negligence or misconduct.</p>
                                    </div>
                                    <FaChevronRight className="text-lg transform group-hover:translate-x-1 transition-transform" />
                                </div>
                            </button>

                        </div>

                    </div>

                    {/* Right Column: Feed (8 cols) */}
                    <div className="lg:col-span-8 space-y-6 animate-fade-in-up delay-200 order-1 lg:order-2">
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
