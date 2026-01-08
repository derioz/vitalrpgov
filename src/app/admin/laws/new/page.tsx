"use client";

import { useState } from "react";
import { addDocument } from "@/lib/firestoreUtils";
import { useRouter } from "next/navigation";

export default function NewLawPage() {
    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("Penal Code");
    const [content, setContent] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        await addDocument("laws", { title, category, content });
        router.push("/admin/laws");
    };

    return (
        <div>
            <h2>Add New Law</h2>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Title (e.g. "Section 101: Speeding")</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Category</label>
                        <input value={category} onChange={e => setCategory(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Content</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} required rows={10} />
                    </div>
                    <button type="submit" className="btn" disabled={submitting}>Publish Law</button>
                </form>
            </div>
        </div>
    );
}
