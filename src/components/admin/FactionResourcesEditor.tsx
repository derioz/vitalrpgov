"use client";

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import {
    FaSave, FaPlus, FaTrash, FaExternalLinkAlt, FaCheck, FaTimes,
    FaBalanceScale, FaLandmark, FaBook, FaShieldAlt, FaHeartbeat, FaFireExtinguisher,
    FaFileAlt, FaLink, FaInfoCircle, FaGavel, FaIdCard, FaCar
} from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

interface ResourceLink {
    title: string;
    desc: string;
    url: string;
    icon: string;
    color: string;
}

interface FactionResourcesEditorProps {
    faction: 'DOJ' | 'LSPD' | 'LSEMS' | 'SAFD';
    pageTitle?: string;
    settingId?: string;
}

const AVAILABLE_ICONS = [
    { id: 'balance', icon: FaBalanceScale, label: 'Scales' },
    { id: 'landmark', icon: FaLandmark, label: 'Building' },
    { id: 'book', icon: FaBook, label: 'Book' },
    { id: 'shield', icon: FaShieldAlt, label: 'Shield' },
    { id: 'heart', icon: FaHeartbeat, label: 'Heart' },
    { id: 'fire', icon: FaFireExtinguisher, label: 'Fire' },
    { id: 'gavel', icon: FaGavel, label: 'Gavel' },
    { id: 'id-card', icon: FaIdCard, label: 'ID Card' },
    { id: 'car', icon: FaCar, label: 'Car' },
    { id: 'file', icon: FaFileAlt, label: 'File' },
    { id: 'link', icon: FaLink, label: 'Link' },
    { id: 'info', icon: FaInfoCircle, label: 'Info' },
];

