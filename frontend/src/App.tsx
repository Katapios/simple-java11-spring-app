import React, { useState, useEffect } from "react";
import usePeopleData from "./hooks/usePeopleData";
import { PersonTable } from "./components/PersonTable/PersonTable";
import UserForm from "./components/UserForm/UserForm";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import "./styles/global.css";
import { Person, SortableField } from "@/types/person";
import {ErrorBanner} from "@/components";

const App: React.FC = () => {
    const {
        people,
        loading,
        searchTerm,
        sortConfig,
        pagination,
        setSearchTerm,
        setSortConfig,
        setPagination,
        fetchPeople,
    } = usePeopleData();

    const [person, setPerson] = useState<Omit<Person, "id">>({
        name: "",
        age: 0,
        email: "",
    });

    const [editingId, setEditingId] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchPeople(searchTerm);
    }, [pagination.page, pagination.size, sortConfig]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPerson((prev) => ({
            ...prev,
            [name]: name === "age" ? parseInt(value) || 0 : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const url = editingId
                ? `/api/persons/${editingId}`
                : "/api/persons";
            const method = editingId ? "PUT" : "POST";

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(person),
            });

            if (!res.ok) throw new Error("Ошибка сохранения");

            setPerson({ name: "", age: 0, email: "" });
            setEditingId(null);
            fetchPeople(searchTerm);
        } catch (err) {
            setError("Ошибка при сохранении");
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Удалить пользователя?")) return;

        try {
            const res = await fetch(`/api/persons/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Ошибка удаления");

            fetchPeople(searchTerm);
        } catch (err) {
            setError("Ошибка удаления пользователя");
        }
    };

    const handleSort = (field: SortableField) => {
        const direction: "asc" | "desc" =
            sortConfig.field === field && sortConfig.direction === "asc"
                ? "desc"
                : "asc";
        setSortConfig({ field, direction });
    };

    const handleEdit = (personToEdit: Person) => {
        setPerson({
            name: personToEdit.name,
            age: personToEdit.age,
            email: personToEdit.email,
        });
        setEditingId(personToEdit.id ?? null);
    };

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        setPagination((prev) => ({ ...prev, page: 1 }));
        fetchPeople(term);
    };

    return (
        <ThemeProvider>
            <div className="container">
                <header className="header">
                    <h1>Список пользователей</h1>
                    <ThemeToggle />
                </header>

                {error && (
                    <ErrorBanner error={error} onDismiss={() => setError(null)} />
                )}

                <main className="main-content">
                    <section className="card user-grid-container">
                        <PersonTable
                            people={people}
                            isLoading={loading}
                            pagination={pagination}
                            setPagination={setPagination}
                            onSearch={handleSearch}
                            onSort={handleSort}
                            onDelete={handleDelete}
                            onEdit={handleEdit}
                            searchTerm={searchTerm}
                            fetchPeople={fetchPeople}
                            sortConfig={sortConfig}
                        />
                    </section>

                    <UserForm
                        person={person}
                        editingId={editingId}
                        onChange={handleChange}
                        onSubmit={handleSubmit}
                        onCancel={() => {
                            setPerson({ name: "", age: 0, email: "" });
                            setEditingId(null);
                        }}
                    />
                </main>
            </div>
        </ThemeProvider>
    );
};

export default App;
