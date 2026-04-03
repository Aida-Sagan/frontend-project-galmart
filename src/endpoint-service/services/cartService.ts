import { API_URLS } from '../api';
import $api from '../axiosInstance';

/**
 * Получение корзины
 * @returns {Promise<DTO>}
 */
export const getCartData = async () => {
    try {
        const response = await $api.get(API_URLS.GET_CART_DATA);
        return response.data;
    } catch (error) {
        console.error(`[Service] 🛑 Ошибка при получении корзины:`, error);
        throw error;
    }
};

/**
 * Добавление/удаление товаров в корзине (Установка количества)
 */
export const updateCart = async (count, item) => {
    const itemToSend = String(item);
    const body = {
        'count': count,
        'item': itemToSend,
    };

    try {
        const response = await $api.put(API_URLS.SET_BASKET_ITEM, body);
        return response.data;
    } catch (error) {
        console.error("Ошибка при изменении корзины:", error);

        let errorMessage = 'Не удалось изменить количество товара в корзине';

        if (error.response && error.response.data) {
            const errorDetail = error.response.data;
            if (errorDetail.detail) {
                errorMessage = errorDetail.detail;
            } else if (errorDetail.item) {
                errorMessage = `Ошибка в поле 'item': ${errorDetail.item.join('; ')}`;
            } else if (errorDetail.count) {
                errorMessage = `Ошибка в поле 'count': ${errorDetail.count.join('; ')}`;
            }
        }

        throw new Error(errorMessage);
    }
};

/**
 * Очистка корзины
 */
export const deleteCart = async (deleteOnlyUnavailable = false) => {
    try {
        const response = await $api.delete(API_URLS.CLEAR_CART, {
            params: {
                is_unavailable_items: deleteOnlyUnavailable
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при очистке корзины:", error);
        throw error;
    }
};

// ----------------------------------------------------
// --- Методы для доставки и оформления заказа ---
// ----------------------------------------------------

/**
 * Получение списка доступного времени доставки
 */
export const getDeliveryTimes = async () => {
    try {
        const response = await $api.get(API_URLS.GET_DELIVERY_TIMES);
        return response.data;
    } catch (error) {
        console.error("Ошибка при получении времени доставки:", error);
        throw error;
    }
};

/**
 * Установка времени доставки
 */
export const setDeliveryTime = async (date, time) => {
    const body = {
        'delivery_date': date,
        'delivery_time': time,
    };
    try {
        const response = await $api.put(API_URLS.SET_DELIVERY_TIME, body);
        return response.data;
    } catch (error) {
        console.error("Ошибка при установке времени доставки:", error);
        throw error;
    }
};

/**
 * Создание заказа
 */
export const setOrder = async (orderDetails) => {
    const body = {};

    if (orderDetails.bonuses != null) body['bonuses'] = orderDetails.bonuses;
    if (orderDetails.comment != null) body['notes'] = orderDetails.comment;
    if (orderDetails.replaceItemsAction != null)
        body['replace_items_action'] = orderDetails.replaceItemsAction;
    if (orderDetails.deliveryTimePreferences != null)
        body['delivery_time_preferences'] = orderDetails.deliveryTimePreferences;
    if (orderDetails.leaveAtDoor != null) body['leave_at_door'] = orderDetails.leaveAtDoor;

    if (orderDetails.paymentMethodId != null) {
        body['payment_method_id'] = orderDetails.paymentMethodId;
    }

    try {
        const response = await $api.post(API_URLS.CREATE_ORDER, body);
        return response.data;
    } catch (error) {
        console.error("Ошибка при создании заказа:", error);
        throw error;
    }
};

// ----------------------------------------------------
// --- Методы для работы с промокодами ---
// ----------------------------------------------------

/**
 * Применение промокода
 * @param {string} code - Строка промокода
 * @returns {Promise<DTO>}
 */
export const setPromocode = async (code) => {
    try {

        const response = await $api.get(API_URLS.APPLY_PROMOCODE, {
            params: {
                code: code
            }
        });
        return response.data;
    } catch (error) {
        console.error("Ошибка при применении промокода:", error);
        throw error;
    }
};


/**
 * Получение списка сохраненных карт
 */
export const getSavedCards = async () => {
    try {
        const response = await $api.get('/api/v2/account/card/');

        if (response.data && Array.isArray(response.data.data)) {
            return response.data.data;
        }

        if (Array.isArray(response.data)) {
            return response.data;
        }

        return [];
    } catch (error) {
        console.error("Ошибка при получении карт:", error);
        return [];
    }
};

/**
 * Удаление карты
 */
export const deleteSavedCard = async (cardId) => {
    try {
        const response = await $api.delete(`/api/v2/account/card/${cardId}/`);
        return response.data;
    } catch (error) {
        console.error("Ошибка при удалении карты:", error);
        throw error;
    }
};

export const attachNewCard = async () => {
    try {
        const response = await $api.post('/api/v2/account/card/', {});
        return response.data?.data?.url || response.data?.url;
    } catch (error) {
        console.error("Ошибка при получении ссылки на привязку карты:", error);
        throw error;
    }
};