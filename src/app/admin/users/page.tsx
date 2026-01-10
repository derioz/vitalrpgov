"use client";

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaUserShield, FaUserTag, FaSearch, FaCheckCircle, FaTimesCircle, FaShieldAlt, FaIdBadge, FaCrown } from 'react-icons/fa';

export default function AdminUsersPage() {
    const { userProfile } = useAuth();
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const isSuperAdmin = userProfile?.roles?.includes('superadmin');

    const fetchUsers = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "users"));
            const usersList = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setUsers(usersList);
        } catch (error) {
            console.error("Error fetching users:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isSuperAdmin) {
            fetchUsers();
        } else if (userProfile) {
            setLoading(false); // Stop loading if profile loaded but not superadmin
        }
    }, [isSuperAdmin, userProfile]);

    const toggleRole = async (userId: string, role: string, currentRoles: string[] = []) => {
        const userRef = doc(db, "users", userId);
        let newRoles = [...(currentRoles || [])];

        if (newRoles.includes(role)) {
            newRoles = newRoles.filter(r => r !== role);
        } else {
            newRoles.push(role);
        }

        try {
            await updateDoc(userRef, { roles: newRoles });
            // Optimistic update
            setUsers(users.map(u => u.id === userId ? { ...u, roles: newRoles } : u));
        } catch (error) {
            console.error("Error updating role:", error);
            alert("Failed to update role");
        }
    };

    const filteredUsers = users.filter(user =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.icName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const availableRoles = [
        { id: 'superadmin', label: 'Superadmin', color: 'pink', icon: FaCrown },
        { id: 'admin', label: 'Dept. Leader', color: 'indigo', icon: FaUserShield },
        { id: 'lspd', label: 'LSPD', color: 'blue', icon: FaShieldAlt },
        { id: 'ems', label: 'LSEMS', color: 'red', icon: FaIdBadge },
        { id: 'safd', label: 'SAFD', color: 'orange', icon: FaIdBadge },
        { id: 'doj', label: 'DOJ', color: 'amber', icon: FaUserTag },
    ];

    if (!isSuperAdmin && !loading) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] text-slate-500">
                <FaUserShield size={48} className="mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-slate-300">Access Denied</h2>
                <p>You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 p-6 rounded-3xl">
                <div>
                    <h1 className="text-3xl font-black text-white flex items-center gap-3">
                        <FaUserShield className="text-indigo-500" />
                        User Management
                    </h1>
                    <p className="text-slate-400 mt-1">Manage registered users and assign faction roles. <span className="text-pink-500 font-bold ml-2 text-xs uppercase tracking-wider">Superadmin Only</span></p>
                </div>

                <div className="relative w-full md:w-96">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search by email or IC name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl py-3 pl-12 pr-4 focus:ring-2 focus:ring-indigo-500 outline-none placeholder:text-slate-600 font-medium"
                    />
                </div>
            </div>

            <div className="grid gap-4">
                {loading ? (
                    <div className="text-center py-20 text-slate-500 animate-pulse">Loading users...</div>
                ) : filteredUsers.length > 0 ? (
                    filteredUsers.map((user) => (
                        <div key={user.id} className="bg-slate-900/40 backdrop-blur-md border border-white/5 p-6 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 hover:bg-slate-800/40 transition-colors group">

                            <div className="flex items-center gap-4 w-full lg:w-1/3">
                                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-xl font-bold text-slate-400 border border-white/5 uppercase">
                                    {user.icName ? user.icName.charAt(0) : user.email?.charAt(0)}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-white leading-tight">
                                        {user.icName || <span className="text-slate-500 italic">No IC Name Set</span>}
                                    </h3>
                                    <p className="text-slate-500 text-sm font-mono">{user.email}</p>
                                    <div className="flex gap-2 mt-2">
                                        {user.roles?.includes('superadmin') && <span className="text-[10px] bg-pink-500/10 text-pink-400 border border-pink-500/20 px-2 py-0.5 rounded uppercase font-bold tracking-wider">Superadmin</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap justify-center gap-2 flex-1">
                                {availableRoles.map((role) => {
                                    const hasRole = user.roles?.includes(role.id);
                                    return (
                                        <button
                                            key={role.id}
                                            onClick={() => toggleRole(user.id, role.id, user.roles)}
                                            className={`
                                                flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all border uppercase tracking-wide
                                                ${hasRole
                                                    ? `bg-${role.color}-500/20 border-${role.color}-500/50 text-${role.color}-300 shadow-[0_0_15px_rgba(0,0,0,0.2)]`
                                                    : 'bg-slate-950/50 border-slate-800 text-slate-600 hover:border-slate-600 hover:text-slate-400'
                                                }
                                            `}
                                        >
                                            <role.icon />
                                            {role.label}
                                            {hasRole ? <FaCheckCircle size={12} /> : null}
                                        </button>
                                    );
                                })}
                            </div>

                        </div>
                    ))
                ) : (
                    <div className="text-center py-20 text-slate-500 bg-slate-900/20 rounded-3xl border border-dashed border-slate-800">
                        No users found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}
