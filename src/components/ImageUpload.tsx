"use client";

import { useState } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

interface ImageUploadProps {
    onUpload: (url: string) => void;
}

export default function ImageUpload({ onUpload }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [url, setUrl] = useState("");

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const storageRef = ref(storage, `uploads/${Date.now()}_${file.name}`);
            await uploadBytes(storageRef, file);
            const downloadURL = await getDownloadURL(storageRef);
            setUrl(downloadURL);
            onUpload(downloadURL);
        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    return (
        <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', opacity: 0.8 }}>Attachment / Image</label>
            <input type="file" accept="image/*" onChange={handleFileChange} disabled={uploading} />
            {uploading && <span style={{ marginLeft: '1rem' }}>Uploading...</span>}
            {url && <img src={url} alt="Uploaded" style={{ marginTop: '1rem', maxHeight: '200px', display: 'block', borderRadius: '4px' }} />}
        </div>
    );
}
