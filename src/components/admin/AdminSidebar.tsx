"use client";

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
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
    FaLink,
    FaExternalLinkAlt,
    FaCode,
    FaShieldAlt,
    FaClipboardList,
    FaUserTie,
    FaBuilding,
    FaDatabase,
    FaHistory,
    FaChevronLeft,
    FaChevronRight,
    FaAmbulance,
    FaFireExtinguisher,
    FaTimes
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import AdminCollapsible from './AdminCollapsible';

interface AdminSidebarProps {
    isCollapsed?: boolean;
    onToggle?: () => void;
    onClose?: () => void;
}

const SidebarItem = ({ icon: Icon, label, href, active, isSystem = false, onClick, isCollapsed, imageUrl }: any) => (
    <Link
        href={href}
        prefetch={false} // Prevent RSC prefetch errors (enqueueModel)
        onClick={(e) => {
            if (onClick) onClick();
        }}
        title={isCollapsed ? label : ""}
        className={`
            group flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-500 relative overflow-hidden
            ${active
                ? 'bg-indigo-600 shadow-[0_0_25px_rgba(79,70,229,0.4)] text-white'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }
            ${isSystem ? 'hover:bg-red-500/10 hover:text-red-400' : ''}
            ${isCollapsed ? 'justify-center px-0 w-12 mx-auto' : ''}
        `}
    >
        {/* Glow effect for active state */}
        {active && (
            <div className="absolute inset-0 bg-white/20 blur-xl"></div>
        )}

        {imageUrl ? (
            <div className={`
                relative z-10 w-5 h-5 rounded-md overflow-hidden border border-white/20 transition-all duration-500
                ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}
            `}>
                <img src={imageUrl} alt={label} className="w-full h-full object-cover" />
            </div>
        ) : (
            <Icon className={`
                relative z-10 transition-all duration-500
                ${active ? 'scale-110' : 'group-hover:scale-110 group-hover:rotate-6'}
                ${isCollapsed ? 'text-lg' : 'text-sm'}
            `} />
        )}

        {!isCollapsed && <span className="relative z-10 font-bold tracking-tight text-xs uppercase">{label}</span>}

        {active && !isCollapsed && (
            <div className="absolute right-3 w-1 h-1 rounded-full bg-white animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
        )}
    </Link>
);

