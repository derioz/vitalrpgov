"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { FaPaperPlane, FaImage, FaBullhorn, FaBold, FaItalic, FaListUl, FaSmile } from 'react-icons/fa';

import { useSearchParams } from 'next/navigation';

export default function NewAnnouncementPage() {
    const { user, userProfile } = useAuth();
    const router = useRouter();
    const searchParams = useSearchParams();
    const deptParam = searchParams.get('dept');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const [showMarkdownHelp, setShowMarkdownHelp] = useState(false);
    const [loading, setLoading] = useState(false);

    // Calculate allowed departments
    const isAdmin = userProfile?.roles?.includes('admin');
    const myRoles = userProfile?.roles || [];

    // Map roles to departments
    const roleToDept: any = {
        'lspd': 'LSPD',
        'lsems': 'LSEMS',
        'safd': 'SAFD',
        'doj': 'DOJ'
    };

    let allowedDepts: string[] = [];
    if (isAdmin) {
        allowedDepts = ['LSPD', 'LSEMS', 'SAFD', 'DOJ'];
    } else {
        allowedDepts = myRoles
            .map(r => roleToDept[r])
            .filter(d => d !== undefined);
    }

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        department: deptParam && allowedDepts.includes(deptParam) ? deptParam : (allowedDepts[0] || 'LSPD'),
        imageUrl: '',
        tags: ''
    });

    // Helper: Insert Text at Cursor
    const insertText = (before: string, after: string = '') => {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = formData.content;

        const newText = currentText.substring(0, start) + before + currentText.substring(start, end) + after + currentText.substring(end);

        setFormData(prev => ({ ...prev, content: newText }));

        // Restore focus and cursor
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const EMOJIS = ['🚨', '🚓', '🚑', '🚒', '⚖️', '📢', '📅', '🛑', '✅', '⚠️', 'ℹ️', '📝', '👮', '🧑‍⚖️', '👨‍🚒', '👩‍⚕️', '🔒', '🔓', '⭐', '🔥'];

    const SUGGESTED_TAGS: any = {
        'LSPD': ['BOLO', 'Training', 'Warrant', 'Traffic', 'Public Safety', 'Press Release'],
        'LSEMS': ['Health Alert', 'Training', 'Hospital', 'Protocol', 'Public Health'],
        'SAFD': ['Fire Watch', 'Burn Ban', 'Training', 'Inspection', 'Safety'],
        'DOJ': ['Court', 'Legislation', 'Ruling', 'Bar Exam', 'Public Notice'],
        'Global': ['Event', 'Update', 'Important', 'Urgent']
    };

    // Helper: Add Tag
    const addTag = (tag: string) => {
        const currentTags = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');
        if (!currentTags.includes(tag)) {
            const newTags = [...currentTags, tag].join(', ');
            setFormData({ ...formData, tags: newTags });
        }
    };

    // Update department if allowedDepts changes (e.g. after profile load)
    useEffect(() => {
        if (!deptParam && allowedDepts.length > 0 && !allowedDepts.includes(formData.department)) {
            setFormData(prev => ({ ...prev, department: allowedDepts[0] }));
        }
    }, [allowedDepts.length, deptParam]); // eslint-disable-line

    // Check if we should lock the dropdown (if param exists and is valid)
    const isDeptLocked = !!(deptParam && allowedDepts.includes(deptParam));

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await addDoc(collection(db, 'announcements'), {
                ...formData,
                author: user?.email || 'Unknown',
                createdAt: serverTimestamp(),
                tags: formData.tags.split(',').map(t => t.trim())
            });
            router.push('/admin/announcements');
        } catch (error) {
            console.error("Error creating announcement:", error);
            alert('Failed to create announcement');
        } finally {
            setLoading(false);
        }
    };

    if (allowedDepts.length === 0 && !isAdmin) {
        return <div className="p-8 text-center text-red-500">You do not have permission to post announcements.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 relative">
            <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 p-8 rounded-3xl shadow-xl">
                <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-blue-600/20 text-blue-500">
                        <FaBullhorn />
                    </div>
                    Post New Announcement
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Target Department</label>
                            <select
                                value={formData.department}
                                disabled={isDeptLocked}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className={`w-full p-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-blue-500 outline-none appearance-none font-bold ${isDeptLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {allowedDepts.map(dept => (
                                    <option key={dept} value={dept}>{dept}</option>
                                ))}
                            </select>
                            {isDeptLocked && <p className="text-[10px] text-blue-400 mt-1 uppercase tracking-wider">Locked to {deptParam}</p>}
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Author (Display)</label>
                            <input
                                type="text"
                                disabled
                                value={userProfile?.icName || user?.email || 'Anonymous'}
                                className="w-full p-4 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-500 font-mono text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Headline</label>
                        <input
                            type="text"
                            required
                            placeholder="Brief, catchy title..."
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg placeholder:text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Content (Markdown)</label>

                        {/* Toolbar */}
                        <div className="flex items-center gap-2 mb-2 bg-slate-800/50 p-2 rounded-lg border border-slate-700 w-fit">
                            <button type="button" onClick={() => insertText('**', '**')} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Bold">
                                <FaBold />
                            </button>
                            <button type="button" onClick={() => insertText('*', '*')} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Italic">
                                <FaItalic />
                            </button>
                            <button type="button" onClick={() => insertText('- ')} className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white transition-colors" title="Bullet List">
                                <FaListUl />
                            </button>

                            <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                            <div className="relative">
                                <button
                                    type="button"
                                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                    className={`p-2 hover:bg-slate-700 rounded transition-colors ${showEmojiPicker ? 'text-amber-400 bg-slate-700' : 'text-slate-400 hover:text-amber-400'}`}
                                    title="Insert Emoji"
                                >
                                    <FaSmile />
                                </button>

                                {showEmojiPicker && (
                                    <div className="absolute top-10 left-0 z-50 bg-slate-800 border border-slate-700 p-2 rounded-xl shadow-2xl grid grid-cols-5 gap-1 w-[200px]">
                                        {EMOJIS.map(emoji => (
                                            <button
                                                key={emoji}
                                                type="button"
                                                onClick={() => {
                                                    insertText(emoji);
                                                    setShowEmojiPicker(false);
                                                }}
                                                className="p-2 hover:bg-slate-700 rounded text-xl transition-colors"
                                            >
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="w-[1px] h-6 bg-slate-700 mx-1"></div>

                            <button
                                type="button"
                                onClick={() => setShowMarkdownHelp(true)}
                                className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
                            >
                                <span className="hidden md:inline">Markdown Help</span>
                            </button>
                        </div>

                        <textarea
                            ref={textareaRef}
                            required
                            rows={10}
                            placeholder="# Detailed Report\n\nUse markdown for lists, bolding, etc."
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950 text-slate-300 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm leading-relaxed placeholder:text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <FaImage /> Header Image (Optional)
                        </label>
                        <input
                            type="url"
                            placeholder="https://imgur.com/..."
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm placeholder:text-slate-700"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Tags</label>
                        <input
                            type="text"
                            placeholder="Public, Urgent, Event..."
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                            className="w-full p-4 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm placeholder:text-slate-700 mb-2"
                        />
                        <div className="flex flex-wrap gap-2">
                            {(SUGGESTED_TAGS[formData.department] || []).concat(SUGGESTED_TAGS['Global']).map((tag: string) => (
                                <button
                                    key={tag}
                                    type="button"
                                    onClick={() => addTag(tag)}
                                    className="px-3 py-1 bg-slate-800 hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/50 border border-slate-700 rounded-lg text-xs font-bold text-slate-400 transition-all"
                                >
                                    + {tag}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 px-8 rounded-xl flex items-center gap-3 transition-all transform hover:scale-105 shadow-xl shadow-blue-900/20"
                        >
                            {loading ? 'Publishing...' : <><FaPaperPlane /> Publish to Portal</>}
                        </button>
                    </div>

                </form>
            </div>

            {/* Markdown Help Modal */}
            {showMarkdownHelp && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl relative animate-scale-up">
                        <div className="bg-slate-950 px-6 py-4 flex items-center justify-between border-b border-slate-800">
                            <h3 className="text-xl font-bold text-white">Markdown Cheat Sheet</h3>
                            <button onClick={() => setShowMarkdownHelp(false)} className="text-slate-400 hover:text-white">✕</button>
                        </div>
                        <div className="p-6 space-y-4 text-sm text-slate-300">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="font-bold text-blue-400">Headings</p>
                                    <code className="block bg-slate-950 p-2 rounded border border-slate-800"># Large Heading</code>
                                    <code className="block bg-slate-950 p-2 rounded border border-slate-800">## Medium Heading</code>
                                    <code className="block bg-slate-950 p-2 rounded border border-slate-800">### Small Heading</code>
                                </div>
                                <div className="space-y-1">
                                    <p className="font-bold text-blue-400">Emphasis</p>
                                    <code className="block bg-slate-950 p-2 rounded border border-slate-800">**Bold Text**</code>
                                    <code className="block bg-slate-950 p-2 rounded border border-slate-800">*Italic Text*</code>
                                    <code className="block bg-slate-950 p-2 rounded border border-slate-800">~~Strikethrough~~</code>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-blue-400">Lists</p>
                                <code className="block bg-slate-950 p-2 rounded border border-slate-800">- Bullet Point Item</code>
                                <code className="block bg-slate-950 p-2 rounded border border-slate-800">1. Numbered List Item</code>
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-blue-400">Links</p>
                                <code className="block bg-slate-950 p-2 rounded border border-slate-800">[Link Text](https://example.com)</code>
                            </div>
                        </div>
                        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 text-right">
                            <button onClick={() => setShowMarkdownHelp(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold transition-colors">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
