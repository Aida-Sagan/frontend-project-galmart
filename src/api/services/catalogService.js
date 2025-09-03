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


export const fetchProductDetails = async (productId) => {
    try {
        const url = API_URLS.PRODUCT_DETAILS(productId);
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Ошибка HTTP! Статус: ${response.status}`);
        }

        const result = await response.json();

        if (result && result.status === 200) {
            return result.data;
        } else {
            throw new Error(result.message || 'Ошибка получения данных о товаре');
        }
    } catch (error) {
        console.error(`Ошибка при загрузке товара ${productId}:`, error);
        throw error;
    }
};

