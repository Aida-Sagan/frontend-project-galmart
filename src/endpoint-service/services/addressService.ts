import $api from '../axiosInstance';
import { API_URLS } from '../api';

/**
 * Получение списка сохраненных адресов пользователя
 * Токен и City Header подставятся автоматически через интерсептор
 * @returns {Promise<Array>} - Массив адресов
 */
export const fetchAddresses = async () => {
    try {
        const response = await $api.get(API_URLS.ADDRESS);

        return response.data.data;
    } catch (error) {
        console.error("Ошибка при получении адресов:", error);
        return [];
    }
};

/**
 * Сохранение нового адреса
 * @param {object} addressData - Объект с данными адреса
 * @returns {Promise<object>} - Сохраненный объект адреса
 */
export const saveAddress = async (addressData) => {
    try {
        const response = await $api.post(API_URLS.ADDRESS, addressData);
        return response.data.data;
    } catch (error) {
        console.error("Ошибка при сохранении адреса:", error);
        throw error;
    }
};

/**
 * Получение координат по строке адреса
 * @param {string} address - Строка для поиска (улица, дом)
 * @param {number} cityId - ID города (оставляем, если эндпоинт требует это именно в body)
 * @returns {Promise<object|null>} - Объект с { latitude, longitude }
 */
export const getCoordsByString = async (address, cityId) => {
    try {
        const response = await $api.post(API_URLS.GEOCODE, {
            latitude: null,
            longitude: null,
            search_string: address,
            city: cityId
        });
        return response.data.data[0];
    } catch (error) {
        console.error("Ошибка при получении координат:", error);
        return null;
    }
};

/**
 * Получение адреса по координатам
 * @param {number} latitude - Широта
 * @param {number} longitude - Долгота
 * @returns {Promise<object|null>} - Объект с адресом { address, building, ... }
 */
export const getAddressByCoords = async (latitude, longitude) => {
    try {
        const response = await $api.post(API_URLS.GEOCODE, {
            latitude,
            longitude
        });
        return response.data.data[0];
    } catch (error) {
        console.error("Ошибка при получении адреса:", error);
        return null;
    }
};

/**
 * Получение полигонов зон доставки для текущего города
 * @returns {Promise<Array>} - Массив полигонов
 */
export const getCityPolygons = async (token = null) => {
    try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const response = await $api.get(API_URLS.POINTS, config);
        return response.data.data;
    } catch (error) {
        console.error("Ошибка при получении зон доставки:", error);
        return [];
    }
};

/**
 * Удаление адреса по его ID
 * @param {number} addressId - ID адреса
 * @returns {Promise<boolean>}
 */
export const deleteAddress = async (addressId) => {
    try {
        // Axios сам подставит нужные хедеры
        await $api.delete(`${API_URLS.ADDRESS}${addressId}/`);
        return true;
    } catch (error) {
        console.error("Ошибка при удалении адреса:", error);
        return false;
    }
};

/**
 * Установка адреса как избранного
 * @param {number} addressId - ID адреса
 * @returns {Promise<object>} - Обновленный объект адреса
 */
export const setAddressAsFavourite = async (addressId) => {
    try {
        const response = await $api.patch(`${API_URLS.ADDRESS}${addressId}/`);
        return response.data.data;
    } catch (error) {
        console.error("Ошибка при установке избранного адреса:", error);
        throw error;
    }
};