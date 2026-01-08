"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { FaUser, FaSave, FaIdCard, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function ProfilePage() {
    const { user, userProfile, refreshProfile } = useAuth();
    const [icName, setIcName] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showEmail, setShowEmail] = useState(false);

    useEffect(() => {
        if (userProfile?.icName) {
            setIcName(userProfile.icName);
        } else {
            setIcName('');
        }
    }, [userProfile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setMessage('');

        try {
            // Using setDoc with merge: true guarantees creation if it doesn't exist
            await setDoc(doc(db, 'users', user.uid), {
                icName: icName,
                email: user.email // Ensure email is kept in sync
            }, { merge: true });

            await refreshProfile();
            setMessage('Profile updated successfully!');
        } catch (error) {
            console.error(error);
            setMessage('Error updating profile.');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async () => {
        if (!user) return;
        if (!confirm('Are you sure? This will remove your custom name and revert to your blurred email.')) return;

        setLoading(true);
        setMessage('');

        try {
            // Set icName to empty string 
            await setDoc(doc(db, 'users', user.uid), {
                icName: ''
            }, { merge: true });

            setIcName('');
            await refreshProfile();
            setMessage('Custom name removed. Profile is now anonymous/blurred.');
        } catch (error) {
            console.error(error);
            setMessage('Error removing name.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <FaUser className="text-blue-600" /> My Profile
            </h1>

            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg">
                <form onSubmit={handleSave} className="space-y-6">

                    <div>
                        <label className="block text-sm font-bold mb-2">Google Account (Private)</label>
                        <div className="relative">
                            <input
                                type="text"
                                disabled
                                value={user?.email || ''}
                                className={`w-full p-3 rounded border border-slate-300 dark:border-slate-600 bg-slate-100 dark:bg-slate-900/50 opacity-70 transition-all ${!showEmail ? 'blur-sm select-none' : ''}`}
                            />
                            <button
                                type="button"
                                onClick={() => setShowEmail(!showEmail)}
                                className="absolute right-3 top-3 text-slate-500 hover:text-blue-500 z-10"
                                title={showEmail ? "Hide Email" : "Show Email"}
                            >
                                {showEmail ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
                            </button>
                        </div>
                        {!showEmail && <p className="text-xs text-slate-400 mt-1">* Email hidden for streaming privacy</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold mb-2 flex items-center gap-2">
                            <FaIdCard /> In-Character Name
                        </label>
                        <p className="text-xs text-slate-500 mb-2">This is the name that will be displayed on the portal (e.g., "Officer John Doe").</p>
                        <input
                            type="text"
                            required
                            placeholder="Firstname Lastname"
                            value={icName}
                            onChange={(e) => setIcName(e.target.value)}
                            className="w-full p-3 rounded border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 font-medium text-lg"
                        />
                    </div>

                    {message && (
                        <div className={`p-3 rounded text-sm ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                            {message}
                        </div>
                    )}

                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                        {userProfile?.icName ? (
                            <button
                                type="button"
                                onClick={handleRemove}
                                disabled={loading}
                                className="text-red-500 hover:text-red-700 text-sm font-bold opacity-80 hover:opacity-100 transition"
                            >
                                Remove Custom Name
                            </button>
                        ) : <div></div>}

                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg flex items-center gap-2 transition"
                        >
                            <FaSave /> {loading ? 'Saving...' : 'Save Profile'}
                        </button>
                    </div>

                    {/* DEV BOOTSTRAP: Remove in production */}
                    <div className="pt-8 text-center border-t border-slate-700/50 mt-8">
                        <button
                            type="button"
                            onClick={async () => {
                                if (!user) return;
                                if (!confirm("SECURITY WARNING: Grant yourself full System Admin privileges?")) return;
                                await setDoc(doc(db, 'users', user.uid), { roles: ['admin'] }, { merge: true });
                                await refreshProfile();
                                alert("Admin Role Granted. Welcome, Commander.");
                            }}
                            className="text-xs text-slate-500 hover:text-indigo-400 font-mono tracking-widest uppercase opacity-30 hover:opacity-100 transition-all"
                        >
                            [DEV: Grant Admin Override]
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
