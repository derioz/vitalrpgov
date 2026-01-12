"use client";

import { IconType } from 'react-icons';
import { FaChevronRight } from 'react-icons/fa';

interface QuickNavItem {
    label: string;
    subLabel: string;
    icon: IconType;
    href?: string;
    onClick?: () => void;
    color: string;
}

interface FactionQuickNavProps {
    items: QuickNavItem[];
}

export default function FactionQuickNav({ items }: FactionQuickNavProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16 animate-fade-in-up delay-100">
            {items.map((item, i) => (
                <div
                    key={i}
                    onClick={item.onClick}
                    className={`
                        relative group bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 
                        hover:bg-white/5 transition-all duration-300 overflow-hidden cursor-pointer
                        hover:border-${item.color}-500/30 hover:shadow-[0_0_20px_rgba(0,0,0,0.2)]
                    `}
                >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br from-${item.color}-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                    <div className="relative z-10 flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-${item.color}-500/10 flex items-center justify-center text-${item.color}-400 group-hover:bg-${item.color}-500 group-hover:text-white transition-all duration-300`}>
                                <item.icon size={20} />
                            </div>
                            <div>
                                <h3 className="text-white font-bold leading-tight group-hover:text-${item.color}-400 transition-colors">
                                    {item.label}
                                </h3>
                                <p className="text-xs text-slate-500 font-mono mt-1 uppercase tracking-wider">
                                    {item.subLabel}
                                </p>
                            </div>
                        </div>

                        <FaChevronRight className={`text-slate-600 group-hover:text-${item.color}-400 transform group-hover:translate-x-1 transition-all duration-300`} />
                    </div>

                    {item.href && (
                        <a href={item.href} className="absolute inset-0 z-20" aria-label={item.label}></a>
                    )}
                </div>
            ))}
        </div>
    );
}
