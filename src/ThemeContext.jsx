import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    // 1. Kullanıcının sistem tercihini kontrol eden fonksiyon
    const getSystemTheme = () =>
        window.matchMedia("(prefers-color-scheme: dark)").matches;

    // 2. Başlangıç değerini sistem tercihine göre atıyoruz
    const [isDarkMode, setIsDarkMode] = useState(getSystemTheme());

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    // 3. Kullanıcı cihaz ayarını uygulama açıkken değiştirirse temayı güncelle
    useEffect(() => {
        const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
        const handleChange = (e) => setIsDarkMode(e.matches);

        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            <div className={isDarkMode ? "dark-theme" : "light-theme"}>
                {children}
            </div>
        </ThemeContext.Provider>
    );
};