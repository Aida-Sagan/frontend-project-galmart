import $api from '../axiosInstance';
import { API_URLS } from '../api';

export const getOnlineOrdersData = async () => {
    try {
        const response = await $api.get(API_URLS.ORDER_HISTORY);
        const data = response.data.data || response.data;

        const orders = Array.isArray(data) ? data : (data.orders || []);

        return {
            // "Текущие" — те, что еще не завершены и не отменены
            active: orders.filter(o => !['completed', 'cancelled'].includes(o.status)),
            // "История" — только завершенные
            history: orders.filter(o => o.status === 'completed'),
            all: orders
        };
    } catch (error) {
        console.error("[Service] Ошибка онлайн заказов:", error);
        return { active: [], history: [], all: [] };
    }
};

/**
 * Получение детальных данных заказа (состав, адрес, чеки)
 * Соответствует getOrderInfoPageData из Flutter
 */
export const getOrderDetails = async (orderId) => {
    try {
        const response = await $api.get(API_URLS.ORDER_DETAILS(orderId));
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при получении деталей заказа ${orderId}:`, error);
        throw error;
    }
};

export const getOfflineOrdersData = async () => {
    try {
        const response = await $api.get(API_URLS.OFFLINE_ORDERS);
        const data = response.data.data || response.data;

        return Array.isArray(data) ? data : (data.transactions || []);
    } catch (error) {
        console.error("[Service] Ошибка оффлайн заказов:", error);
        return [];
    }
};

/**
 * Получение деталей конкретного заказа для страницы "Инфо о заказе"
 */
export const getOrderInfo = async (orderId) => {
    try {
        const response = await $api.get(API_URLS.ORDER_DETAILS(orderId));
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка загрузки заказа ${orderId}:`, error);
        throw error;
    }
};

// Добавьте в ordersService.js
export const changeOrder = async (orderId, action = 'cancel') => {
    try {
        const response = await $api.post(API_URLS.ORDER_ACTION(orderId), { action });
        return response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при изменении заказа ${orderId}:`, error);
        throw error;
    }
};

export const getChatHistory = async (key) => {
    try {
        const response = await $api.get(`/api/v2/chat/messages/${key}/`);
        return response.data.data || response.data;
    } catch (error) {
        console.error("Ошибка при загрузке истории чата:", error);
        throw error;
    }
};

/**
 * Оформление заявки на возврат или замену товаров
 * @param {string|number} orderId - ID заказа
 * @param {Object} returnData - Объект с данными (items, reason, и т.д.)
 */
export const orderReturn = async (orderId, returnData) => {
    try {
        const response = await $api.post(API_URLS.ORDER_RETURN(orderId), returnData);
        return response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при оформлении возврата заказа ${orderId}:`, error);
        throw error;
    }
};

/**
 * Отправка отзыва и оценки заказа
 * @param {string|number} orderId - ID заказа
 * @param {Object} reviewData - Объект с данными отзыва (оценка, комментарий и т.д.)
 */
export const sendOrderReview = async (orderId, reviewData) => {
    try {
        const response = await $api.post(API_URLS.ORDER_REVIEW(orderId), reviewData);
        return response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при отправке отзыва для заказа ${orderId}:`, error);
        throw error;
    }
};