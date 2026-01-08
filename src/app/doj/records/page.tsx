"use client";

import { useEffect, useState } from "react";
import { getAllDocuments } from "@/lib/firestoreUtils";
import Link from "next/link";

interface PublicRecord {
    id: string;
    title: string;
    date: string;
    type: string;
    summary: string;
    createdAt: any;
}

export default function RecordsPage() {
    const [records, setRecords] = useState<PublicRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchRecords() {
            const data = await getAllDocuments<PublicRecord>("records");
            setRecords(data);
            setLoading(false);
        }
        fetchRecords();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading Records...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1>Public Records</h1>
            <p style={{ marginBottom: '2rem' }}>Official Executive Orders and Press Releases.</p>

            {records.length === 0 ? (
                <p>No records found.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {records.map(record => (
                        <div key={record.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <span style={{
                                    backgroundColor: record.type === 'order' ? 'var(--gov-navy)' : 'var(--gov-gold)',
                                    color: record.type === 'order' ? 'white' : 'var(--gov-navy)',
                                    padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', textTransform: 'uppercase', fontWeight: 'bold'
                                }}>
                                    {record.type === 'order' ? 'Executive Order' : 'Press Release'}
                                </span>
                                <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                    {record.date}
                                </span>
                            </div>
                            <h3><Link href={`/doj/records/view?id=${record.id}`}>{record.title}</Link></h3>
                            <p>{record.summary}</p>
                            <Link href={`/doj/records/view?id=${record.id}`} style={{ display: 'inline-block', marginTop: '1rem', fontWeight: 'bold' }}>
                                Read Full Document &rarr;
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