const AVAILABLE_COLORS = [
    { id: 'amber', class: 'bg-amber-500' },
    { id: 'red', class: 'bg-red-500' },
    { id: 'green', class: 'bg-green-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'indigo', class: 'bg-indigo-500' },
    { id: 'sky', class: 'bg-sky-500' },
    { id: 'pink', class: 'bg-pink-500' },
    { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'orange', class: 'bg-orange-500' },
    { id: 'yellow', class: 'bg-yellow-500' },
    { id: 'slate', class: 'bg-slate-500' },
];

export default function FactionResourcesEditor({ faction, pageTitle, settingId }: FactionResourcesEditorProps) {
    const { userProfile } = useAuth();
    const [links, setLinks] = useState<ResourceLink[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const targetSetting = settingId || `${faction.toLowerCase()}_resources`;
                const docRef = doc(db, 'settings', targetSetting);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().links) {
                    setLinks(docSnap.data().links);
                } else if (faction === 'DOJ' && targetSetting.includes('resources') && docSnap.exists()) {
                    // Backwards compatibility migration for DOJ Resources
                    const data = docSnap.data();
                    const migratedLinks = [];
                    if (data.penalCodeUrl) migratedLinks.push({ title: "Penal Code", desc: "Laws & Guidelines", url: data.penalCodeUrl, icon: "balance", color: "amber" });
                    if (data.constitutionUrl) migratedLinks.push({ title: "Constitution", desc: "Supreme Law", url: data.constitutionUrl, icon: "landmark", color: "red" });
                    if (data.govCodeUrl) migratedLinks.push({ title: "Gov Code", desc: "State Rules", url: data.govCodeUrl, icon: "book", color: "green" });
                    if (migratedLinks.length > 0) setLinks(migratedLinks);
                } else if (faction === 'DOJ' && targetSetting.includes('quicklinks')) {
                    // Pre-seed DOJ Quick Links if empty
                    setLinks([
                        { title: "Careers", desc: "Join Judicial", url: "#apply", icon: "id-card", color: "amber" },
                        { title: "State Bar", desc: "Attorney Roster", url: "#bar-roster", icon: "landmark", color: "indigo" },
                        { title: "Staff Hub", desc: "DOJ Personnel", url: "#staff", icon: "shield", color: "blue" },
                        { title: "Court Docket", desc: "Case Schedule", url: "#docket", icon: "balance", color: "emerald" }
                    ]);
                } else if (faction === 'LSPD' && targetSetting.includes('quicklinks')) {
                    setLinks([
                        { title: "Join LSPD", desc: "Police Academy", url: "#apply", icon: "id-card", color: "blue" },
                        { title: "Staff Roster", desc: "Command Chain", url: "#roster", icon: "shield", color: "indigo" },
                        { title: "SOP Handbook", desc: "Procedural Guides", url: "#sop", icon: "book", color: "sky" },
                        { title: "Impound Lot", desc: "Vehicle Recovery", url: "#impound", icon: "car", color: "slate" }
                    ]);
                } else if (faction === 'LSEMS' && targetSetting.includes('quicklinks')) {
                    setLinks([
                        { title: "Join EMS", desc: "Medical Training", url: "#apply", icon: "id-card", color: "red" },
                        { title: "Staff Roster", desc: "On-Call Medics", url: "#roster", icon: "heart", color: "pink" },
                        { title: "Protocols", desc: "Treatment Guides", url: "#protocols", icon: "book", color: "emerald" },
                        { title: "Hospitals", desc: "Facilities", url: "#hospitals", icon: "landmark", color: "blue" }
                    ]);
                } else if (faction === 'SAFD' && targetSetting.includes('quicklinks')) {
                    setLinks([
                        { title: "Join SAFD", desc: "Fire Academy", url: "#apply", icon: "id-card", color: "orange" },
                        { title: "Dept. Roster", desc: "Firefighters", url: "#roster", icon: "shield", color: "red" },
                        { title: "Inspections", desc: "Business Safety", url: "#inspections", icon: "file", color: "yellow" },
                        { title: "Burn Permits", desc: "Public Access", url: "#permit", icon: "fire", color: "green" }
                    ]);
                }
            } catch (error) {
                console.error("Error loading resources:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [faction, settingId]); // Changed dependency for correctness

    const handleAddLink = () => {
        setLinks([...links, { title: "", desc: "", url: "", icon: "book", color: "blue" }]);
    };

    const handleRemoveLink = (index: number) => {
        const newLinks = [...links];
        newLinks.splice(index, 1);
        setLinks(newLinks);
    };

    const updateLink = (index: number, field: keyof ResourceLink, value: string) => {
        const newLinks = [...links];
        newLinks[index] = { ...newLinks[index], [field]: value };
        setLinks(newLinks);
    };

    const handleSave = async () => {
        setSaving(true);
        setStatus('idle');
        try {
            const targetSetting = settingId || `${faction.toLowerCase()}_resources`;
            await setDoc(doc(db, 'settings', targetSetting), {
                links,
                updatedAt: serverTimestamp(),
                lastEditor: userProfile?.icName || 'Unknown'
            });
            setStatus('success');
            setTimeout(() => setStatus('idle'), 3000);
        } catch (error) {
            console.error("Error saving resources:", error);
            setStatus('error');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-slate-400 animate-pulse">Loading editor...</div>;

    return (
        <div className="max-w-5xl mx-auto p-6">
            <header className="mb-8 border-b border-slate-800 pb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">{pageTitle || `${faction} Resources`}</h1>
                    <p className="text-slate-400">Manage the sidebar "Quick Links" visible on the {faction} portal.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className={`
                        px-6 py-3 rounded-lg font-bold uppercase tracking-wider flex items-center gap-2 transition-all
                        ${saving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-900/20'}
                    `}
                >
                    {saving ? <span className="animate-spin">⟳</span> : <FaSave />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </header>

            {status === 'success' && (
                <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 flex items-center gap-3 animate-fade-in">
                    <FaCheck /> Changes saved successfully! The widget will update immediately.
                </div>
            )}

            <div className="space-y-4">
                {links.map((link, index) => (
                    <div key={index} className="bg-slate-900/50 p-4 lg:p-6 rounded-xl border border-slate-800 hover:border-slate-700 transition-colors group">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">

                            {/* Icon & Color Selector */}
                            <div className="lg:col-span-3 space-y-4">
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 block">Icon</label>
                                    <div className="grid grid-cols-4 gap-2">
                                        {AVAILABLE_ICONS.map((iconOption) => (
                                            <button
                                                key={iconOption.id}
                                                type="button"
                                                onClick={() => updateLink(index, 'icon', iconOption.id)}
                                                className={`p-2 rounded-lg flex items-center justify-center transition-all ${link.icon === iconOption.id ? 'bg-white text-black ring-2 ring-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                                                title={iconOption.label}
                                            >
                                                <iconOption.icon />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2 block">Theme Color</label>
                                    <div className="flex flex-wrap gap-2">
                                        {AVAILABLE_COLORS.map((colorOption) => (
                                            <button
                                                key={colorOption.id}
                                                type="button"
                                                onClick={() => updateLink(index, 'color', colorOption.id)}
                                                className={`w-6 h-6 rounded-full transition-all ${colorOption.class} ${link.color === colorOption.id ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900 scale-110' : 'opacity-40 hover:opacity-100'}`}
                                                title={colorOption.id}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Text Inputs */}
                            <div className="lg:col-span-8 space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Title</label>
                                        <input
                                            type="text"
                                            value={link.title}
                                            onChange={(e) => updateLink(index, 'title', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g. Penal Code"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Description (Short)</label>
                                        <input
                                            type="text"
                                            value={link.desc}
                                            onChange={(e) => updateLink(index, 'desc', e.target.value)}
                                            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none"
                                            placeholder="e.g. Laws & Guidelines"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Document URL</label>
                                    <div className="flex gap-2">
                                        <input
                                            type="url"
                                            value={link.url}
                                            onChange={(e) => updateLink(index, 'url', e.target.value)}
                                            className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-blue-500 focus:outline-none font-mono text-xs"
                                            placeholder="https://..."
                                        />
                                        <a href={link.url} target="_blank" rel="noreferrer" className="p-2 bg-slate-800 text-slate-400 hover:text-white rounded-lg">
                                            <FaExternalLinkAlt />
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Delete Button */}
                            <div className="lg:col-span-1 flex justify-end">
                                <button
                                    onClick={() => handleRemoveLink(index)}
                                    className="p-3 text-red-900 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                                    title="Remove Resource"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                <button
                    onClick={handleAddLink}
                    className="w-full py-4 rounded-xl border-2 border-dashed border-slate-800 text-slate-500 hover:text-white hover:border-slate-600 hover:bg-slate-900/50 transition-all flex items-center justify-center gap-2 font-bold uppercase tracking-wider"
                >
                    <FaPlus /> Add New Resource
                </button>
            </div>
        </div>
    );
}
