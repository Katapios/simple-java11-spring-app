import { useContext } from 'react';
import { ThemeContext } from '../App';

export function ThemeToggle() {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
            {theme === 'dark' ? (
                <>
                    <span className="icon" aria-hidden="true">🌞</span>
                    <span className="text">Светлая тема</span>
                </>
            ) : (
                <>
                    <span className="icon" aria-hidden="true">🌙</span>
                    <span className="text">Темная тема</span>
                </>
            )}
        </button>
    );
}
