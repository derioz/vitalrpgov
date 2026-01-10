"use client";

import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FaUser, FaSave, FaIdCard, FaEye, FaEyeSlash, FaDiscord, FaPhone, FaCamera, FaInfoCircle } from 'react-icons/fa';

export default function ProfilePage() {
    const { user, userProfile, refreshProfile } = useAuth();
    const [icName, setIcName] = useState('');
    const [icPhone, setIcPhone] = useState('');
    const [discordId, setDiscordId] = useState('');
    const [bio, setBio] = useState('');

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showEmail, setShowEmail] = useState(false);

    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (userProfile) {
            setIcName(userProfile.icName || '');
            setIcPhone(userProfile.icPhone || '');
            setDiscordId(userProfile.discordId || '');
            setBio(userProfile.bio || '');
        }
    }, [userProfile]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || !e.target.files[0] || !user) return;

        const file = e.target.files[0];
        setUploading(true);
        setMessage('');

        try {
            const storageRef = ref(storage, `profiles/${user.uid}/avatar.jpg`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);

            await setDoc(doc(db, 'users', user.uid), {
                photoURL: downloadURL
            }, { merge: true });

            await refreshProfile();
            setMessage('Profile photo updated!');
        } catch (error) {
            console.error(error);
            setMessage('Error uploading image.');
        } finally {
            setUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setLoading(true);
        setMessage('');

        try {
            await setDoc(doc(db, 'users', user.uid), {
                icName,
                icPhone,
                discordId,
                bio,
                email: user.email // keep synced
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

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
                <FaUser className="text-blue-600" /> My Identity
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                {/* Left Column: Avatar & Basic Info */}
                <div className="md:col-span-1 space-y-6">
                    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg text-center relative overflow-hidden group">
                        <div className="w-40 h-40 mx-auto rounded-full bg-slate-100 dark:bg-slate-700 overflow-hidden relative border-4 border-slate-200 dark:border-slate-600 mb-4 shadow-inner">
                            {userProfile?.photoURL ? (
                                <img src={userProfile.photoURL} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                                <FaUser className="w-full h-full p-8 text-slate-300 dark:text-slate-500" />
                            )}

                            {/* Overlay Upload Button */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                <FaCamera className="text-white text-3xl" />
                            </div>
                        </div>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploading}
                            className="text-sm font-bold text-blue-500 hover:text-blue-400"
                        >
                            {uploading ? 'Uploading...' : 'Change Photo'}
                        </button>

                        <h2 className="text-xl font-bold mt-4 break-words">{icName || 'Anonymous Citizen'}</h2>
                        <p className="text-slate-500 text-sm">{user?.email}</p>
                    </div>
                </div>

                {/* Right Column: Form */}
                <div className="md:col-span-2">
                    <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-lg">
                        <form onSubmit={handleSave} className="space-y-6">

                            {/* Privacy Notice */}
                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-start gap-3 text-sm text-blue-800 dark:text-blue-200">
                                <FaInfoCircle className="mt-1 shrink-0" />
                                <p>This information is used for In-Character identification on portals and rosters. It is visible to government officials.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">IC Name</label>
                                    <div className="relative">
                                        <FaIdCard className="absolute top-3.5 left-3 text-slate-400" />
                                        <input
                                            type="text"
                                            required
                                            value={icName}
                                            onChange={(e) => setIcName(e.target.value)}
                                            className="w-full pl-10 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="Firstname Lastname"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">IC Phone</label>
                                    <div className="relative">
                                        <FaPhone className="absolute top-3.5 left-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={icPhone}
                                            onChange={(e) => setIcPhone(e.target.value)}
                                            className="w-full pl-10 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="555-0123"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Discord ID</label>
                                    <div className="relative">
                                        <FaDiscord className="absolute top-3.5 left-3 text-slate-400" />
                                        <input
                                            type="text"
                                            value={discordId}
                                            onChange={(e) => setDiscordId(e.target.value)}
                                            className="w-full pl-10 p-3 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                                            placeholder="username#1234"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Linked Email (Private)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            disabled
                                            value={user?.email || ''}
                                            className={`w-full p-3 rounded-lg bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 opacity-70 ${!showEmail ? 'blur-[2px]' : ''}`}
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowEmail(!showEmail)}
                                            className="absolute right-3 top-3 text-slate-400 hover:text-blue-500"
                                        >
                                            {showEmail ? <FaEyeSlash /> : <FaEye />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Bio / About Me</label>
                                <textarea
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                    className="w-full p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 outline-none focus:ring-2 focus:ring-blue-500 h-32 resize-none"
                                    placeholder="Brief character background..."
                                />
                            </div>

                            {message && (
                                <div className={`p-4 rounded-lg text-sm font-bold ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                    {message}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-600/20"
                                >
                                    <FaSave /> {loading ? 'Saving...' : 'Save Profile'}
                                </button>
                            </div>

                            {/* DEV BOOTSTRAP: Remove in production */}
                            <div className="pt-8 text-center border-t border-slate-200 dark:border-slate-700 mt-8">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        if (!user) return;
                                        if (!confirm("SECURITY WARNING: Grant yourself full System Admin privileges?")) return;
                                        await setDoc(doc(db, 'users', user.uid), { roles: ['admin'] }, { merge: true });
                                        await refreshProfile();
                                        alert("Admin Role Granted. Welcome, Commander.");
                                    }}
                                    className="text-xs text-slate-400 hover:text-red-500 font-mono tracking-widest uppercase opacity-50 hover:opacity-100 transition-all"
                                >
                                    [DEV: Grant Admin Override]
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
