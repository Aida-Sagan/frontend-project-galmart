import $api from '../axiosInstance';
import { API_URLS } from '../api';

export const getUserData = async () => {
    try {
        const response = await $api.get(API_URLS.PROFILE);
        const data = response.data.data || response.data;
        console.log("[Service] getUserData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных пользователя:", error);
        throw error;
    }
};

export const getTermsData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/legal/');
        const data = response.data.data || response.data;
        console.log("[Service] getTermsData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении юридических данных:", error);
        throw error;
    }
};

export const getOnlineOrdersData = async () => {
    try {
        const response = await $api.get('/api/v2/orders/order/history/');
        const data = response.data.data || response.data;
        console.log("[Service] getOnlineOrdersData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении онлайн заказов:", error);
        return { orders: [], message: 'Нет заказов.' };
    }
};

export const getOfflineOrdersData = async () => {
    try {
        const response = await $api.get('/api/v2/bonus/transaction/1');
        const data = response.data.data || response.data;
        console.log("[Service] getOfflineOrdersData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных о бонусных транзакциях:", error);
        return { transactions: [] };
    }
};

export const getAllActions = async () => {
    try {
        const response = await $api.get('/getAllActions');
        const data = response.data.data || response.data;
        console.log("[Service] getAllActions:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении акций:", error);
        return [];
    }
};

export const getAllPromocodes = async () => {
    try {
        const response = await $api.get('/api/v2/promocode_my/favorites/');
        const data = response.data.data || response.data;
        console.log("[Service] getAllPromocodes:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении промокодов:", error);
        return [];
    }
};

export const checkNewPromocode = async (promocode) => {
    try {
        const response = await $api.post('/api/v2/promocode_my/add_favorite/', null, {
            params: { code: promocode },
        });
        const data = response.data.data || response.data;
        console.log(`[Service] checkNewPromocode (${promocode}):`, data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при проверке/добавлении промокода:", error);
        throw error;
    }
};

export const getCheckRegisterPageData = async () => {
    try {
        const response = await $api.get('/api/v2/actions/registration/');
        const data = response.data.data || response.data;
        console.log("[Service] getCheckRegisterPageData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных регистрации:", error);
        throw error;
    }
};

export const getActionPageData = async (actionId) => {
    try {
        const response = await $api.get(API_URLS.COMPILATION_DETAILS(actionId));
        const data = response.data.data || response.data;
        console.log(`[Service] getActionPageData (${actionId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при получении данных акции ${actionId}:`, error);
        throw error;
    }
};

export const getInviteFriendsPageData = async () => {
    try {
        const response = await $api.get('/getInviteFriendsPageData');
        const data = response.data.data || response.data;
        console.log("[Service] getInviteFriendsPageData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных 'Пригласить друзей':", error);
        throw error;
    }
};

export const getContactsPageData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/contact/');
        const data = response.data.data || response.data;
        console.log("[Service] getContactsPageData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении контактов:", error);
        throw error;
    }
};

export const getShopAddressesData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/shops/');
        const data = response.data.data || response.data;
        console.log("[Service] getShopAddressesData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении адресов магазинов:", error);
        throw error;
    }
};

export const getQuestionsPageData = async () => {
    try {
        const response = await $api.get('/api/v2/addits/questions/');
        const data = response.data.data || response.data;
        console.log("[Service] getQuestionsPageData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении вопросов (FAQ):", error);
        throw error;
    }
};

export const getOrderInfoPageData = async (orderId) => {
    try {
        const response = await $api.get(`${API_URLS.CREATE_ORDER}${orderId}`);
        const data = response.data.data || response.data;
        console.log(`[Service] getOrderInfoPageData (${orderId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при получении информации о заказе ${orderId}:`, error);
        throw error;
    }
};

export const getReviewPagePageData = async () => {
    try {
        const response = await $api.get('/api/v2/orders/order/review_items');
        const data = response.data.data || response.data;
        console.log("[Service] getReviewPagePageData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении списка товаров для отзыва:", error);
        return [];
    }
};

export const sendReview = async (orderId, body) => {
    try {
        const response = await $api.post(`${API_URLS.CREATE_ORDER}${orderId}/review/`, body);
        const data = response.data.data || response.data;
        console.log(`[Service] sendReview (${orderId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при отправке отзыва для заказа ${orderId}:`, error);
        throw error;
    }
};

export const setDeliveryTime = async (orderId, body) => {
    try {
        const response = await $api.put(`${API_URLS.CREATE_ORDER}${orderId}/`, body);
        const data = response.data.data || response.data;
        console.log(`[Service] setDeliveryTime (${orderId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при установке времени доставки для заказа ${orderId}:`, error);
        throw error;
    }
};

