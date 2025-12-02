import { API_URLS } from '../api';
import $api from '../axiosInstance';

export const fetchCatalogData = async () => {
    try {
        const response = await $api.get(API_URLS.BASE_SECTIONS);
        return response.data.data;
    } catch (error) {
        console.error("Не удалось получить данные каталога:", error);
        throw error;
    }
};

const PAGE_SIZE = 10;

export const fetchSectionDetails = async (sectionId, { page = 1, ordering = 'popular', categories = '' }) => {
    try {
        const response = await $api.get(API_URLS.SECTION_DETAILS(sectionId), {
            params: {
                page: page,
                limit: PAGE_SIZE,
                ordering: ordering,
                categories: categories || undefined // undefined параметры axios не отправляет
            }
        });
        return response.data.data;
    } catch (error) {
        console.error(`Не удалось получить детали для секции ${sectionId}:`, error);
        return null;
    }
};

export const fetchProductDetails = async (productId) => {
    try {
        const response = await $api.get(API_URLS.PRODUCT_DETAILS(productId));
        const result = response.data;

        if (result && (!result.status || result.status === 200)) {
            return result.data;
        } else {
            throw new Error(result.message || 'Ошибка получения данных о товаре');
        }
    } catch (error) {
        console.error(`Ошибка при загрузке товара ${productId}:`, error);
        throw error;
    }
};