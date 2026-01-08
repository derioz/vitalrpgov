"use client";

import { FaFireExtinguisher, FaFire, FaHardHat, FaTruckMonster, FaClipboardCheck, FaTools, FaPhone, FaChevronRight } from "react-icons/fa";
import FactionAnnouncements from "@/components/FactionAnnouncements";
import FactionQuickNav from "@/components/FactionQuickNav";

export default function SAFDPage() {
    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 relative overflow-hidden font-sans selection:bg-orange-500/30">

            {/* Ambient Background Glows */}
            <div className="fixed top-[-20%] right-[-10%] w-[1000px] h-[1000px] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6 py-12 lg:py-20 max-w-[1600px]">

                {/* Massive Header */}
                <header className="mb-20 relative">
                    <div className="flex flex-col gap-2 relative z-10">
                        <div className="flex items-center gap-3 text-orange-500 font-mono text-xs tracking-[0.3em] uppercase opacity-80 animate-fade-in-up">
                            <span className="w-8 h-[1px] bg-orange-500"></span>
                            Fire & Rescue
                        </div>
                        <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.9] mix-blend-overlay opacity-90 animate-fade-in">
                            SAFD
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-300 text-4xl md:text-6xl mt-2 tracking-normal font-bold">
                                San Andreas Fire Dept.
                            </span>
                        </h1>
                    </div>
                    {/* Floating Watermark Icon */}
                    <FaFireExtinguisher className="absolute top-1/2 right-0 -translate-y-1/2 text-[20rem] text-orange-900/10 pointer-events-none rotate-12" />
                </header>

                {/* Quick Navigation / Key Resources */}
                <FactionQuickNav items={[
                    { label: 'Join SAFD', subLabel: 'Fire Academy', icon: FaClipboardCheck, color: 'orange', href: '#apply' },
                    { label: 'Dept. Roster', subLabel: 'Firefighters', icon: FaHardHat, color: 'red', href: '#roster' },
                    { label: 'Inspections', subLabel: 'Business Safety', icon: FaClipboardCheck, color: 'yellow', href: '#inspections' },
                    { label: 'Burn Permits', subLabel: 'Public Access', icon: FaFire, color: 'green', href: '#permit' },
                ]} />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

                    {/* Left Column: Feed (8 cols) */}
                    <div className="lg:col-span-8 space-y-10 animate-fade-in-up delay-200">
                        <FactionAnnouncements
                            department="SAFD"
                            title="Station Notices"
                            color="orange"
                            icon={FaFire}
                        />
                    </div>

                    {/* Right Column: Interactive panels (4 cols) */}
                    <div className="lg:col-span-4 space-y-8 animate-fade-in-up delay-300">

                        {/* Quick Actions Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            {[
                                { icon: FaClipboardCheck, label: 'Reports', color: 'blue' },
                                { icon: FaHardHat, label: 'Roster', color: 'orange' },
                                { icon: FaTruckMonster, label: 'Fleet', color: 'red' },
                                { icon: FaTools, label: 'Equip', color: 'slate' },
                            ].map((action, i) => (
                                <button key={i} className={`
                                relative overflow-hidden p-6 rounded-2xl bg-slate-800/30 border border-white/5 
                                hover:bg-orange-600 hover:border-orange-500 hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]
                                transition-all duration-300 group text-left
                            `}>
                                    <action.icon className="text-3xl text-slate-400 group-hover:text-white mb-4 transition-colors" />
                                    <span className="block font-bold text-slate-300 group-hover:text-white transition-colors">{action.label}</span>
                                    <FaChevronRight className="absolute bottom-4 right-4 text-white/0 group-hover:text-white/100 transform translate-x-4 group-hover:translate-x-0 transition-all duration-300" />
                                </button>
                            ))}
                        </div>

                        {/* Dispatch Card */}
                        <div className="rounded-3xl bg-gradient-to-br from-orange-600 to-orange-800 p-8 shadow-2xl shadow-orange-900/20 text-white relative overflow-hidden group">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay"></div>
                            <h3 className="text-2xl font-bold mb-2 relative z-10">Fire Dispatch</h3>
                            <p className="text-orange-100 mb-6 relative z-10">Direct line to fire emergency coordination.</p>
                            <button className="w-full py-4 bg-white text-orange-900 font-black rounded-xl shadow-lg hover:bg-orange-50 transform hover:-translate-y-1 transition-all duration-300 relative z-10 flex items-center justify-center gap-2">
                                <FaPhone /> CONNECT RADIO
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