export const getUserAddresses = async () => {
    try {
        const response = await $api.get(API_URLS.ADDRESS);
        const data = response.data.data || response.data;
        console.log("[Service] getUserAddresses:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении адресов:", error);
        return [];
    }
};

export const changeOrder = async (orderId, body) => {
    try {
        const response = await $api.post(`${API_URLS.CREATE_ORDER}${orderId}/action/`, body);
        const data = response.data.data || response.data;
        console.log(`[Service] changeOrder (${orderId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при изменении заказа ${orderId}:`, error);
        throw error;
    }
};

export const deleteUserAddress = async (addressId) => {
    try {
        const response = await $api.delete(`${API_URLS.ADDRESS}${addressId}/`);
        const data = response.data.data || response.data;
        console.log(`[Service] deleteUserAddress (${addressId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при удалении адреса ${addressId}:`, error);
        throw error;
    }
};

export const setAddressAsFavourite = async (addressId) => {
    try {
        const response = await $api.patch(`${API_URLS.ADDRESS}${addressId}/`, {});
        const data = response.data.data || response.data;
        console.log(`[Service] setAddressAsFavourite (${addressId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при установке адреса ${addressId} как избранного:`, error);
        throw error;
    }
};

export const getUserPaymentsCards = async () => {
    try {
        const response = await $api.get('/api/v2/account/card/');
        const data = response.data.data || response.data;
        console.log("[Service] getUserPaymentsCards:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении карт:", error);
        return [];
    }
};

export const addUserPaymentsCard = async () => {
    try {
        const response = await $api.post('/api/v2/account/card/', {});
        const data = response.data.data || response.data;
        console.log("[Service] addUserPaymentsCard:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при добавлении карты:", error);
        throw error;
    }
};

export const changeUserMainPaymentsCard = async (cardId) => {
    try {
        const response = await $api.post(`/api/v2/account/card/${cardId}/favorite/`, {});
        const data = response.data.data || response.data;
        console.log(`[Service] changeUserMainPaymentsCard (${cardId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при смене основной карты ${cardId}:`, error);
        throw error;
    }
};

export const deleteUserPaymentsCard = async (cardId) => {
    try {
        const response = await $api.delete(`/api/v2/account/card/${cardId}/`);
        const data = response.data.data || response.data;
        console.log(`[Service] deleteUserPaymentsCard (${cardId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при удалении карты ${cardId}:`, error);
        throw error;
    }
};

export const editUserAddress = async (addressId, body) => {
    try {
        const response = await $api.patch(`${API_URLS.ADDRESS}${addressId}/`, body);
        const data = response.data.data || response.data;
        console.log(`[Service] editUserAddress (${addressId}):`, data);
        return data;
    } catch (error) {
        console.error(`[Service] Ошибка при редактировании адреса ${addressId}:`, error);
        throw error;
    }
};

export const editUserInfo = async (body) => {
    try {
        const response = await $api.patch(API_URLS.PROFILE, body);
        const data = response.data.data || response.data;
        console.log("[Service] editUserInfo:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при редактировании информации пользователя:", error);
        throw error;
    }
};

export const getCityPolygons = async (authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.get(API_URLS.POINTS, { headers });
        const data = response.data.data || response.data;
        console.log("[Service] getCityPolygons:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении полигонов городов:", error);
        throw error;
    }
};

export const saveAddress = async (body, authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.post(API_URLS.ADDRESS, body, { headers });
        const data = response.data.data || response.data;
        console.log("[Service] saveAddress:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при сохранении адреса:", error);
        throw error;
    }
};

export const getAddressByCoordinates = async (body, authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.post(API_URLS.GEOCODE, body, { headers });
        const data = response.data.data || response.data;
        console.log("[Service] getAddressByCoordinates:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при обратном геокодировании:", error);
        throw error;
    }
};

export const getCoordinatesByString = async (body, authHeader) => {
    try {
        const headers = authHeader ? { Authorization: authHeader } : {};
        const response = await $api.post(API_URLS.GEOCODE, body, { headers });
        const data = response.data.data || response.data;
        console.log("[Service] getCoordinatesByString:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при прямом геокодировании:", error);
        throw error;
    }
};

export const getSavingData = async () => {
    try {
        const response = await $api.get('/getSavingData');
        const data = response.data.data || response.data;
        console.log("[Service] getSavingData:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при получении данных сохранения:", error);
        throw error;
    }
};