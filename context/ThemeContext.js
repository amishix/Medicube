// context/ThemeContext.js
import { createContext, useState } from 'react';
import { Appearance } from 'react-native';

export const ThemeContext = createContext();

const lightTheme = {
  mode: 'light',
  background: '#fff',
  text: '#000',
};

const darkTheme = {
  mode: 'dark',
  background: '#121212',
  text: '#ffffff',
};

export const ThemeProvider = ({ children }) => {
  const systemPrefersDark = Appearance.getColorScheme() === 'dark';
  const [isDarkMode, setIsDarkMode] = useState(systemPrefersDark);

  const theme = isDarkMode ? darkTheme : lightTheme;

  const toggleDarkMode = () => {
    setIsDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};