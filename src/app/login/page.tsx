"use client";

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaGoogle, FaShieldAlt } from 'react-icons/fa';

export default function LoginPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [error, setError] = useState('');

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleLogin = async () => {
        try {
            await signInWithGoogle();
        } catch (err: any) {
            setError('Failed to sign in with Google. Please try again.');
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 bg-[url('/grid-bg.png')] relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/90 to-black/90 z-0"></div>

            <div className="relative z-10 w-full max-w-md p-8 bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl shadow-2xl text-center">

                <div className="mb-8 flex justify-center">
                    <img src="/logo.png" alt="Seal" className="w-24 h-24 drop-shadow-2xl animate-pulse-slow" />
                </div>

                <h1 className="text-3xl font-serif font-bold text-white mb-2">Government Access</h1>
                <p className="text-slate-400 mb-8">Secure Identity Verification Required</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-3 rounded mb-6 text-sm">
                        {error}
                    </div>
                )}

                <button
                    onClick={handleLogin}
                    className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 hover:bg-slate-100 font-bold py-4 px-6 rounded-xl transition-all transform hover:scale-[1.02] shadow-lg group"
                >
                    <FaGoogle className="text-2xl text-red-500" />
                    <span>Sign in with Google</span>
                </button>

                <div className="mt-8 pt-8 border-t border-slate-800 text-xs text-slate-500 font-mono">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <FaShieldAlt /> AUTHORIZED PERSONNEL ONLY
                    </div>
                    SAN ANDREAS STATE GOVERNMENT SYSTEM
                </div>
            </div>
        </div>
    );
}
