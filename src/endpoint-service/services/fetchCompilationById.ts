import { API_URLS } from '../api';
import $api from '../axiosInstance';

export const fetchCompilationById = async (id, page = 1, ordering = 'popular') => {
    try {
        const response = await $api.get(API_URLS.COMPILATION_DETAILS(id), {
            params: {
                page: page,
                page_size: 12,
                ordering: ordering,
            }
        });
        return response.data.data;
    } catch (error) {
        console.error(`Failed to get data for compilation ${id}:`, error);
        throw error;
    }
};