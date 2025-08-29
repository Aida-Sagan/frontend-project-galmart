import { API_URLS } from '../api';

export const fetchHomePageData = async () => {
    try {
        const response = await fetch(API_URLS.HOMEPAGE);

        if (!response.ok) {
            throw new Error(`Ошибка сети: ${response.status}`);
        }

        const data = await response.json();
        return data.data;

    } catch (error) {
        console.error("Не удалось получить данные для главной страницы:", error);
        return null;
    }
};