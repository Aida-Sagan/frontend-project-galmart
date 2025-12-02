import { API_URLS } from '../api';
import $api from '../axiosInstance';

export const fetchHomePageData = async () => {
    try {
        const response = await $api.get(API_URLS.HOMEPAGE);
        return response.data.data;
    } catch (error) {
        console.error("Не удалось получить данные для главной страницы:", error);
        return null;
    }
};