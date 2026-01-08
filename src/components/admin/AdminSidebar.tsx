"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaChartPie,
    FaGavel,
    FaBook,
    FaBalanceScale,
    FaExclamationCircle,
    FaBriefcase,
    FaBullhorn,
    FaUserShield,
    FaCog,
    FaUserCircle,
    FaSignOutAlt,
    FaUsers,
    FaLink
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

const SidebarItem = ({ icon: Icon, label, href, active, isSystem = false }: any) => (
    <Link
        href={href}
        className={`
            group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 relative overflow-hidden
            ${active
                ? 'bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.4)] text-white translate-x-1'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }
            ${isSystem ? 'hover:bg-red-500/10 hover:text-red-400' : ''}
        `}
    >
        {/* Glow effect for active state */}
        {active && (
            <div className="absolute inset-0 bg-blue-400/20 blur-xl"></div>
        )}

        <Icon className={`
            relative z-10 transition-transform duration-300
            ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-3'}
        `} size={18} />

        <span className="relative z-10 font-medium tracking-wide text-sm">{label}</span>

        {active && (
            <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        )}
    </Link>
);

const SidebarSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
    <div className="mb-6">
        <h3 className="px-4 text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-1 h-3 bg-slate-700 rounded-full"></span>
            {title}
        </h3>
        <div className="space-y-1">
            {children}
        </div>
    </div>
);

export default function AdminSidebar() {
    const pathname = usePathname();
    const { signOut, userProfile, loading } = useAuth();

    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return true;
        if (path !== '/admin' && pathname.startsWith(path)) return true;
        return false;
    };

    if (loading) return null;

    // Role Checks
    const roles = userProfile?.roles || [];
    const isAdmin = roles.includes('admin');
    const hasLspd = isAdmin || roles.includes('lspd');
    const hasLsems = isAdmin || roles.includes('lsems');
    const hasSafd = isAdmin || roles.includes('safd');
    const hasDoj = isAdmin || roles.includes('doj');

    return (
        <aside className="w-full h-full bg-slate-900/30 backdrop-blur-xl border border-white/5 rounded-3xl flex flex-col overflow-hidden shadow-2xl">

            {/* Header Area */}
            <div className="p-6 border-b border-white/5 bg-white/5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                        <FaUserShield size={22} />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-lg leading-none mb-1">Admin Panel</h2>
                        <span className="text-[10px] uppercase tracking-widest text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">System v3.0</span>
                    </div>
                </div>
            </div>

            {/* Scrollable Nav */}
            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-8">

                <div className="space-y-1">
                    <SidebarItem
                        icon={FaChartPie}
                        label="Dashboard"
                        href="/admin"
                        active={isActive('/admin') && pathname === '/admin'}
                    />
                </div>

                {/* DOJ Section */}
                {hasDoj && (
                    <SidebarSection title="Justice Department">
                        <SidebarItem icon={FaBullhorn} label="Announcements" href="/admin/announcements?dept=DOJ" active={pathname.includes('announcements') && (window.location.search.includes('DOJ') || !window.location.search)} />
                        <SidebarItem icon={FaLink} label="Resources" href="/admin/doj/resources" active={isActive('/admin/doj/resources')} />
                        <SidebarItem icon={FaGavel} label="Court Dockets" href="/admin/doj/dockets" active={isActive('/admin/doj/dockets')} />
                        <SidebarItem icon={FaBook} label="Records Database" href="/admin/records" active={isActive('/admin/records')} />
                        <SidebarItem icon={FaGavel} label="Legislation" href="/admin/laws" active={isActive('/admin/laws')} />
                        <SidebarItem icon={FaBalanceScale} label="Bar Association" href="/admin/bar" active={isActive('/admin/bar')} />
                        <SidebarItem icon={FaExclamationCircle} label="Complaints" href="/admin/complaints" active={isActive('/admin/complaints')} />
                        <SidebarItem icon={FaBriefcase} label="Careers" href="/admin/careers" active={isActive('/admin/careers')} />
                    </SidebarSection>
                )}

                {/* LSPD Section */}
                {hasLspd && (
                    <SidebarSection title="Los Santos Police">
                        <SidebarItem icon={FaBullhorn} label="Announcements" href="/admin/announcements?dept=LSPD" active={pathname.includes('announcements') && window.location.search.includes('LSPD')} />
                        {/* Future: Officers, Incident Reports, etc. */}
                    </SidebarSection>
                )}

                {/* LSEMS Section */}
                {hasLsems && (
                    <SidebarSection title="Medical Services">
                        <SidebarItem icon={FaBullhorn} label="Announcements" href="/admin/announcements?dept=LSEMS" active={pathname.includes('announcements') && window.location.search.includes('LSEMS')} />
                    </SidebarSection>
                )}

                {/* SAFD Section */}
                {hasSafd && (
                    <SidebarSection title="San Andreas Fire">
                        <SidebarItem icon={FaBullhorn} label="Announcements" href="/admin/announcements?dept=SAFD" active={pathname.includes('announcements') && window.location.search.includes('SAFD')} />
                    </SidebarSection>
                )}

            </div>

            {/* User Profile / Footer */}
            <div className="p-4 bg-black/20 border-t border-white/5 space-y-2 backdrop-opacity-50">
                {isAdmin && (
                    <SidebarItem
                        icon={FaUsers}
                        label="Manage Users"
                        href="/admin/users"
                        active={isActive('/admin/users')}
                        isSystem
                    />
                )}

                <SidebarItem
                    icon={FaUserCircle}
                    label="My Profile"
                    href="/admin/profile"
                    active={isActive('/admin/profile')}
                    isSystem
                />

                <button
                    onClick={() => signOut()}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 hover:border-red-500/30 transition-all duration-300 group border border-transparent"
                >
                    <FaSignOutAlt className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-medium">Log Out</span>
                </button>
            </div>

        </aside>
    );
}
