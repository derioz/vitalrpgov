"use client";

import { useTheme } from "@/context/ThemeContext";
import { FaMoon, FaSun } from "react-icons/fa";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-text-primary hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
        >
            {theme === 'light' ? (
                <FaMoon className="w-5 h-5 text-slate-700" />
            ) : (
                <FaSun className="w-5 h-5 text-yellow-400" />
            )}
        </button>
    );
}
