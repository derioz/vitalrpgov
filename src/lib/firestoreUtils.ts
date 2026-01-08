import { db } from "@/lib/firebase";
import {
    collection,
    addDoc,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    Timestamp,
    where
} from "firebase/firestore";

export interface BaseRecord {
    id?: string;
    createdAt?: Timestamp;
}

export const getAllDocuments = async <T>(collectionName: string): Promise<T[]> => {
    const q = query(collection(db, collectionName), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as T));
};

export const getDocument = async <T>(collectionName: string, id: string): Promise<T | null> => {
    const docRef = doc(db, collectionName, id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
        return { id: snapshot.id, ...snapshot.data() } as T;
    }
    return null;
};

export const addDocument = async (collectionName: string, data: any) => {
    return await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now()
    });
};

export const deleteDocument = async (collectionName: string, id: string) => {
    await deleteDoc(doc(db, collectionName, id));
};

export const updateDocument = async (collectionName: string, id: string, data: any) => {
    await updateDoc(doc(db, collectionName, id), data);
};
