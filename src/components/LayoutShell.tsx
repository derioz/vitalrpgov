"use client";

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isHome = pathname === '/';

    return (
        <>
            {!isHome && <Navbar />}
            <main
                className="bg-slate-50 dark:bg-black w-full"
                style={{
                    flex: 1,
                    paddingTop: isHome ? '0px' : '95px', // Reduced from 120px to 95px globally for tighter feel, 0px for home
                    minHeight: '100vh',
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100%'
                }}
            >
                {children}
            </main>
            {!isHome && <Footer />}
        </>
    );
}
