import { PersonTableHeader } from './PersonTableHeader';
import { PersonTableRow } from './PersonTableRow';
import { SearchInput } from '../SearchInput/SearchInput';
import { Loader } from '../Loader/Loader';
import { NoData } from '../NoData/NoData';
import { Pagination } from '../Pagination/Pagination';
import { Person, SortableField, SortConfig } from '../../types/person';
import { PaginationState } from "@/types/person";


type PersonTableProps = {
    people: Person[];
    isLoading: boolean;
    pagination: {
        page: number;
        size: number;
        total: number;
    };
    setPagination: React.Dispatch<React.SetStateAction<PaginationState>>;
    onSearch: (term: string) => void;
    onSort: (field: SortableField) => void;
    sortConfig: SortConfig;
    onDelete: (id: number) => void;
    onEdit: (person: Person) => void;
    searchTerm: string;
    fetchPeople: (search?: string) => Promise<void>;
};

export const PersonTable = ({
                                people,
                                isLoading,
                                pagination,
                                setPagination,
                                onSearch,
                                onSort,
                                onDelete,
                                onEdit,
                                searchTerm,
                                fetchPeople,
                                sortConfig,
                            }: PersonTableProps) => {
    return (
        <>
            <div className="grid-header-row">
                <div>
                    <h2>Текущие пользователи</h2>
                    <SearchInput onSearch={onSearch} />
                </div>
                <div className="total-items">Всего: {pagination.total}</div>
            </div>

            {isLoading ? (
                <Loader />
            ) : people.length === 0 ? (
                <NoData onRefresh={() => fetchPeople(searchTerm)} />
            ) : (
                <>
                    <div className="table-responsive">
                        <table className="user-table">
                            <PersonTableHeader onSort={onSort} sortConfig={sortConfig} />
                            <tbody>
                            {people.map((person) => (
                                <PersonTableRow
                                    key={person.id}
                                    person={person}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                />
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={pagination.page}
                        itemsPerPage={pagination.size}
                        totalItems={pagination.total}
                        onChangePage={(page) =>
                            setPagination(prev => ({ ...prev, page }))
                        }
                        onChangeSize={(size) =>
                            setPagination(prev => ({ ...prev, size })) // сброс на первую страницу
                        }
                    />
                </>
            )}
        </>
    );
};
