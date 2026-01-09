"use client";

import { useState, useEffect } from 'react';
import { FaBalanceScale, FaGavel, FaBook, FaBriefcase, FaUniversity, FaUserTimes, FaChevronRight, FaTimes, FaLandmark } from "react-icons/fa";
import FactionAnnouncements from "@/components/FactionAnnouncements";
import FactionJobs from "@/components/FactionJobs";
import FactionQuickNav from "@/components/FactionQuickNav";
import DocketList from "@/components/DocketList";
import { db } from '@/lib/firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function DOJPage() {

    // Helper for role checks could go here if needed


    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-200 relative overflow-hidden font-sans selection:bg-amber-500/30">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-amber-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-slate-800/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 max-w-[1600px]">

                {/* Massive Header */}
                <header className="mb-20 relative">
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-amber-500 font-mono text-xs tracking-[0.3em] uppercase opacity-80 animate-fade-in-up">
                            <span className="w-8 h-[1px] bg-amber-500"></span>
                            Judicial Branch
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9] mix-blend-overlay opacity-90 animate-fade-in">
                            DOJ
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-amber-200 text-4xl md:text-6xl mt-2 tracking-normal font-bold">
                                Department of Justice
                            </span>
                        </h1>
                    </div>
                    {/* Floating Watermark Icon */}
                    <FaBalanceScale className="absolute top-1/2 right-0 -translate-y-1/2 text-[20rem] text-amber-900/10 pointer-events-none rotate-0" />
                </header>

                {/* Quick Navigation / Key Resources */}
                <FactionQuickNav items={[
                    { label: 'Judicial App', subLabel: 'Become a Judge', icon: FaGavel, color: 'amber', href: '#apply' },
                    { label: 'State Bar', subLabel: 'Attorney Roster', icon: FaUniversity, color: 'indigo', href: '#roster' },
                    { label: 'Court Docket', subLabel: 'Case Schedule', icon: FaBalanceScale, color: 'blue', href: '#docket' },
                    { label: 'File Suit', subLabel: 'Open a Case', icon: FaBriefcase, color: 'emerald', href: '#file' },
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Feed (8 cols) */}
                    <div className="lg:col-span-8 space-y-10 animate-fade-in-up delay-200">
                        {/* Court Dockets Feed */}
                        <section>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-3">
                                <span className="p-2 bg-amber-500/20 rounded-lg text-amber-500"><FaBalanceScale /></span>
                                Court Docket Schedule
                            </h2>
                            <DocketList />
                        </section>

                        {/* General Announcements */}
                        <section>
                            <FactionAnnouncements
                                department="DOJ"
                                title="Department Announcements"
                                color="amber"
                                icon={FaUniversity}
                            />
                        </section>

                        {/* Job Offerings */}
                        <section id="apply">
                            <FactionJobs
                                department="DOJ"
                                title="Career Opportunities"
                                color="amber"
                                icon={FaBriefcase}
                            />
                        </section>
                    </div>

                    {/* Right Column: Interactive panels (4 cols) */}
                    <div className="lg:col-span-4 space-y-8 animate-fade-in-up delay-300">

                        {/* Legal Resources Section */}


                        {/* Department Access Grid */}
                        <div>
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1 h-3 bg-slate-700 rounded-full"></span>
                                Department Access
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { icon: FaGavel, label: "Courts", color: "amber", link: "/doj/court" },
                                    { icon: FaBriefcase, label: "The Bar", color: "indigo", link: "/doj/bar" }
                                ].map((action, i) => (
                                    <div
                                        key={i}
                                        className={`
                                        relative overflow-hidden p-6 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200 dark:border-white/5 
                                        hover:bg-amber-600 hover:border-amber-500 hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]
                                        transition-all duration-300 group text-left block cursor-pointer
                                    `}>
                                        <a href={action.link} className="absolute inset-0 z-10"></a>
                                        <action.icon className="text-3xl text-slate-500 dark:text-slate-400 group-hover:text-white mb-4 transition-colors relative z-0" />
                                        <span className="block font-bold text-slate-700 dark:text-slate-300 group-hover:text-white transition-colors relative z-0">{action.label}</span>
                                        <FaChevronRight className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Expungement Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-slate-700 to-slate-900 p-8 shadow-2xl shadow-slate-900/20 text-white relative overflow-hidden group border border-slate-600">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <h3 className="text-2xl font-bold mb-2 relative z-10 flex gap-2 items-center"><FaUserTimes /> Expungement</h3>
                            <p className="text-slate-300 mb-6 relative z-10">Clear your criminal record.</p>
                            <button className="w-full py-4 bg-amber-500 text-slate-900 font-black rounded-xl shadow-lg hover:bg-amber-400 transform hover:-translate-y-1 transition-all duration-300 relative z-10 flex items-center justify-center gap-2">
                                CHECK ELIGIBILITY
                            </button>
                        </div>
                    </div>

                </div>
            </div>

            {/* Gov Code Modal Removed */}

        </div>
    );
}
