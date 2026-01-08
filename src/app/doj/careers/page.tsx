"use client";

import { useEffect, useState } from "react";
import { getAllDocuments } from "@/lib/firestoreUtils";

interface Job {
    id: string;
    title: string;
    department: string;
    description: string;
    salary: string;
}

export default function CareersPage() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchJobs() {
            const data = await getAllDocuments<Job>("jobs");
            setJobs(data);
            setLoading(false);
        }
        fetchJobs();
    }, []);

    if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading Jobs...</div>;

    return (
        <div className="container" style={{ padding: '2rem 1rem' }}>
            <h1>Government Careers</h1>
            <p style={{ marginBottom: '2rem' }}>Join the team serving San Andreas.</p>

            {jobs.length === 0 ? (
                <p>No open positions at this time.</p>
            ) : (
                <div style={{ display: 'grid', gap: '1rem' }}>
                    {jobs.map(job => (
                        <div key={job.id} className="card">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                                <h3>{job.title}</h3>
                                <span style={{ color: 'var(--gov-gold)', fontWeight: 'bold' }}>{job.salary}</span>
                            </div>
                            <p style={{ fontWeight: 'bold', color: '#666', marginBottom: '1rem' }}>{job.department}</p>
                            <p>{job.description}</p>
                            <button className="btn" style={{ marginTop: '1rem' }}>Apply Now</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
