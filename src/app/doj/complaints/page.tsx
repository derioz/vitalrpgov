"use client";

import { useState } from "react";
import { addDocument } from "@/lib/firestoreUtils";

export default function ComplaintsPage() {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [details, setDetails] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addDocument("complaints", { name, contact, details, status: "Pending" });
        setSubmitted(true);
    };

    if (submitted) {
        return (
            <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
                <h1>Complaint Submitted</h1>
                <p>Thank you. Your complaint has been filed and will be reviewed by the administration.</p>
                <button className="btn" onClick={() => setSubmitted(false)} style={{ marginTop: '1rem' }}>Submit Another</button>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: '2rem 1rem', maxWidth: '600px' }}>
            <h1>File a Complaint</h1>
            <p style={{ marginBottom: '2rem' }}>Submit a formal grievance to the Government.</p>

            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Your Name</label>
                        <input value={name} onChange={e => setName(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Contact Info (Phone/Email)</label>
                        <input value={contact} onChange={e => setContact(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Complaint Details</label>
                        <textarea value={details} onChange={e => setDetails(e.target.value)} required rows={8} />
                    </div>
                    <button type="submit" className="btn" style={{ width: '100%' }}>Submit Complaint</button>
                </form>
            </div>
        </div>
    );
}
