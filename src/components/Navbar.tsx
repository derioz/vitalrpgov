"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaUserCircle, FaBars, FaTimes, FaGlobeAmericas, FaBalanceScale, FaShieldAlt, FaAmbulance, FaFire, FaBell } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Navbar = () => {
    const { user, userProfile, signOut } = useAuth();
    const pathname = usePathname();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        {
            name: 'DOJ',
            href: '/doj',
            icon: FaBalanceScale,
            color: 'hover:text-[#D4AF37]', // Gold
            bgColor: 'hover:bg-[#D4AF37]/10',
            activeColor: 'text-[#D4AF37]',
            activeBg: 'bg-[#D4AF37]/10'
        },
        {
            name: 'LSPD',
            href: '/lspd',
            icon: FaShieldAlt,
            color: 'hover:text-blue-500',
            bgColor: 'hover:bg-blue-500/10',
            activeColor: 'text-blue-500',
            activeBg: 'bg-blue-500/10'
        },
        {
            name: 'LSEMS',
            href: '/lsems',
            icon: FaAmbulance,
            color: 'hover:text-red-500',
            bgColor: 'hover:bg-red-500/10',
            activeColor: 'text-red-500',
            activeBg: 'bg-red-500/10'
        },
        {
            name: 'SAFD',
            href: '/safd',
            icon: FaFire,
            color: 'hover:text-orange-500',
            bgColor: 'hover:bg-orange-500/10',
            activeColor: 'text-orange-500',
            activeBg: 'bg-orange-500/10'
        },
    ];

    return (
        <header
            className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-500 flex justify-center pointer-events-none p-4 ${scrolled ? 'pt-2' : 'pt-6'}`}
        >
            <div className={`
                pointer-events-auto flex items-center justify-between px-6 py-2.5 
                rounded-2xl border transition-all duration-500 
                ${scrolled
                    ? 'w-full max-w-5xl bg-black/60 backdrop-blur-xl border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]'
                    : 'w-full max-w-[95%] bg-black/40 backdrop-blur-lg border-white/5'
                }
            `}>
                {/* Logo Area */}
                <Link href="/" className="flex items-center gap-4 group">
                    <div className="relative w-9 h-9 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12">
                        <div className="absolute inset-0 bg-amber-500/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <img src="/logo.png" alt="Seal" className="relative z-10 w-full h-full object-contain filter brightness-110 drop-shadow-[0_0_8px_rgba(245,158,11,0.3)]" />
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-4">
                        <span className="font-serif font-black text-sm leading-tight text-white tracking-widest uppercase opacity-90">
                            San Andreas
                        </span>
                        <span className="text-[10px] font-black tracking-[0.3em] text-amber-500/80 uppercase">
                            Government
                        </span>
                    </div>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-2">
                    {/* Portal Separator */}
                    <Link
                        href="/"
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-300
                            ${pathname === '/'
                                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                            }
                        `}
                    >
                        <FaGlobeAmericas size={14} />
                        Portal
                    </Link>

                    <div className="h-6 w-px bg-white/10 mx-2"></div>

                    {/* Faction Links Capsule */}
                    <div className="flex items-center gap-1 p-1 bg-white/5 rounded-xl border border-white/5">
                        {navLinks.map((link) => {
                            const isActive = pathname.startsWith(link.href) && link.href !== '/';
                            return (
                                <Link
                                    key={link.name}
                                    href={link.href}
                                    className={`
                                        flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all duration-300 group
                                        ${isActive
                                            ? `${link.activeColor} bg-white/10 shadow-inner`
                                            : `text-slate-500 ${link.color} hover:bg-white/5`
                                        }
                                    `}
                                >
                                    <link.icon className={`text-sm transition-transform duration-500 ${isActive ? 'scale-110 rotate-3' : 'group-hover:scale-110 group-hover:rotate-3'}`} />
                                    <span className="opacity-80 group-hover:opacity-100">{link.name}</span>
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2">
                    {user && <NotificationBell userId={user.uid} />}

                    {user ? (
                        <div className="relative group/profile">
                            <Link
                                href="/admin/profile"
                                className="flex items-center gap-3 pl-1 pr-4 py-1.5 bg-white/5 hover:bg-white/10 rounded-xl border border-white/5 transition-all duration-300 group ring-offset-0 focus:ring-2 focus:ring-amber-500/50"
                            >
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-black shadow-lg shadow-amber-500/20 group-hover:scale-105 transition-transform overflow-hidden">
                                    {userProfile?.photoURL ? (
                                        <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <FaUserCircle size={16} />
                                    )}
                                </div>
                                <div className="flex flex-col -space-y-0.5">
                                    <span className="text-[10px] font-black text-amber-500 uppercase tracking-tighter opacity-70">Authenticated</span>
                                    <span className="text-xs font-bold text-white max-w-[80px] truncate uppercase tracking-tight">
                                        {userProfile?.icName ? userProfile.icName.split(' ')[0] : 'Resident'}
                                    </span>
                                </div>
                            </Link>

                            {/* Hover Dropdown Menu */}
                            <div className="absolute top-full right-0 pt-2 w-56 opacity-0 translate-y-2 pointer-events-none group-hover/profile:opacity-100 group-hover/profile:translate-y-0 group-hover/profile:pointer-events-auto transition-all duration-300 z-[60]">
                                <div className="bg-black/90 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 space-y-1">
                                    <div className="px-3 py-2 mb-1 border-b border-white/5">
                                        <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Account Actions</p>
                                    </div>

                                    <Link href="/admin/profile" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all group/item">
                                        <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-amber-500 group-hover/item:text-black transition-all">
                                            <FaUserCircle size={14} />
                                        </div>
                                        Edit Profile
                                    </Link>

                                    {(userProfile?.roles?.includes('admin') || userProfile?.roles?.includes('superadmin')) && (
                                        <Link href="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all group/item">
                                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-indigo-500 group-hover/item:text-white transition-all">
                                                <FaShieldAlt size={14} />
                                            </div>
                                            Admin Panel
                                        </Link>
                                    )}

                                    {userProfile?.roles?.includes('superadmin') && (
                                        <Link href="/admin/users" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-white/5 transition-all group/item">
                                            <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover/item:bg-purple-500 group-hover/item:text-white transition-all">
                                                <FaGlobeAmericas size={14} />
                                            </div>
                                            Manage Users
                                        </Link>
                                    )}

                                    <div className="pt-1 mt-1 border-t border-white/5">
                                        <button
                                            onClick={() => signOut()}
                                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/10 transition-all group/item"
                                        >
                                            <div className="w-7 h-7 rounded-lg bg-red-500/10 flex items-center justify-center group-hover/item:bg-red-500 group-hover/item:text-white transition-all">
                                                <FaTimes size={14} />
                                            </div>
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <Link
                            href="/login"
                            className="px-6 py-2 bg-white text-black rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                        >
                            Log In
                        </Link>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden w-10 h-10 flex items-center justify-center text-white bg-white/5 rounded-xl border border-white/5"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay - Capsule Style */}
            {mobileMenuOpen && (
                <div className="absolute top-24 left-4 right-4 bg-black/90 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-2xl md:hidden overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-500 to-amber-300 opacity-50"></div>
                    <div className="grid gap-2">
                        <Link
                            href="/"
                            className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-sm transition-all ${pathname === '/' ? 'bg-white text-black' : 'text-slate-400 bg-white/5'}`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <FaGlobeAmericas /> Portal
                        </Link>
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className={`flex items-center gap-3 px-5 py-4 rounded-2xl font-black uppercase tracking-widest text-sm bg-white/5 ${link.color}`}
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                <link.icon /> {link.name}
                            </Link>
                        ))}
                    </div>
                    <div className="mt-6 pt-6 border-t border-white/5">
                        {user ? (
                            <Link
                                href="/admin"
                                className="flex items-center justify-center gap-3 w-full py-4 bg-amber-500 text-black rounded-2xl font-black uppercase tracking-widest text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Enter Admin Panel
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                className="flex items-center justify-center gap-3 w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Log In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </header>
    );
};

interface NotificationBellProps {
    userId: string;
}

const NotificationBell = ({ userId }: NotificationBellProps) => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<any[]>([]);

    useEffect(() => {
        if (!userId) return;

        // Listen for unread complaints where current user is the owner
        // FIXED: generic 'userId' to 'authorId' to match schema
        const q = query(
            collection(db, 'complaints'),
            where('authorId', '==', userId),
            where('isReadByUser', '==', false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.docs.length);
            setNotifications(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => unsubscribe();
    }, [userId]);

    const markAllAsRead = async () => {
        if (notifications.length === 0) return;

        try {
            // We can't use writeBatch easily here without importing it or using a utility, 
            // but we can iterate since the number of UNREAD items per user is likely small.
            // For robustness, let's just use a promise.all for now or a loop.
            // Ideally we move this to a utility, but for this component:

            const updates = notifications.map(n =>
                updateDoc(doc(db, 'complaints', n.id), { isReadByUser: true })
            );
            await Promise.all(updates);
            setIsOpen(false);
        } catch (error) {
            console.error("Error marking as read", error);
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.notification-container')) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative notification-container">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2 transition-colors ${isOpen || unreadCount > 0 ? 'text-amber-500' : 'text-slate-400 hover:text-amber-500'}`}
            >
                <FaBell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse shadow-sm shadow-red-500/50">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-fade-in-up z-50">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950">
                        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-200">Notifications</h4>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs font-bold text-blue-500 hover:text-blue-400 transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>

                    <div className="max-h-64 overflow-y-auto">
                        {unreadCount === 0 ? (
                            <div className="p-8 text-center text-slate-400">
                                <FaBell className="mx-auto mb-2 opacity-20" size={24} />
                                <p className="text-xs">No new notifications</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-slate-100 dark:divide-slate-800">
                                {notifications.map((n) => (
                                    <Link
                                        key={n.id}
                                        href="/my-complaints"
                                        onClick={() => setIsOpen(false)}
                                        className="block p-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className={`w-2 h-2 mt-1.5 rounded-full bg-red-500 shrink-0`}></div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800 dark:text-white line-clamp-1">
                                                    Update on {n.department} Complaint
                                                </p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                                                    Your complaint status is now <strong>{n.status}</strong>. Click to view details.
                                                </p>
                                                <span className="text-[10px] text-slate-400 mt-2 block">
                                                    {n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : 'Recently'}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="p-3 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 text-center">
                        <Link
                            href="/my-complaints"
                            onClick={() => setIsOpen(false)}
                            className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors block py-1"
                        >
                            View All Complaints
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Navbar;
