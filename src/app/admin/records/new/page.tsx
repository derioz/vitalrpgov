"use client";

import { useState } from "react";
import { addDocument } from "@/lib/firestoreUtils";
import { useRouter } from "next/navigation";
import ImageUpload from "@/components/ImageUpload";

export default function NewRecordPage() {
    const [title, setTitle] = useState("");
    const [date, setDate] = useState("");
    const [type, setType] = useState("order");
    const [summary, setSummary] = useState("");
    const [content, setContent] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await addDocument("records", {
                title,
                date,
                type,
                summary,
                content,
                imageUrl
            });
            router.push("/admin/records");
        } catch (error) {
            console.error(error);
            alert("Error creating record");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Create Public Record</h2>
            <div className="card">
                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Title</label>
                        <input value={title} onChange={e => setTitle(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} required />
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Type</label>
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="order">Executive Order</option>
                            <option value="press">Press Release</option>
                        </select>
                    </div>
                    <div style={{ marginBottom: '1rem' }}>
                        <label>Summary (Short description)</label>
                        <input value={summary} onChange={e => setSummary(e.target.value)} required />
                    </div>

                    <ImageUpload onUpload={setImageUrl} />

                    <div style={{ marginBottom: '1rem' }}>
                        <label>Content</label>
                        <textarea value={content} onChange={e => setContent(e.target.value)} required rows={10} />
                    </div>
                    <button type="submit" className="btn" disabled={submitting}>
                        {submitting ? "Publishing..." : "Publish Record"}
                    </button>
                </form>
            </div>
        </div>
    );
}
