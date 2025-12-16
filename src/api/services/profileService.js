import $api from '../axiosInstance';
import { API_URLS } from '../api';

/**
 * Получение данных пользователя (Соответствует getUserData)
 * Использует: API_URLS.PROFILE
 */
export const getUserData = async () => {
    try {
        const response = await $api.get(API_URLS.PROFILE);
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных пользователя:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getTermsData)
 * Использует: /api/v2/addits/legal/ (строка)
 */
export const getTermsData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/legal/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении юридических данных:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getOnlineOrdersData)
 * Использует: '/api/v2/orders/order/history/' (строка, так как нет в API_URLS)
 */
export const getOnlineOrdersData = async () => {
    try {
        const response = await $api.get('/api/v2/orders/order/history/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении онлайн заказов:", error);
        return { orders: [], message: 'Нет заказов.' };
    }
};

/**
 * Получение списка товаров категории (getOfflineOrdersData)
 * Использует: /api/v2/bonus/transaction/1 (строка)
 */
export const getOfflineOrdersData = async () => {
    try {
        const response = await $api.get('/api/v2/bonus/transaction/1');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных о бонусных транзакциях:", error);
        return { transactions: [] };
    }
};

/**
 * Получение списка товаров категории (getAllActions)
 * Использует: /getAllActions (строка)
 */
export const getAllActions = async () => {
    try {
        const response = await $api.get('/getAllActions');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении акций:", error);
        return [];
    }
};

/**
 * Получение списка товаров категории (getAllPromocodes)
 * Использует: /api/v2/promocode_my/favorites/ (строка)
 */
export const getAllPromocodes = async () => {
    try {
        const response = await $api.get('/api/v2/promocode_my/favorites/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении промокодов:", error);
        return [];
    }
};

/**
 * Получение списка товаров категории (checkNewPromocode )
 * Использует: /api/v2/promocode_my/add_favorite/ (строка, похож на API_URLS.APPLY_PROMOCODE)
 */
export const checkNewPromocode = async (promocode) => {
    try {
        const response = await $api.post('/api/v2/promocode_my/add_favorite/', null, {
            params: { code: promocode },
        });
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при проверке/добавлении промокода:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getCheckRegisterPageData )
 * Использует: /api/v2/actions/registration/ (строка)
 */
export const getCheckRegisterPageData = async () => {
    try {
        const response = await $api.get('/api/v2/actions/registration/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных регистрации:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getActionPageData из Dart)
 * Использует: API_URLS.COMPILATION_DETAILS(id)
 */
export const getActionPageData = async (actionId) => {
    try {
        const response = await $api.get(API_URLS.COMPILATION_DETAILS(actionId));
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при получении данных акции ${actionId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getInviteFriendsPageData из Dart)
 * Использует: /getInviteFriendsPageData (строка)
 */
export const getInviteFriendsPageData = async () => {
    try {
        const response = await $api.get('/getInviteFriendsPageData');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных 'Пригласить друзей':", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getContactsPageData из Dart)
 * Использует: /api/v2/addits/contact/ (строка)
 */
export const getContactsPageData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/contact/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении контактов:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getShopAddressesData из Dart)
 * Использует: /api/v2/addits/shops/ (строка)
 */
export const getShopAddressesData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/shops/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении адресов магазинов:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getQuestionsPageData из Dart)
 * Использует: /api/v2/addits/questions/ (строка)
 */
export const getQuestionsPageData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/questions/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении вопросов (FAQ):", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getOrderInfoPageData из Dart)
 * Использует: API_URLS.CREATE_ORDER + orderId (строка)
 */
export const getOrderInfoPageData = async (orderId) => {
    try {
        // NOTE: Используем API_URLS.CREATE_ORDER, так как это базовый URL для заказов
        const response = await $api.get(`${API_URLS.CREATE_ORDER}${orderId}`);
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при получении информации о заказе ${orderId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getReviewPagePageData из Dart)
 * Использует: /api/v2/orders/order/review_items (строка)
 */
export const getReviewPagePageData = async () => {
    try {
        const response = await $api.get('/api/v2/orders/order/review_items');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении списка товаров для отзыва:", error);
        return [];
    }
};

/**
 * Получение списка товаров категории (sendReview из Dart)
 * Использует: API_URLS.CREATE_ORDER + orderId (строка)
 */
export const sendReview = async (orderId, body) => {
    try {
        const response = await $api.post(`${API_URLS.CREATE_ORDER}${orderId}/review/`, body);
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при отправке отзыва для заказа ${orderId}:`, error);
        throw error;
    }
};

/**
 * Получение категорий каталога (setDeliveryTime из Dart)
 * Использует: API_URLS.CREATE_ORDER + orderId (строка)
 */
export const setDeliveryTime = async (orderId, body) => {
    try {
        const response = await $api.put(`${API_URLS.CREATE_ORDER}${orderId}/`, body);
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при установке времени доставки для заказа ${orderId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getUserAddresses из Dart)
 * Использует: API_URLS.ADDRESS
 */
export const getUserAddresses = async () => {
    try {
        const response = await $api.get(API_URLS.ADDRESS);
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении адресов:", error);
        return [];
    }
};

/**
 * Получение списка товаров категории (changeOrder из Dart)
 * Использует: API_URLS.CREATE_ORDER + orderId (строка)
 */
export const changeOrder = async (orderId, body) => {
    try {
        const response = await $api.post(`${API_URLS.CREATE_ORDER}${orderId}/action/`, body);
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при изменении заказа ${orderId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (deleteUserAddress из Dart)
 * Использует: API_URLS.ADDRESS + addressId (строка)
 */
export const deleteUserAddress = async (addressId) => {
    try {
        const response = await $api.delete(`${API_URLS.ADDRESS}${addressId}/`);
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при удалении адреса ${addressId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (setAddressAsFavourite из Dart)
 * Использует: API_URLS.ADDRESS + addressId (строка)
 */
export const setAddressAsFavourite = async (addressId) => {
    try {
        const response = await $api.patch(`${API_URLS.ADDRESS}${addressId}/`, {});
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при установке адреса ${addressId} как избранного:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getUserPaymentsCards из Dart)
 * Использует: /api/v2/account/card/ (строка)
 */
export const getUserPaymentsCards = async () => {
    try {
        const response = await $api.get('/api/v2/account/card/');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении карт:", error);
        return [];
    }
};

/**
 * Получение списка товаров категории (addUserPaymentsCard из Dart)
 * Использует: /api/v2/account/card/ (строка)
 */
export const addUserPaymentsCard = async () => {
    try {
        const response = await $api.post('/api/v2/account/card/', {});
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при добавлении карты:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (changeUserMainPaymentsCard из Dart)
 * Использует: /api/v2/account/card/ + cardId (строка)
 */
export const changeUserMainPaymentsCard = async (cardId) => {
    try {
        const response = await $api.post(`/api/v2/account/card/${cardId}/favorite/`, {});
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при смене основной карты ${cardId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (deleteUserPaymentsCard из Dart)
 * Использует: /api/v2/account/card/ + cardId (строка)
 */
export const deleteUserPaymentsCard = async (cardId) => {
    try {
        const response = await $api.delete(`/api/v2/account/card/${cardId}/`);
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при удалении карты ${cardId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (editUserAddress из Dart)
 * Использует: API_URLS.ADDRESS + addressId (строка)
 */
export const editUserAddress = async (addressId, body) => {
    try {
        const response = await $api.patch(`${API_URLS.ADDRESS}${addressId}/`, body);
        return response.data.data || response.data;
    } catch (error) {
        console.error(`[Service] Ошибка при редактировании адреса ${addressId}:`, error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (editUserInfo из Dart)
 * Использует: API_URLS.PROFILE
 */
export const editUserInfo = async (body) => {
    try {
        const response = await $api.patch(API_URLS.PROFILE, body);
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при редактировании информации пользователя:", error);
        throw error;
    }
};

/**
 * Получение списка зон доставки (getCityPolygons из Dart)
 * Использует: API_URLS.POINTS
 */
export const getCityPolygons = async (authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.get(API_URLS.POINTS, { headers });
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении полигонов городов:", error);
        throw error;
    }
};

/**
 * Сохранение адреса (saveAddress из Dart)
 * Использует: API_URLS.ADDRESS
 */
export const saveAddress = async (body, authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.post(API_URLS.ADDRESS, body, { headers });
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при сохранении адреса:", error);
        throw error;
    }
};

/**
 * Получить название адреса из координат (getAddressByCoordinates из Dart)
 * Использует: API_URLS.GEOCODE
 */
export const getAddressByCoordinates = async (body, authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.post(API_URLS.GEOCODE, body, { headers });
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при обратном геокодировании:", error);
        throw error;
    }
};

/**
 * Получить координаты адреса из его названия (getCoordinatesByString из Dart)
 * Использует: API_URLS.GEOCODE
 */
export const getCoordinatesByString = async (body, authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.post(API_URLS.GEOCODE, body, { headers });
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при прямом геокодировании:", error);
        throw error;
    }
};

/**
 * Получение списка товаров категории (getSavingData из Dart)
 * Использует: /getSavingData (строка)
 */
export const getSavingData = async () => {
    try {
        const response = await $api.get('/getSavingData');
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных сохранения:", error);
        throw error;
    }
};