'use client';

import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { FaChevronDown, FaChevronUp, FaCode, FaBug, FaMagic, FaStar, FaInfoCircle } from 'react-icons/fa';
import type { ChangelogItem } from '@/lib/changelog';

interface ClientChangelogProps {
    items: ChangelogItem[];
}

export default function ClientChangelog({ items }: ClientChangelogProps) {
    const [mounted, setMounted] = useState(false);
    // Track expanded state for each item. Default: Key/Latest expanded? Or all? 
    // User requested "condensed". Let's expand the first one by default.
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set([items[0]?.id]));

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="h-96 w-full animate-pulse bg-white/5 rounded-3xl" />;
    }

    const toggleExpand = (id: string) => {
        const newSet = new Set(expandedIds);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedIds(newSet);
    };

    const expandAll = () => setExpandedIds(new Set(items.map(i => i.id)));
    const collapseAll = () => setExpandedIds(new Set());

    // Custom renderer for Headers to make them "Badges"
    const components = {
        h3: ({ children }: any) => {
            const text = String(children).toLowerCase();
            let colorClass = "bg-slate-800 text-slate-300";
            let Icon = FaInfoCircle;

            if (text.includes('feature') || text.includes('new')) {
                colorClass = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
                Icon = FaStar;
            } else if (text.includes('bug') || text.includes('fix')) {
                colorClass = "bg-red-500/10 text-red-400 border-red-500/20";
                Icon = FaBug;
            } else if (text.includes('improvement') || text.includes('polish') || text.includes('visual')) {
                colorClass = "bg-blue-500/10 text-blue-400 border-blue-500/20";
                Icon = FaMagic;
            }

            return (
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${colorClass} text-xs font-bold uppercase tracking-wider my-4`}>
                    <Icon className="text-sm" />
                    {children}
                </div>
            );
        },
        ul: ({ children }: any) => <ul className="space-y-2 my-2">{children}</ul>,
        li: ({ children }: any) => (
            <li className="flex items-start gap-2 text-slate-400 text-sm leading-relaxed">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600 mt-2 shrink-0" />
                <span>{children}</span>
            </li>
        ),
        p: ({ children }: any) => <p className="text-slate-400 mb-2">{children}</p>
    };

    return (
        <div className="space-y-8">
            {/* Toolbar */}
            <div className="flex justify-end gap-2 mb-4">
                <button onClick={expandAll} className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-white transition-colors">EXPAND ALL</button>
                <div className="w-px h-4 bg-slate-800 my-auto"></div>
                <button onClick={collapseAll} className="px-3 py-1 text-xs font-bold text-slate-500 hover:text-white transition-colors">COLLAPSE ALL</button>
            </div>

            <div className="relative border-l-2 border-slate-800 ml-4 md:ml-6 space-y-8 pb-12">
                {items.map((log, index) => {
                    const isExpanded = expandedIds.has(log.id);
                    const isLatest = index === 0;

                    return (
                        <div key={log.id} className="relative pl-8 md:pl-12">
                            {/* Visual Node */}
                            <div
                                className={`absolute -left-[9px] md:-left-[9px] top-6 w-5 h-5 rounded-full border-4 border-black transition-colors duration-300 z-10 ${isLatest ? 'bg-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)]' : 'bg-slate-700'
                                    }`}
                            ></div>

                            {/* Card content */}
                            <div
                                className={`
                                    rounded-2xl border transition-all duration-300 overflow-hidden
                                    ${isExpanded ? 'bg-zinc-900/50 border-white/10 shadow-2xl' : 'bg-transparent border-transparent hover:bg-zinc-900/30 hover:border-white/5 cursor-pointer'}
                                `}
                                onClick={() => !isExpanded && toggleExpand(log.id)}
                            >
                                {/* Header / Summary */}
                                <div
                                    className="p-6 flex flex-col md:flex-row md:items-center gap-4 cursor-pointer select-none"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleExpand(log.id);
                                    }}
                                >
                                    <div className="flex items-center gap-4 min-w-[140px]">
                                        <span className={`text-xl font-black tracking-tight ${isLatest ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                                            {log.version}
                                        </span>
                                        {isLatest && (
                                            <span className="px-2 py-0.5 bg-pink-500 text-white text-[10px] font-bold uppercase rounded-full shadow-lg shadow-pink-500/20">
                                                Latest
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex-1">
                                        <h2 className={`font-bold transition-colors ${isExpanded || isLatest ? 'text-white' : 'text-slate-400'}`}>
                                            {log.title}
                                        </h2>
                                        <div className="text-xs font-mono text-slate-600 mt-1 uppercase tracking-widest">{log.date || 'Unknown Date'}</div>
                                    </div>

                                    <div className="text-slate-500">
                                        {isExpanded ? <FaChevronUp /> : <FaChevronDown />}
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                <div
                                    className={`
                                        grid transition-[grid-template-rows] duration-500 ease-in-out
                                        ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}
                                    `}
                                >
                                    <div className="overflow-hidden">
                                        <div className="p-6 pt-0 border-t border-white/5">
                                            <div className="prose prose-invert max-w-none mt-4">
                                                <ReactMarkdown components={components}>
                                                    {log.content}
                                                </ReactMarkdown>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
