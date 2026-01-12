"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { FaBook, FaBalanceScale, FaLandmark, FaTimes, FaExternalLinkAlt, FaExclamationTriangle, FaShieldAlt, FaHeartbeat, FaFireExtinguisher, FaChevronRight } from 'react-icons/fa';

interface ResourceLink {
    title: string;
    desc: string;
    url: string;
    icon: string; // Icon name string or mapping
    color: string;
}

interface FactionResourcesData {
    links: ResourceLink[];
}

interface FactionResourcesProps {
    faction: 'DOJ' | 'LSPD' | 'LSEMS' | 'SAFD';
    variant?: 'grid' | 'sidebar';
    title?: string;
    settingId?: string;
    customDefaults?: ResourceLink[];
}

const DEFAULT_RESOURCES: Record<string, ResourceLink[]> = {
    DOJ: [
        { title: "Penal Code", desc: "Laws and sentencing guidelines.", url: "https://docs.google.com/spreadsheets/d/1NWTm-yAQWqSVP04MgYjMlStI6WmwCSAhC-_F7ns3hDg/edit?gid=1736425476#gid=1736425476", icon: "balance", color: "amber" },
        { title: "Constitution", desc: "Supreme law of San Andreas.", url: "https://drive.google.com/file/d/1OFTLbR2HKYNjbkxSqQqtHUGfeFvtU090/preview", icon: "landmark", color: "red" },
        { title: "Gov Code", desc: "Rules for state agencies.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "book", color: "green" }
    ],
    LSPD: [
        { title: "Penal Code", desc: "LS Penal Code & Charges.", url: "https://docs.google.com/spreadsheets/d/1NWTm-yAQWqSVP04MgYjMlStI6WmwCSAhC-_F7ns3hDg/edit?gid=1736425476#gid=1736425476", icon: "balance", color: "blue" },
        { title: "SOP Handbook", desc: "Standard Operating Procedures.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "shield", color: "indigo" },
        { title: "Vehicle Code", desc: "Traffic laws and regulations.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "book", color: "sky" }
    ],
    LSEMS: [
        { title: "Med Protocols", desc: "Emergency treatment guides.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "heart", color: "red" },
        { title: "EMS Handbook", desc: "Personnel rules & guidelines.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "book", color: "pink" },
        { title: "Facility Map", desc: "Hospital layouts & zones.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "landmark", color: "emerald" }
    ],
    SAFD: [
        { title: "Fire Safety", desc: "Building & fire regulations.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "fire", color: "orange" },
        { title: "SOP Handbook", desc: "Rescue & firefighting guides.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlKfZZ6TEDAYfnn7sU67jQ/preview", icon: "shield", color: "red" },
        { title: "Burn Permits", desc: "Controlled burn guidelines.", url: "https://docs.google.com/document/d/11l4n-cCRMyWqchl1oyw3DqlGfZZ6TEDAYfnn7sU67jQ/preview", icon: "book", color: "yellow" }
    ]
};

const iconMap: Record<string, any> = {
    balance: FaBalanceScale,
    landmark: FaLandmark,
    book: FaBook,
    shield: FaShieldAlt,
    heart: FaHeartbeat,
    fire: FaFireExtinguisher
};

export default function FactionResources({ faction, variant = 'grid', title = "Official Resources", settingId, customDefaults }: FactionResourcesProps) {
    const [links, setLinks] = useState<ResourceLink[]>(customDefaults || DEFAULT_RESOURCES[faction] || []);
    const [loading, setLoading] = useState(true);
    const [selectedDoc, setSelectedDoc] = useState<{ url: string; title: string } | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchResources = async () => {
            try {
                const targetSetting = settingId || `${faction.toLowerCase()}_resources`;
                const docRef = doc(db, 'settings', targetSetting);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    if (data.links) {
                        setLinks(data.links);
                    }
                }
            } catch (error) {
                console.error(`Error fetching resources for ${settingId}:`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchResources();
    }, [faction, settingId]);

    const ModalPortal = ({ children }: { children: React.ReactNode }) => {
        if (!mounted || typeof document === 'undefined') return null;
        return createPortal(children, document.body);
    };

    if (loading && !links.length) return null;
    if (!links.length) return null;

    return (
        <div className={variant === 'grid' ? "mb-12" : "mb-6"}>
            <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                <span className={`w-1 h-3 rounded-full bg-${links[0]?.color || 'amber'}-500`}></span>
                {title}
            </h3>

            <div className={variant === 'grid'
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                : "flex flex-col gap-2"
            }>
                {links.map((item, i) => {
                    const Icon = iconMap[item.icon] || FaBook;
                    const isAnchor = item.url.startsWith('#');

                    const handleClick = (e: React.MouseEvent) => {
                        if (isAnchor) {
                            e.preventDefault();
                            const element = document.querySelector(item.url);
                            if (element) {
                                element.scrollIntoView({ behavior: 'smooth' });
                            }
                        } else {
                            setSelectedDoc({ url: item.url, title: item.title });
                        }
                    };

                    return (
                        <button
                            key={i}
                            onClick={handleClick}
                            className={variant === 'grid'
                                ? `group relative flex items-center gap-4 p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/5 hover:bg-white/5 transition-all duration-300 overflow-hidden text-left`
                                : `group relative flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-black/20 border border-slate-200 dark:border-white/5 hover:bg-${item.color}-500/10 hover:border-${item.color}-500/30 transition-all duration-300 text-left`
                            }
                        >
                            {variant === 'grid' && (
                                <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
                            )}

                            <div className={variant === 'grid'
                                ? `w-10 h-10 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 group-hover:bg-${item.color}-500 group-hover:text-white transition-all shrink-0`
                                : `w-8 h-8 rounded-lg bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 group-hover:text-${item.color}-300 transition-colors shrink-0`
                            }>
                                <Icon size={variant === 'grid' ? 18 : 14} />
                            </div>

                            <div className="flex-1 min-w-0">
                                <h4 className={`font-bold tracking-tight truncate transition-colors group-hover:text-${item.color}-400 ${variant === 'grid' ? 'text-white text-sm' : 'text-slate-700 dark:text-slate-300 text-xs'}`}>
                                    {item.title}
                                </h4>
                                {variant === 'grid' && (
                                    <p className="text-[10px] text-slate-500 font-medium truncate uppercase tracking-wider">{item.desc}</p>
                                )}
                            </div>

                            <FaChevronRight className={variant === 'grid'
                                ? "text-slate-700 group-hover:text-white/50 transition-all transform group-hover:translate-x-1"
                                : `text-slate-400 dark:text-slate-600 text-xs group-hover:text-${item.color}-400 transition-all transform group-hover:translate-x-1`
                            } />
                        </button>
                    );
                })}
            </div>

            {/* Document Viewer Modal */}
            {selectedDoc && (
                <ModalPortal>
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
                        <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setSelectedDoc(null)}></div>

                        <div className="relative w-full max-w-6xl h-full bg-zinc-950 border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] scale-in">
                            <div className="p-4 md:p-6 border-b border-white/5 flex items-center justify-between bg-zinc-900/20">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 bg-${links[0]?.color || 'amber'}-500/10 rounded-lg text-${links[0]?.color || 'amber'}-500`}>
                                        <FaBalanceScale />
                                    </div>
                                    <div>
                                        <h2 className="text-white font-black uppercase tracking-widest text-sm md:text-base">{selectedDoc.title}</h2>
                                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-tight">Official Department Documentation</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedDoc(null)}
                                    className="p-3 rounded-full hover:bg-white/5 text-slate-400 hover:text-white transition-all ring-1 ring-white/10"
                                >
                                    <FaTimes />
                                </button>
                            </div>

                            <div className="flex-1 bg-white relative overflow-hidden">
                                <iframe
                                    src={selectedDoc.url}
                                    className="w-full h-full border-0"
                                    title={selectedDoc.title}
                                />
                            </div>

                            <div className="p-4 bg-zinc-900/40 border-t border-white/5 flex items-center justify-center gap-3">
                                <div className="flex items-center gap-2 text-zinc-500 text-[9px] md:text-xs font-black uppercase tracking-[0.2em]">
                                    <FaExclamationTriangle className="text-amber-500 animate-pulse" />
                                    <span>Secured Portal: Document content handled externally via Google Fleet</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ModalPortal>
            )}
        </div>
    );
}
