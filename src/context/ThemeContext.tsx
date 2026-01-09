"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({ theme: "light", toggleTheme: () => { } });

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    // Always force dark mode
    const [theme] = useState<Theme>("dark");

    useEffect(() => {
        document.documentElement.classList.add('dark');
        localStorage.setItem("theme", "dark");
    }, []);

    const toggleTheme = () => { }; // No-op

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
