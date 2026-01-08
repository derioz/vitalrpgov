"use client";

import { useAuth } from '@/context/AuthContext';
import { ReactNode } from 'react';

/**
 * Access Control Component
 * Renders children ONLY if the user has one of the allowed roles.
 * Supports 'fallback' prop to show alternative content if denied.
 */
interface RoleGateProps {
    allowedRoles: string[];
    children: ReactNode;
    fallback?: ReactNode;
}

export default function RoleGate({ allowedRoles, children, fallback = null }: RoleGateProps) {
    const { userProfile, loading } = useAuth();

    if (loading) return null; // Or a spinner

    // If no profile or roles, deny
    if (!userProfile?.roles) {
        return <>{fallback}</>;
    }

    // Check if user has at least one of the allowed roles
    // "admin" role always passes
    const hasPermission = userProfile.roles.includes('admin') ||
        userProfile.roles.some(role => allowedRoles.includes(role));

    if (hasPermission) {
        return <>{children}</>;
    }

    return <>{fallback}</>;
}
