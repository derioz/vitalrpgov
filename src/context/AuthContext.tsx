"use client";

import { createContext, useContext, useEffect, useState } from 'react';
import {
    onAuthStateChanged,
    User,
    signInWithPopup,
    signOut as firebaseSignOut,
    GoogleAuthProvider
} from 'firebase/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserProfile {
    icName?: string;
    roles?: string[];
    email?: string;
    icPhone?: string;
    discordId?: string;
    photoURL?: string;
    bio?: string;
}

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signOut: () => Promise<void>;
    refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    userProfile: null,
    loading: true,
    signInWithGoogle: async () => { },
    signOut: async () => { },
    refreshProfile: async () => { },
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const signInWithGoogle = async () => {
        try {
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Error signing in with Google", error);
            throw error;
        }
    };

    const signOut = async () => {
        await firebaseSignOut(auth);
        setUserProfile(null);
    };

    useEffect(() => {
        let unsubscribeProfile: (() => void) | null = null;

        const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
            setUser(currentUser);

            // Clean up previous listener if any
            if (unsubscribeProfile) {
                unsubscribeProfile();
                unsubscribeProfile = null;
            }

            if (currentUser) {
                const docRef = doc(db, 'users', currentUser.uid);

                // Real-time listener
                import('firebase/firestore').then(({ onSnapshot }) => {
                    unsubscribeProfile = onSnapshot(docRef, async (docSnap) => {
                        if (docSnap.exists()) {
                            setUserProfile(docSnap.data() as UserProfile);
                        } else {
                            // Init empty profile if none exists
                            const newProfile: UserProfile = {
                                email: currentUser.email || undefined,
                                roles: []
                            };
                            await setDoc(docRef, newProfile, { merge: true });
                            setUserProfile(newProfile);
                        }
                        setLoading(false);
                    }, (error) => {
                        console.error("Profile sync error:", error);
                        setLoading(false);
                    });
                });
            } else {
                setUserProfile(null);
                setLoading(false);
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeProfile) unsubscribeProfile();
        };
    }, []);

    // Explicit refresh is no longer strictly needed with onSnapshot, 
    // but we can keep it as a no-op or manual fetch fallback if needed.
    const refreshProfile = async () => {
        // No-op for real-time listener, or could force a fetch
    }

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, signInWithGoogle, signOut, refreshProfile }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
