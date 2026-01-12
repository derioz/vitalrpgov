"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { FaBars } from "react-icons/fa";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ChangelogModal from "@/components/admin/ChangelogModal";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, userProfile, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [changelogOpen, setChangelogOpen] = useState(false);

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

    const isProfilePage = pathname === '/admin/profile';
    const hasAnyRole = userProfile?.roles && userProfile.roles.length > 0;

    if (!hasAnyRole && !isProfilePage) {
        return (
            <div className="min-h-screen bg-black flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
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

    // Breadcrumb logic
    const pathSegments = pathname.split('/').filter(p => p && p !== 'admin');
    const pageTitle = pathSegments.length > 0
        ? pathSegments[pathSegments.length - 1].charAt(0).toUpperCase() + pathSegments[pathSegments.length - 1].slice(1)
        : 'Dashboard';

    return (
        <div className="min-h-screen bg-black text-slate-200 font-sans selection:bg-indigo-500/30 relative overflow-hidden">
            {/* Ambient System Glows */}
            <div className="fixed top-[-20%] left-[-10%] w-[1000px] h-[1000px] bg-indigo-900/10 rounded-full blur-[150px] pointer-events-none opacity-50" />
            <div className="fixed bottom-[-20%] right-[-10%] w-[800px] h-[800px] bg-slate-800/20 rounded-full blur-[120px] pointer-events-none opacity-30" />

            {/* Mobile Sidebar Overlay */}
            {mobileMenuOpen && (
                <div className="fixed inset-0 z-[60] lg:hidden font-sans">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
                    <div className="absolute left-0 top-0 bottom-0 w-80 animate-fade-in-left">
                        <Suspense fallback={<div className="w-80 h-full bg-black/60 backdrop-blur-md" />}>
                            <AdminSidebar
                                isCollapsed={false}
                                onToggle={() => { }}
                                onClose={() => setMobileMenuOpen(false)}
                                onOpenChangelog={() => setChangelogOpen(true)}
                            />
                        </Suspense>
                    </div>
                </div>
            )}

            {/* Layout Wrapper */}
            <div className={`flex transition-all duration-500 h-[calc(100vh-95px)] overflow-hidden p-4 md:p-6 gap-6`}>

                {/* Desktop Sidebar Area */}
                <div className={`
                    hidden lg:block transition-all duration-500 ease-in-out h-full
                    ${sidebarCollapsed ? 'w-20' : 'w-80'}
                `}>
                    <Suspense fallback={<div className="w-full h-full bg-white/5 rounded-[2rem] animate-pulse" />}>
                        <AdminSidebar
                            isCollapsed={sidebarCollapsed}
                            onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                            onOpenChangelog={() => setChangelogOpen(true)}
                        />
                    </Suspense>
                </div>

                {/* Main Content Shell */}
                <div className="flex-1 flex flex-col min-w-0 h-full relative">

                    {/* Top Secondary Hub Menu (Horizontal Context Bar) */}
                    <Suspense fallback={<div className="h-16 mb-6 bg-white/[0.03] rounded-2xl animate-pulse" />}>
                        <AdminTopBar
                            onMobileMenuOpen={() => setMobileMenuOpen(true)}
                            pageTitle={pageTitle}
                        />
                    </Suspense>

                    {/* Scrollable Content Area */}
                    <main className="flex-1 overflow-y-auto pr-2 custom-scrollbar animate-fade-in-up delay-100">
                        {children}
                    </main>
                </div>
            </div>
            {/* Global Changelog Modal */}
            <ChangelogModal
                isOpen={changelogOpen}
                onClose={() => setChangelogOpen(false)}
            />
        </div>
    );
}
