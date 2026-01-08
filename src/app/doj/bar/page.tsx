"use client";

import { useEffect, useState } from "react";
import { getAllDocuments } from "@/lib/firestoreUtils";

interface Member {
    id: string;
    name: string;
    status: string;
    phone: string;
}

export default function BarAssociationPage() {
    const [members, setMembers] = useState<Member[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMembers() {
            const data = await getAllDocuments<Member>("bar_members");
            setMembers(data);
            setLoading(false);
        }
        fetchMembers();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading Members...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1>State Bar Association</h1>
            <p style={{ marginBottom: '2rem' }}>Registered Attorneys and Legal Professionals.</p>

            {members.length === 0 ? (
                <p>No registered members found.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                    {members.map(member => (
                        <div key={member.id} className="card">
                            <h3>{member.name}</h3>
                            <p style={{
                                color: member.status === 'Active' ? 'green' : 'red',
                                fontWeight: 'bold',
                                marginBottom: '0.5rem'
                            }}>
                                {member.status}
                            </p>
                            <p style={{ fontSize: '0.9rem' }}>Contact: {member.phone}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
