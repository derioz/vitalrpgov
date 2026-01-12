"use client";

import FactionResourcesEditor from '@/components/admin/FactionResourcesEditor';
import { useAuth } from '@/context/AuthContext';
import { FaExclamationTriangle } from 'react-icons/fa';

export default function LspdQuickLinksPage() {
    const { userProfile, loading } = useAuth();
    // Permission Check
    const hasAccess = userProfile?.roles?.some(r => ['admin', 'lspd'].includes(r));

    if (loading) return <div className="p-8 text-slate-400 animate-pulse">Checking permissions...</div>;

    if (!hasAccess) {
        return (
            <div className="p-8 text-center">
                <FaExclamationTriangle className="text-4xl text-amber-500 mx-auto mb-4" />
                <h1 className="text-xl font-bold text-white">Access Denied</h1>
                <p className="text-slate-400 mt-2">You do not have permission to view this page.</p>
            </div>
        );
    }

    return (
        <FactionResourcesEditor
            faction="LSPD"
            pageTitle="LSPD Quick Links"
            settingId="lspd_quicklinks"
        />
    );
}
