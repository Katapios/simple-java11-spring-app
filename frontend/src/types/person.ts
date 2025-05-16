export interface Person {
    id?: number;
    name: string;
    age: number;
    email: string;
}

export type SortableField = 'id' | 'name' | 'age' | 'email';

export interface SortConfig {
    field: SortableField;
    direction: 'asc' | 'desc';
}

export interface PaginationState {
    page: number;
    size: number;
    total: number;
}

export type PersonFormData = Omit<Person, 'id'>;

export interface PeopleApiResponse {
    data: Person[];
    total: number;
}
