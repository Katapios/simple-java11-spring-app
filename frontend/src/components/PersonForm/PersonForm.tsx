import {Person} from "@/types/person";

type PersonFormProps = {
    person: Person;
    editingId: number | null;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
    onCancel: () => void;
};

export const PersonForm = ({ person, editingId, onChange, onSubmit, onCancel }: PersonFormProps) => {
    return (
        <>
            <h2>{editingId ? "Редактирование" : "Новый пользователь"}</h2>
            <form onSubmit={onSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="name">Имя</label>
                    <input
                        id="name"
                        name="name"
                        value={person.name}
                        onChange={onChange}
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
                        onChange={onChange}
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
                        onChange={onChange}
                        required
                    />
                </div>

                <div className="form-actions">
                    <button type="submit" className="button submit-button">
                        {editingId ? "Обновить" : "Добавить"}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="button cancel-button"
                            onClick={onCancel}
                        >
                            Отмена
                        </button>
                    )}
                </div>
            </form>
        </>
    );
};
