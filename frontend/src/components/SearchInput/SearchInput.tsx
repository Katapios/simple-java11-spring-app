import { useDebounce } from "../../utils/debounce";
import {useState} from "react";

type SearchInputProps = {
    onSearch: (term: string) => void;
};

export const SearchInput = ({ onSearch }: SearchInputProps) => {
    const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebounce(onSearch, 500);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Поиск по имени, email или возрасту..."
                value={searchTerm}
                onChange={handleChange}
                className="search-input"
            />
        </div>
    );
};
