
import $api from '../axiosInstance';

const NOTIFICATIONS_COUNTERS_URL = '/api/v2/notifications/counters/';
const NOTIFICATIONS_URL = '/api/v2/notifications/';

/**
 * Получает счетчики непрочитанных уведомлений по категориям (orders, bonuses, news).
 * Соответствует getNotificationsCount в Dart.
 */
export const fetchNotificationsCount = async () => {
    try {
        const response = await $api.get(NOTIFICATIONS_COUNTERS_URL);
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении счетчиков уведомлений:", error);
        return { orders: 0, bonuses: 0, news: 0 };
    }
};

/**
 * Получает список уведомлений для определенной вкладки.
 *
 * @param {string} type - Тип вкладки ('orders', 'bonuses', 'news').
 */
export const fetchNotificationsData = async (type) => {
    try {
        const response = await $api.get(NOTIFICATIONS_URL, {
            params: { tab: type },
        });
        // Предполагаем, что бэкенд возвращает массив уведомлений
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при получении уведомлений для вкладки ${type}:`, error);
        return [];
    }
};