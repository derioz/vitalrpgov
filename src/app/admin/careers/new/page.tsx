"use client";

import { useState } from "react";
import { addDocument } from "@/lib/firestoreUtils";
import { useRouter } from "next/navigation";

export default function NewJobPage() {
    const [title, setTitle] = useState("");
    const [department, setDepartment] = useState("");
    const [salary, setSalary] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await addDocument("jobs", { title, department, salary, description });
        router.push("/admin/careers");
    };

    return (
        <div>
            <h2>Post New Job</h2>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Job Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Department</label>
                        <input value={department} onChange={e => setDepartment(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Salary Range</label>
                        <input value={salary} onChange={e => setSalary(e.target.value)} required placeholder="$50,000 - $70,000" />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Description</label>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={10} />
                    </div>
                    <button type="submit" className="btn" disabled={submitting}>Post Job</button>
                </form>
            </div>
        </div>
    );
}
