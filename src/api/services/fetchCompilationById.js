import { API_URLS } from '../api';

export const fetchCompilationById = async (id, page = 1) => {
    try {
        const baseUrl = API_URLS.COMPILATION_DETAILS(id);

        // Указываем количество товаров на странице через page_size
        const response = await fetch(`${baseUrl}?page=${page}&page_size=12`);

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error(`Не удалось получить данные для подборки ${id}:`, error);
        return null;
    }
};