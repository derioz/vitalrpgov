"use client";

import { useState, ReactNode } from 'react';
import { FaChevronDown } from 'react-icons/fa';

interface AdminCollapsibleProps {
    title: string;
    icon?: React.ElementType;
    children: ReactNode;
    isCollapsed: boolean;
    defaultOpen?: boolean;
}

export default function AdminCollapsible({
    title,
    icon: Icon,
    children,
    isCollapsed,
    defaultOpen = true
}: AdminCollapsibleProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    if (isCollapsed) {
        return (
            <div className="flex flex-col items-center gap-2 py-2">
                {children}
            </div>
        );
    }

    return (
        <div className="mb-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-colors group"
            >
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="text-sm opacity-50 group-hover:opacity-100" />}
                    <span>{title}</span>
                </div>
                <FaChevronDown
                    className={`text-[8px] transition-transform duration-300 ${isOpen ? '' : '-rotate-90'}`}
                />
            </button>
            <div
                className={`
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${isOpen ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}
                `}
            >
                <div className="space-y-1">
                    {children}
                </div>
            </div>
        </div>
    );
}
