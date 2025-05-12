import { useEffect, useState } from "react";

type Person = {
    id?: number;
    name: string;
    age: number;
    email: string;
};

function App() {
    const [person, setPerson] = useState<Person>({ name: "", age: 0, email: "" });
    const [people, setPeople] = useState<Person[]>([]);
    const [editingId, setEditingId] = useState<number | null>(null);

    // Получаем всех пользователей с сервера
    const fetchPeople = async () => {
        // const res = await fetch("http://localhost:8081/api/persons");
        const res = await fetch("/api/persons");
        const data = await res.json();
        setPeople(data);
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    // Обработка изменения формы
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPerson({ ...person, [e.target.name]: e.target.value });
    };

    // Создание и обновление нового пользователя
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId === null) {
            // create
            // await fetch("http://localhost:8081/api/persons", {
            await fetch("/api/persons", {

                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person),
            });
        } else {
            // update
            // await fetch(`http://localhost:8081/api/persons/${editingId}`, {
            await fetch(`/api/persons/${editingId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person),
            });
            setEditingId(null); // сбросить
        }
        setPerson({ name: "", age: 0, email: "" });
        fetchPeople();
    };

    const handleDelete = async (id: number) => {
        // await fetch(`http://localhost:8081/api/persons/${id}`, {
        await fetch(`/api/persons/${id}`, {
            method: "DELETE",
        });
        fetchPeople(); // обновим список после удаления
    };
    const startEdit = (person: Person) => {
        setPerson(person);
        setEditingId(person.id!);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h1>Список пользователей</h1>
            <ul>
                {people.map((p) => (
                    <li key={p.id}>
                        {p.name} ({p.age}) — {p.email}
                        <button onClick={() => startEdit(p)}>Редактировать</button>
                        <button style={{marginLeft: "1rem"}} onClick={() => handleDelete(p.id!)}>Удалить</button>
                    </li>
                ))}
            </ul>

            <h2>Новый пользователь</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" value={person.name} onChange={handleChange} placeholder="Имя" required />
                <input name="age" value={person.age} onChange={handleChange} type="number" placeholder="Возраст" required />
                <input name="email" value={person.email} onChange={handleChange} placeholder="Email" required />
                <button type="submit">Добавить</button>
            </form>
        </div>
    );
}

export default App;
