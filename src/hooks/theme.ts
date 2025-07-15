import { useState } from "react";

const useTheme = () => {
    const [theme, setTheme] = useState('dark');

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    };

    return { theme, toggleTheme };
};

export default useTheme;