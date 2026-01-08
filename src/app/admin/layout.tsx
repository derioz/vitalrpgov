"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { usePathname } from "next/navigation";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-950 text-slate-400 font-mono tracking-widest uppercase animate-pulse">
                INITIALIZING SECURE CONNECTION...
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect
    }

    // RBAC CHECK
    // Allow access if:
    // 1. User has 'admin' role
    // 2. User has ANY faction role (lspd, lsems, etc.) -> They need access to Announcements (conceptually)
    // 3. User is visiting /admin/profile (Self-service)

    // Check if current path is a restricted area for their role
    // If NO roles, block everything except /admin/profile

    const isProfilePage = pathname === '/admin/profile';
    const hasAnyRole = userProfile?.roles && userProfile.roles.length > 0;

    if (!hasAnyRole && !isProfilePage) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5"></div>
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 bg-slate-900/50 backdrop-blur-2xl border border-white/10 p-10 rounded-3xl max-w-lg shadow-2xl">
                    <h1 className="text-4xl font-black text-red-500 mb-4 tracking-tight">RESTRICTED ACCESS</h1>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        You do not have the necessary security clearance to access the Government Command Center.
                        <br /><br />
                        <span className="text-slate-500 text-sm">Error Code: PERM_DENIED_NO_ROLES</span>
                    </p>
                    <div className="flex flex-col gap-4">
                        <button
                            onClick={() => router.push('/admin/profile')}
                            className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold hover:shadow-lg hover:shadow-blue-600/20 transition-all transform hover:scale-[1.02]"
                        >
                            Access My Profile
                        </button>
                        <button
                            onClick={() => router.push('/')}
                            className="w-full py-4 rounded-xl bg-slate-800 text-slate-300 font-bold hover:bg-slate-700 transition"
                        >
                            Return to Portal
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">

            {/* Ambient System Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="relative z-10 flex pb-10 container mx-auto px-6 max-w-[1800px] h-screen overflow-hidden gap-8" style={{ paddingTop: '95px' }}>

                {/* Floating Sidebar */}
                <div className="w-80 flex-shrink-0 hidden lg:block h-full animate-fade-in-left">
                    <AdminSidebar />
                </div>

                {/* Main Content Shell */}
                <div className="flex-1 flex flex-col min-w-0 h-full animate-fade-in-up delay-100">

                    {/* Header Strip */}
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 pb-6 border-b border-white/5">
                        <div>
                            <div className="flex items-center gap-3 text-indigo-400 font-mono text-xs tracking-[0.3em] uppercase opacity-80 mb-2">
                                <span className="w-6 h-[1px] bg-indigo-500"></span>
                                Command Center
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight flex items-center gap-3">
                                Welcome,
                                {userProfile?.icName ? (
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-300">
                                        {userProfile.icName}
                                    </span>
                                ) : (
                                    <span className="text-slate-500 blur-sm hover:blur-none transition-all duration-300 cursor-pointer bg-slate-900/50 px-3 py-0.5 rounded-lg border border-white/5">
                                        {user?.email?.split('@')[0]}
                                    </span>
                                )}
                            </h1>
                        </div>
                        <div className="text-right hidden md:block">
                            <p className="text-slate-400 font-mono text-sm tracking-wide mb-1 opacity-70">{currentDate}</p>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                                </span>
                                <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase">System Online</span>
                            </div>
                        </div>
                    </div>

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar relative">
                        {children}
                    </main>

                </div>
            </div>
        </div>
    );
}
