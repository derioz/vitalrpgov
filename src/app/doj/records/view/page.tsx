"use client";

import { useEffect, useState, Suspense } from "react";
import { getDocument } from "@/lib/firestoreUtils";
import { useSearchParams } from "next/navigation";

interface PublicRecord {
    id: string;
    title: string;
    date: string;
    type: string;
    content: string;
}

function RecordDetailContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');
    const [record, setRecord] = useState<PublicRecord | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecord() {
            if (id) {
                const data = await getDocument<PublicRecord>("records", id);
                setRecord(data);
            }
            setLoading(false);
        }
        fetchRecord();
    }, [id]);

    if (loading) return <div className="container">Loading...</div>;
    if (!record) return <div className="container">Record not found.</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '800px' }}>
            <div style={{ marginBottom: '1rem', color: '#666' }}>{record.date} | {record.type === 'order' ? 'Executive Order' : 'Press Release'}</div>
            <h1 style={{ borderBottom: '2px solid var(--gov-gold)', paddingBottom: '1rem', marginBottom: '2rem' }}>{record.title}</h1>
            <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {record.content}
            </div>
        </div>
    );
}

export default function RecordDetailPage() {
    return (
        <Suspense fallback={<div className="container">Loading...</div>}>
            <RecordDetailContent />
        </Suspense>
    );
}
