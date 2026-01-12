"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaBars } from "react-icons/fa";

interface AdminTopBarProps {
    onMobileMenuOpen: () => void;
    pageTitle: string;
}

export default function AdminTopBar({ onMobileMenuOpen, pageTitle }: AdminTopBarProps) {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    return (
        <div className="flex items-center justify-between px-6 py-3 mb-6 bg-white/[0.03] backdrop-blur-xl border border-white/5 rounded-2xl shadow-xl animate-fade-in-up">
            <div className="flex items-center gap-4">
                {/* Mobile Toggle Button */}
                <button
                    onClick={onMobileMenuOpen}
                    className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
                >
                    <FaBars size={18} />
                </button>

                <div className="flex items-center gap-3">
                    <div className="h-5 w-px bg-white/10 hidden md:block"></div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest hidden sm:block">Command</span>
                        <span className="text-white/20 text-xs hidden sm:block">/</span>
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">{pageTitle}</h2>
                    </div>
                </div>
            </div>

            <div className="flex items-center gap-4">
                {/* Dynamic Quick Actions */}
                <div className="hidden sm:flex items-center gap-2 pr-4 border-r border-white/10">
                    {pathname.includes('announcements') && (
                        <button
                            onClick={() => router.push(`/admin/announcements/new?dept=${searchParams.get('dept') || 'LSPD'}`)}
                            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            + New Post
                        </button>
                    )}
                    {pathname.includes('records') && (
                        <button
                            onClick={() => router.push('/admin/records/new')}
                            className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            + New Record
                        </button>
                    )}
                    {pathname.includes('roster') && (
                        <button
                            onClick={() => router.push('/admin/roster/manage')}
                            className="px-3 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20 transition-all text-[10px] font-black uppercase tracking-widest"
                        >
                            Manage Roster
                        </button>
                    )}
                </div>

                {/* Right Side Actions - Simplified */}
                <div className="flex items-center gap-4">
                    <div className="hidden md:flex flex-col items-end px-4 py-1.5 bg-white/5 rounded-xl border border-white/5">
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter">System Ready</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Authenticated</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
