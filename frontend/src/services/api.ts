import axios, { AxiosError } from 'axios';
import { Person } from '../types/person';

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
});

export interface ApiResponse<T> {
    data: T;
    total?: number;
}

export interface GetPeopleParams {
    page: number;
    size: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
}

export const getPeople = async (params: GetPeopleParams): Promise<ApiResponse<Person[]>> => {
    try {
        const response = await api.get<Person[]>('/persons', { params });
        return {
            data: response.data,
            total: parseInt(response.headers['x-total-count']) || 0
        };
    } catch (error) {
        throw handleApiError(error);
    }
};

export const getPerson = async (id: number): Promise<Person> => {
    try {
        const response = await api.get<Person>(`/persons/${id}`);
        return response.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const createPerson = async (person: Omit<Person, 'id'>): Promise<void> => {
    try {
        await api.post('/persons', person);
    } catch (error) {
        throw handleApiError(error);
    }
};

export const updatePerson = async (id: number, person: Omit<Person, 'id'>): Promise<void> => {
    try {
        await api.put(`/persons/${id}`, person);
    } catch (error) {
        throw handleApiError(error);
    }
};

export const deletePerson = async (id: number): Promise<void> => {
    try {
        await api.delete(`/persons/${id}`);
    } catch (error) {
        throw handleApiError(error);
    }
};

const handleApiError = (error: unknown): Error => {
    if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        return new Error(
            (axiosError.response?.data as any)?.message ||
            axiosError.message ||
            'Произошла ошибка при запросе к серверу'
        );
    }
    return new Error('Неизвестная ошибка');
};
