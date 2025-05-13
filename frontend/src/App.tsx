import { useState, useEffect, createContext, useMemo } from 'react';
import { ThemeToggle } from './components/ThemeToggle';
import './styles/global.css';

type Person = {
    id?: number;
    name: string;
    age: number;
    email: string;
};

type ThemeContextType = {
    theme: string;
    toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export function App() {
    // Состояния для данных
    const [person, setPerson] = useState<Person>({ name: '', age: 0, email: '' });
    const [people, setPeople] = useState<Person[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    // Состояния для пагинации
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    // Состояние темы
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    // Управление темой
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(savedTheme || (systemPrefersDark ? 'dark' : 'light'));
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

    // Загрузка данных с пагинацией
    const fetchPeople = async () => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/persons?page=${currentPage}&size=${itemsPerPage}`);

            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

            const total = Number(res.headers.get('X-Total-Count')) || 0;
            setTotalItems(total);

            const data = await res.json();
            setPeople(data);
        } catch (err) {
            setError('Ошибка загрузки данных');
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople();
    }, [currentPage, itemsPerPage]);

    // Обработчики формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPerson({ ...person, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const url = editingId ? `/api/persons/${editingId}` : '/api/persons';
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(person),
            });

            if (!response.ok) throw new Error('Ошибка сохранения');

            setPerson({ name: '', age: 0, email: '' });
            setEditingId(null);
            fetchPeople();
        } catch (err) {
            setError('Ошибка при сохранении данных');
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) return;

        try {
            const response = await fetch(`/api/persons/${id}`, { method: 'DELETE' });
            if (!response.ok) throw new Error('Ошибка удаления');

            // Если удалили последний элемент на странице, переходим на предыдущую страницу
            if (people.length === 1 && currentPage > 1) {
                setCurrentPage(currentPage - 1);
            } else {
                fetchPeople();
            }
        } catch (err) {
            setError('Не удалось удалить пользователя');
        }
    };

    // Компонент пагинации
    const Pagination = () => {
        const totalPages = Math.ceil(totalItems / itemsPerPage);
        const maxVisiblePages = 5;

        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

        return (
            <div className="pagination">
                <button
                    onClick={() => setCurrentPage(1)}
                    disabled={currentPage === 1}
                >
                    «
                </button>

                <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                >
                    ‹
                </button>

                {startPage > 1 && <span className="ellipsis">...</span>}

                {pages.map(page => (
                    <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? 'active' : ''}
                    >
                        {page}
                    </button>
                ))}

                {endPage < totalPages && <span className="ellipsis">...</span>}

                <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                >
                    ›
                </button>

                <button
                    onClick={() => setCurrentPage(totalPages)}
                    disabled={currentPage === totalPages}
                >
                    »
                </button>

                <select
                    value={itemsPerPage}
                    onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                    }}
                >
                    {[5, 10, 20, 50].map(size => (
                        <option key={size} value={size}>
                            {size} на странице
                        </option>
                    ))}
                </select>

                <span className="total-items">Всего: {totalItems}</span>
            </div>
        );
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className="container">
                <header className="header">
                    <h1>Список пользователей</h1>
                    <ThemeToggle />
                </header>

                {error && (
                    <div className="error-banner" onClick={() => setError(null)}>
                        {error}
                    </div>
                )}

                <main className="main-content">
                    <section className="card user-list">
                        <h2>Текущие пользователи</h2>

                        {isLoading ? (
                            <div className="loader" />
                        ) : (
                            <>
                                {people.length === 0 ? (
                                    <p>Нет данных для отображения</p>
                                ) : (
                                    <ul className="list">
                                        {people.map((p) => (
                                            <li key={p.id} className="list-item">
                                                <div className="user-info">
                                                    <span className="user-name">{p.name}</span>
                                                    <span className="user-age">({p.age})</span>
                                                    <span className="user-email">{p.email}</span>
                                                </div>
                                                <div className="user-actions">
                                                    <button
                                                        className="button edit-button"
                                                        onClick={() => {
                                                            setPerson(p);
                                                            setEditingId(p.id!);
                                                        }}
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        className="button delete-button"
                                                        onClick={() => handleDelete(p.id!)}
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                <Pagination />
                            </>
                        )}
                    </section>

                    <section className="card user-form">
                        <h2>{editingId ? 'Редактирование' : 'Новый пользователь'}</h2>
                        <form onSubmit={handleSubmit} className="form">
                            <div className="form-group">
                                <label htmlFor="name">Имя</label>
                                <input
                                    id="name"
                                    name="name"
                                    value={person.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="age">Возраст</label>
                                <input
                                    id="age"
                                    name="age"
                                    type="number"
                                    value={person.age || ''}
                                    onChange={handleChange}
                                    min="1"
                                    max="150"
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={person.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-actions">
                                <button type="submit" className="button submit-button">
                                    {editingId ? 'Обновить' : 'Добавить'}
                                </button>
                                {editingId && (
                                    <button
                                        type="button"
                                        className="button cancel-button"
                                        onClick={() => {
                                            setPerson({ name: '', age: 0, email: '' });
                                            setEditingId(null);
                                        }}
                                    >
                                        Отмена
                                    </button>
                                )}
                            </div>
                        </form>
                    </section>
                </main>
            </div>
        </ThemeContext.Provider>
    );
}
