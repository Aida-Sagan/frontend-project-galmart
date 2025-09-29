import { API_URLS } from '../api';

export const fetchCompilationById = async (id, page = 1, ordering = 'popular') => {
    try {
        const baseUrl = API_URLS.COMPILATION_DETAILS(id);

        const params = new URLSearchParams({
            page: page,
            page_size: 12,
            ordering: ordering,
        });

        const response = await fetch(`${baseUrl}?${params.toString()}`);
        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response body:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
        }

        const data = await response.json();
        return data.data;

    } catch (error) {
        console.error(`Failed to get data for compilation ${id}:`, error);
        throw error;
    }
};