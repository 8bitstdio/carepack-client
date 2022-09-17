import {createContext} from 'react';
import useDarkMode from "hooks/useDarkmode";

export const ThemeContext = createContext("light");

const ThemeProvider = ({ children }) => {
    const theme = useDarkMode();
    return (
        <ThemeContext.Provider value={theme}>
            {children}
        </ThemeContext.Provider>
    );
}

export default ThemeProvider;