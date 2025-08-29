import { API_URLS } from '../api';

export const fetchCatalogData = async () => {
    try {
        const response = await fetch(API_URLS.BASE_SECTIONS);
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Не удалось получить данные каталога:", error);
        throw error;
    }
};

export const fetchSectionDetails = async (sectionId) => {
    try {
        const response = await fetch(API_URLS.SECTION_DETAILS(sectionId));
        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error(`Не удалось получить детали для секции ${sectionId}:`, error);
        return null;
    }
};