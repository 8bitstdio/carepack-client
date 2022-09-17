import { useEffect, useState } from "react";

export default function useDarkMode() {
    // enable dark mode.
    const [theme, setTheme] = useState('dark');
    useEffect(() => {
        const checkNativeTheme = e => {
            if (e.matches) {
                setTheme('dark');
                document.documentElement.setAttribute('color-theme', 'dark');
            } else {
                setTheme('light');
                document.documentElement.setAttribute('color-theme', 'light');
            }
        }

        const match = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const color = match ? 'dark' : 'light';
        setTheme(color);
        window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", checkNativeTheme);
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('color-theme', theme);
    }, [theme]);

    return theme;
}