export default function AdminSidebar({ isCollapsed = false, onToggle, onClose }: AdminSidebarProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { signOut, userProfile, loading } = useAuth();

    // Helper to check query param safely
    const hasParam = (key: string, value: string) => searchParams.get(key) === value;

    const isActive = (path: string) => {
        if (path === '/admin' && pathname === '/admin') return true;
        if (path !== '/admin' && pathname.startsWith(path)) return true;
        return false;
    };

    if (loading) return null;

    // Role Checks
    const roles = userProfile?.roles || [];
    const isSuperAdmin = roles.includes('superadmin');
    const isDeptLeader = roles.includes('admin');

    const hasLspd = isSuperAdmin || (isDeptLeader && roles.includes('lspd'));
    const hasLsems = isSuperAdmin || (isDeptLeader && roles.includes('lsems'));
    const hasSafd = isSuperAdmin || (isDeptLeader && roles.includes('safd'));
    const hasDoj = isSuperAdmin || (isDeptLeader && roles.includes('doj'));

    return (
        <aside className={`
            h-full flex flex-col transition-all duration-500 ease-in-out
            bg-black/60 backdrop-blur-2xl border border-white/10 rounded-[2rem] overflow-hidden shadow-2xl relative
            ${isCollapsed ? 'w-20' : 'w-80'}
        `}>

            {/* Header Area */}
            <div className={`
                h-20 px-6 border-b border-white/5 flex items-center transition-all duration-500
                ${isCollapsed ? 'justify-center px-0' : 'justify-between'}
            `}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                        <FaShieldAlt size={18} />
                    </div>
                    {!isCollapsed && (
                        <div>
                            <h2 className="font-black text-white text-sm leading-none mb-1 tracking-tighter">COMMAND</h2>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-400/80">CENTER</span>
                        </div>
                    )}
                </div>
                {onClose && (
                    <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white p-2">
                        <FaTimes size={16} />
                    </button>
                )}
            </div>

            {/* Scrollable Nav */}
            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar space-y-8">

                <div className="space-y-1">
                    <SidebarItem
                        icon={FaChartPie}
                        label="Dashboard"
                        href="/admin"
                        active={pathname === '/admin'}
                        onClick={onClose}
                        isCollapsed={isCollapsed}
                    />
                    <SidebarItem
                        icon={FaCode}
                        label="Changelog"
                        href="/admin/changelog"
                        active={pathname === '/admin/changelog'}
                        isSystem
                        onClick={onClose}
                        isCollapsed={isCollapsed}
                    />
                </div>

                {/* DOJ Section */}
                {hasDoj && (
                    <AdminCollapsible title="Judiciary" icon={FaGavel} isCollapsed={isCollapsed}>
                        <SidebarItem
                            icon={FaBalanceScale}
                            label="Bar Association"
                            href="/admin/bar"
                            active={pathname.includes('bar')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaBook}
                            label="Public Records"
                            href="/admin/records"
                            active={pathname.includes('records')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaLink}
                            label="Resources"
                            href="/admin/doj/resources"
                            active={isActive('/admin/doj/resources')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExternalLinkAlt}
                            label="Quick Links"
                            href="/admin/doj/quick-links"
                            active={isActive('/admin/doj/quick-links')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaGavel}
                            label="Court Dockets"
                            href="/admin/doj/dockets"
                            active={isActive('/admin/doj/dockets')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExclamationCircle}
                            label="Complaints"
                            href="/admin/complaints?dept=DOJ"
                            active={pathname === '/admin/complaints' && (!searchParams.get('dept') || hasParam('dept', 'DOJ'))}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaUserShield}
                            label="Roster"
                            href="/admin/roster?dept=DOJ"
                            active={pathname === '/admin/roster' && hasParam('dept', 'DOJ')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaBriefcase}
                            label="Careers"
                            href="/admin/careers?dept=DOJ"
                            active={pathname.includes('careers') && (!searchParams.get('dept') || hasParam('dept', 'DOJ'))}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                    </AdminCollapsible>
                )}

                {/* LSPD Section */}
                {hasLspd && (
                    <AdminCollapsible title="Police" icon={FaShieldAlt} isCollapsed={isCollapsed}>
                        <SidebarItem
                            icon={FaBullhorn}
                            label="Announcements"
                            href="/admin/announcements?dept=LSPD"
                            active={pathname.includes('announcements') && hasParam('dept', 'LSPD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExclamationCircle}
                            label="Complaints"
                            href="/admin/complaints?dept=LSPD"
                            active={pathname === '/admin/complaints' && hasParam('dept', 'LSPD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaUserShield}
                            label="Roster"
                            href="/admin/roster?dept=LSPD"
                            active={pathname === '/admin/roster' && hasParam('dept', 'LSPD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaLink}
                            label="Resources"
                            href="/admin/lspd/resources"
                            active={isActive('/admin/lspd/resources')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExternalLinkAlt}
                            label="Quick Links"
                            href="/admin/lspd/quick-links"
                            active={isActive('/admin/lspd/quick-links')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaBriefcase}
                            label="Careers"
                            href="/admin/careers?dept=LSPD"
                            active={pathname.includes('careers') && hasParam('dept', 'LSPD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                    </AdminCollapsible>
                )}

                {/* LSEMS Section */}
                {hasLsems && (
                    <AdminCollapsible title="Medical" icon={FaAmbulance} isCollapsed={isCollapsed}>
                        <SidebarItem
                            icon={FaBullhorn}
                            label="Announcements"
                            href="/admin/announcements?dept=LSEMS"
                            active={pathname.includes('announcements') && hasParam('dept', 'LSEMS')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExclamationCircle}
                            label="Complaints"
                            href="/admin/complaints?dept=LSEMS"
                            active={pathname === '/admin/complaints' && hasParam('dept', 'LSEMS')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaUserShield}
                            label="Roster"
                            href="/admin/roster?dept=LSEMS"
                            active={pathname === '/admin/roster' && hasParam('dept', 'LSEMS')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaLink}
                            label="Resources"
                            href="/admin/lsems/resources"
                            active={isActive('/admin/lsems/resources')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExternalLinkAlt}
                            label="Quick Links"
                            href="/admin/lsems/quick-links"
                            active={isActive('/admin/lsems/quick-links')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaBriefcase}
                            label="Careers"
                            href="/admin/careers?dept=LSEMS"
                            active={pathname.includes('careers') && hasParam('dept', 'LSEMS')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                    </AdminCollapsible>
                )}

                {/* SAFD Section */}
                {hasSafd && (
                    <AdminCollapsible title="Fire Dept" icon={FaFireExtinguisher} isCollapsed={isCollapsed}>
                        <SidebarItem
                            icon={FaBullhorn}
                            label="Announcements"
                            href="/admin/announcements?dept=SAFD"
                            active={pathname.includes('announcements') && hasParam('dept', 'SAFD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExclamationCircle}
                            label="Complaints"
                            href="/admin/complaints?dept=SAFD"
                            active={pathname === '/admin/complaints' && hasParam('dept', 'SAFD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaUserShield}
                            label="Roster"
                            href="/admin/roster?dept=SAFD"
                            active={pathname === '/admin/roster' && hasParam('dept', 'SAFD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaLink}
                            label="Resources"
                            href="/admin/safd/resources"
                            active={isActive('/admin/safd/resources')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaExternalLinkAlt}
                            label="Quick Links"
                            href="/admin/safd/quick-links"
                            active={isActive('/admin/safd/quick-links')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                        <SidebarItem
                            icon={FaBriefcase}
                            label="Careers"
                            href="/admin/careers?dept=SAFD"
                            active={pathname.includes('careers') && hasParam('dept', 'SAFD')}
                            onClick={onClose}
                            isCollapsed={isCollapsed}
                        />
                    </AdminCollapsible>
                )}

            </div>

            {/* Collapse Toggle Button (Fixed at bottom) */}
            <div className={`p-4 border-t border-white/5 bg-white/5 hidden lg:block`}>
                <button
                    onClick={onToggle}
                    className="w-full h-10 rounded-xl flex items-center justify-center gap-2 hover:bg-white/10 text-slate-400 hover:text-white transition-all duration-300 group font-bold text-[10px] uppercase tracking-widest"
                >
                    {isCollapsed ? (
                        <FaChevronRight className="group-hover:translate-x-0.5 transition-transform" />
                    ) : (
                        <>
                            <FaChevronLeft className="group-hover:-translate-x-0.5 transition-transform" />
                            <span>Collapse Menu</span>
                        </>
                    )}
                </button>
            </div>

            {/* User Profile / Footer */}
            <div className={`p-4 bg-black/40 border-t border-white/5 space-y-2 transition-all duration-500`}>
                {isSuperAdmin && (
                    <SidebarItem
                        icon={FaUsers}
                        label="Manage Users"
                        href="/admin/users"
                        active={isActive('/admin/users')}
                        isSystem
                        onClick={onClose}
                        isCollapsed={isCollapsed}
                    />
                )}

                <SidebarItem
                    icon={FaUserCircle}
                    label="My Profile"
                    href="/admin/profile"
                    active={isActive('/admin/profile')}
                    isSystem
                    onClick={onClose}
                    isCollapsed={isCollapsed}
                    imageUrl={userProfile?.photoURL}
                />

                <button
                    onClick={() => signOut()}
                    className={`
                        w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-white hover:bg-red-500/20 transition-all duration-300 group
                        ${isCollapsed ? 'justify-center px-0' : ''}
                    `}
                    title={isCollapsed ? "Log Out" : ""}
                >
                    <FaSignOutAlt className={`${isCollapsed ? 'text-lg' : 'text-sm'} group-hover:-translate-x-1 transition-transform`} />
                    {!isCollapsed && <span className="text-xs font-black uppercase tracking-widest">Log Out</span>}
                </button>
            </div>

        </aside>
    );
}
