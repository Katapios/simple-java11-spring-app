import { useTheme } from '../../hooks/useTheme';

export const ThemeToggle = () => {
    const { theme, toggleTheme } = useTheme();

    const nextTheme = theme === 'dark' ? 'light' : 'dark';

    return (
        <button
            onClick={toggleTheme}
            className="theme-toggle-button"
            aria-label={`Switch to ${nextTheme} theme`}
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
};
