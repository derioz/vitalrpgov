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
    const [showPenalCode, setShowPenalCode] = useState(false);
    const [showConstitution, setShowConstitution] = useState(false);
    const [showGovCode, setShowGovCode] = useState(false);

    const [urls, setUrls] = useState({
        penalCodeUrl: "https://docs.google.com/spreadsheets/d/1NWTm-yAQWqSVP04MgYjMlStI6WmwCSAhC-_F7ns3hDg/edit?gid=1736425476#gid=1736425476",
        constitutionUrl: "https://drive.google.com/file/d/1OFTLbR2HKYNjbkxSqQqtHUGfeFvtU090/preview",
        govCodeUrl: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview"
    });

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'doj_resources'), (doc) => {
            if (doc.exists()) {
                const data = doc.data();
                setUrls(prev => ({
                    penalCodeUrl: data.penalCodeUrl || prev.penalCodeUrl,
                    constitutionUrl: data.constitutionUrl || prev.constitutionUrl,
                    govCodeUrl: data.govCodeUrl || prev.govCodeUrl
                }));
            }
        });
        return () => unsub();
    }, []);

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
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <span className="w-1 h-3 bg-amber-500 rounded-full"></span>
                                Legal Resources
                            </h3>
                            <div className="space-y-3">
                                {[
                                    { icon: FaBook, label: "San Andreas Penal Code", sub: "Official Criminal Code", color: "blue", action: () => setShowPenalCode(true) },
                                    { icon: FaBalanceScale, label: "State Constitution", sub: "Supreme Law of the Land", color: "red", action: () => setShowConstitution(true) },
                                    { icon: FaLandmark, label: "Government Code", sub: "Procedures & Statues", color: "green", action: () => setShowGovCode(true) }
                                ].map((resource, i) => (
                                    <button
                                        key={i}
                                        onClick={resource.action}
                                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-amber-500/30 transition-all duration-300 group text-left relative overflow-hidden"
                                    >
                                        <div className={`w-12 h-12 rounded-lg bg-${resource.color}-500/10 flex items-center justify-center text-${resource.color}-500 dark:text-${resource.color}-400 group-hover:text-white group-hover:bg-${resource.color}-500 text-xl transition-all`}>
                                            <resource.icon />
                                        </div>
                                        <div>
                                            <span className="block font-bold text-slate-700 dark:text-slate-200 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">{resource.label}</span>
                                            <span className="text-xs text-slate-500 font-mono uppercase tracking-wide">{resource.sub}</span>
                                        </div>
                                        <FaChevronRight className="ml-auto text-slate-600 group-hover:text-amber-500 transform group-hover:translate-x-1 transition-all" />
                                    </button>
                                ))}
                            </div>
                        </div>

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

            {/* Penal Code Modal */}
            {showPenalCode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-[95vw] h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col animate-scale-up">

                        {/* Modal Header */}
                        <div className="bg-slate-100 dark:bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-amber-500 flex items-center gap-3">
                                <FaBook /> San Andreas Penal Code
                            </h2>
                            <button
                                onClick={() => setShowPenalCode(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Iframe Content */}
                        <div className="flex-1 bg-white">
                            <iframe
                                src={urls.penalCodeUrl}
                                className="w-full h-full border-none"
                                title="San Andreas Penal Code"
                                allow="autoplay"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-950 px-6 py-2 text-center border-t border-slate-800">
                            <p className="text-xs text-slate-500 font-mono">DOJ NOTICE: This document is managed externally. Updates may take time to reflect.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Constitution Modal */}
            {showConstitution && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-[95vw] h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col animate-scale-up">

                        {/* Modal Header */}
                        <div className="bg-slate-100 dark:bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-amber-500 flex items-center gap-3">
                                <FaBalanceScale /> San Andreas Constitution
                            </h2>
                            <button
                                onClick={() => setShowConstitution(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Iframe Content */}
                        <div className="flex-1 bg-white">
                            <iframe
                                src={urls.constitutionUrl}
                                className="w-full h-full border-none"
                                title="San Andreas Constitution"
                                allow="autoplay"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-950 px-6 py-2 text-center border-t border-slate-800">
                            <p className="text-xs text-slate-500 font-mono">DOJ NOTICE: This document is managed externally.</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Gov Code Modal */}
            {showGovCode && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 w-full max-w-[95vw] h-[90vh] rounded-2xl overflow-hidden shadow-2xl relative flex flex-col animate-scale-up">

                        {/* Modal Header */}
                        <div className="bg-slate-100 dark:bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
                            <h2 className="text-xl font-bold text-amber-500 flex items-center gap-3">
                                <FaLandmark /> Government Code
                            </h2>
                            <button
                                onClick={() => setShowGovCode(false)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {/* Iframe Content */}
                        <div className="flex-1 bg-white">
                            <iframe
                                src={urls.govCodeUrl}
                                className="w-full h-full border-none"
                                title="San Andreas Government Code"
                                allow="autoplay"
                            />
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-slate-950 px-6 py-2 text-center border-t border-slate-800">
                            <p className="text-xs text-slate-500 font-mono">DOJ NOTICE: This document is managed externally.</p>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
