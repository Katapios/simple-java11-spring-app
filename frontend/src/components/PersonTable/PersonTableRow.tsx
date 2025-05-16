import {Person} from "@/types/person";

type PersonTableRowProps = {
    person: Person;
    onEdit: (person: Person) => void;
    onDelete: (id: number) => void;
};

export const PersonTableRow = ({ person, onEdit, onDelete }: PersonTableRowProps) => {
    return (
        <tr>
            <td>{person.id}</td>
            <td>{person.name}</td>
            <td>{person.age}</td>
            <td>{person.email}</td>
            <td className="actions">
                <button
                    className="button edit-button"
                    onClick={() => onEdit(person)}
                >
                    ✏️ Редактировать
                </button>
                <button
                    className="button delete-button"
                    onClick={() => person.id && onDelete(person.id)}
                >
                    🗑️ Удалить
                </button>
            </td>
        </tr>
    );
};
