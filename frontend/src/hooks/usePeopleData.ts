import { useEffect, useState } from "react";
import {
    Person,
    SortConfig,
    PaginationState,
    SortableField,
} from "@/types/person";

const usePeopleData = () => {
    const [people, setPeople] = useState<Person[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [pagination, setPagination] = useState<PaginationState>({
        page: 1,
        size: 10,
        total: 0,
    });
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({
        field: "name",
        direction: "asc",
    });

    const fetchPeople = async (search = "") => {
        setLoading(true);
        try {
            let url = `/api/persons?page=${pagination.page}&size=${pagination.size}`;
            if (search) {
                url += `&search=${encodeURIComponent(search)}`;
            }
            url += `&sort=${sortConfig.field}&order=${sortConfig.direction}`;

            const response = await fetch(url);

            if (!response.ok) {
                const html = await response.text();
                console.error("API Error:", html);
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            const total = response.headers.get("X-Total-Count");

            if (!Array.isArray(data)) {
                throw new Error("Invalid response format");
            }

            setPeople(data);
            setPagination(prev => ({
                ...prev,
                total: total ? parseInt(total) : data.length,
            }));
        } catch (err) {
            console.error("Error fetching people:", err);
            setPeople([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPeople(searchTerm);
    }, [pagination.page, pagination.size, sortConfig]);

    return {
        people,
        loading,
        pagination,
        setPagination,
        searchTerm,
        sortConfig,
        setSearchTerm,
        setSortConfig,
        fetchPeople,
    };
};

export default usePeopleData;
