import { useEffect, useState, createContext } from "react";
import { ThemeToggle } from "./components/ThemeToggle";
import "./styles/global.css";

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

function App() {
    const [person, setPerson] = useState<Person>({ name: "", age: 0, email: "" });
    const [people, setPeople] = useState<Person[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [theme, setTheme] = useState<"light" | "dark">("light");

    // Логика темы
    useEffect(() => {
        const savedTheme = localStorage.getItem("theme");
        const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(savedTheme ? savedTheme as "light" | "dark" : systemPrefersDark ? "dark" : "light");
    }, []);

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

    // Логика данных
    const fetchPeople = async () => {
        const res = await fetch("/api/persons");
        const data = await res.json();
        setPeople(data);
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPerson({ ...person, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = editingId ? `/api/persons/${editingId}` : "/api/persons";
        const method = editingId ? "PUT" : "POST";

        await fetch(url, {
            method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(person),
        });

        setPerson({ name: "", age: 0, email: "" });
        setEditingId(null);
        fetchPeople();
    };

    const handleDelete = async (id: number) => {
        await fetch(`/api/persons/${id}`, { method: "DELETE" });
        fetchPeople();
    };

    const startEdit = (person: Person) => {
        setPerson(person);
        setEditingId(person.id!);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            <div className="container">
                <header className="header">
                    <h1>Список пользователей</h1>
                    <ThemeToggle />
                </header>

                <main className="main-content">
                    <section className="card user-list">
                        <h2>Текущие пользователи</h2>
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
                                            onClick={() => startEdit(p)}
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
                    </section>

                    <section className="card user-form">
                        <h2>{editingId ? "Редактирование" : "Новый пользователь"}</h2>
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
                                    value={person.age || ""}
                                    onChange={handleChange}
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

                            <button type="submit" className="button submit-button">
                                {editingId ? "Обновить" : "Добавить"}
                            </button>
                        </form>
                    </section>
                </main>
            </div>
        </ThemeContext.Provider>
    );
}

export default App;
