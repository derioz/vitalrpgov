"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FaUserCircle, FaBars, FaTimes, FaGlobeAmericas, FaBalanceScale, FaShieldAlt, FaAmbulance, FaFire, FaBell } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Navbar = () => {
    const { user, userProfile } = useAuth();
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
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
                ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-md py-3'
                : 'bg-transparent py-5'
                }`}
        >
            <div className="container mx-auto px-6">
                <nav className="flex items-center justify-between">
                    {/* Logo Area */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="relative w-10 h-10 transition-transform duration-300 group-hover:scale-110">
                            <img src="/vitalrpgov/logo.png" alt="Seal" className="w-full h-full object-contain drop-shadow-sm" />
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif font-bold text-lg leading-tight text-slate-800 dark:text-slate-100 tracking-tight">
                                San Andreas
                            </span>
                            <span className="text-[10px] font-bold tracking-[0.2em] text-amber-500 uppercase">
                                Government
                            </span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-1">

                        {/* Main Portal Link - Separated */}
                        <div className="mr-4 pr-4 border-r border-slate-200 dark:border-slate-700">
                            <Link
                                href="/"
                                className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold transition-all duration-300 ${pathname === '/'
                                    ? 'bg-slate-900 text-white shadow-lg'
                                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                                    }`}
                            >
                                <FaGlobeAmericas />
                                Portal
                            </Link>
                        </div>

                        {/* Faction Links */}
                        <div className="bg-slate-100/50 dark:bg-slate-800/50 backdrop-blur-sm p-1 rounded-full border border-slate-200/50 dark:border-slate-700/50 flex items-center mr-4">
                            {navLinks.map((link) => {
                                const isActive = pathname.startsWith(link.href) && link.href !== '/';
                                return (
                                    <Link
                                        key={link.name}
                                        href={link.href}
                                        className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 group ${isActive
                                            ? `${link.activeColor} ${link.activeBg} font-bold shadow-sm`
                                            : `text-slate-500 dark:text-slate-400 ${link.color} ${link.bgColor}`
                                            }`}
                                    >
                                        <link.icon className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                                        {link.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
                            <div className="flex items-center gap-3">
                                {/* Notification Bell */}
                                {user && (
                                    <NotificationBell userId={user.uid} />
                                )}

                                {user ? (
                                    <Link
                                        href="/admin/profile?tab=complaints"
                                        className="flex items-center gap-2 pl-2 pr-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors border border-slate-200 dark:border-slate-700 group"
                                    >
                                        <div className="w-7 h-7 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-white transition-colors">
                                            <FaUserCircle size={14} />
                                        </div>
                                        <span className="text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                                            {userProfile?.icName ? userProfile.icName.split(' ')[0] : user.email?.split('@')[0]}
                                        </span>
                                    </Link>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="px-5 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-sm font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                                    >
                                        Login
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu Button - Simplified */}
                    <button
                        className="md:hidden p-2 text-slate-600 dark:text-slate-300"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
                    </button>
                </nav>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-xl p-4 md:hidden flex flex-col gap-2">
                    <Link
                        href="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white font-bold"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        <FaGlobeAmericas /> Portal
                    </Link>
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${link.color} ${link.bgColor} hover:bg-opacity-10`}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            <link.icon /> {link.name}
                        </Link>
                    ))}
                    <div className="h-px bg-slate-200 dark:bg-slate-700 my-2"></div>
                    {user ? (
                        <Link href="/admin" className="block px-4 py-3 font-bold text-amber-500">
                            Dashboard ({userProfile?.icName ? userProfile.icName.split(' ')[0] : user.email?.split('@')[0]})
                        </Link>
                    ) : (
                        <Link href="/login" className="block px-4 py-3 font-bold text-amber-500">Login</Link>
                    )}
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

    useEffect(() => {
        if (!userId) return;

        // Listen for unread complaints where current user is the owner
        const q = query(
            collection(db, 'complaints'),
            where('userId', '==', userId),
            where('isReadByUser', '==', false)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.docs.length);
        });

        return () => unsubscribe();
    }, [userId]);

    if (unreadCount === 0) return null;

    return (
        <Link href="/admin/profile?tab=complaints" className="relative p-2 text-slate-400 hover:text-amber-500 transition-colors">
            <FaBell size={20} />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full animate-pulse">
                {unreadCount}
            </span>
        </Link>
    );
};

export default Navbar;
