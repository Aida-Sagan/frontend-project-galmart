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


export const applyPromocode = async (code) => {
    try {
        const response = await $api.get(API_URLS.APPLY_PROMOCODE, {
            params: { code }
        });
        const data = response.data.data || response.data;
        console.log("[Service] applyPromocode success:", data);
        return data;
    } catch (error) {
        console.error("[Service] Ошибка при применении промокода:", error);
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

export const registerCheck = async (payload) => {
    try {
        const response = await $api.post(API_URLS.CHECK_REGISTRATION, payload);
        return response.data.data || response.data;
    } catch (error) {
        console.error("[Service] Ошибка при регистрации чека:", error);
        throw error;
    }
};