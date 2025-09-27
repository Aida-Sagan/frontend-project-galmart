import { API_URLS, getCityHeader } from '../api';

/**
 * Получение списка сохраненных адресов пользователя
 * @param {string} token - Токен авторизации
 * @returns {Promise<Array>} - Массив адресов
 */
export const fetchAddresses = async (token) => {
    try {
        const response = await fetch(API_URLS.ADDRESS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...getCityHeader()
            },
        });
        if (!response.ok) throw new Error('Не удалось загрузить адреса');
        const result = await response.json();
        console.log('RESULT FROM ADDRESS', result);
        return result.data;
    } catch (error) {
        console.error("Ошибка при получении адресов:", error);
        return [];
    }
};

/**
 * Сохранение нового адреса
 * @param {object} addressData - Объект с данными адреса
 * @param {string} token - Токен авторизации
 * @returns {Promise<object>} - Сохраненный объект адреса
 */
export const saveAddress = async (addressData, token) => {
    try {
        const response = await fetch(API_URLS.ADDRESS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...getCityHeader()
            },
            body: JSON.stringify(addressData),
        });
        if (!response.ok) throw new Error('Не удалось сохранить адрес');
        const result = await response.json();
        console.log('RESULT FROM saveAddress', result);

        return result.data;
    } catch (error) {
        console.error("Ошибка при сохранении адреса:", error);
        throw error;
    }
};

/**
 * Получение координат по строке адреса
 * @param {string} address - Строка для поиска (улица, дом)
 * @param {number} cityId - ID города
 * @param {string} token - Токен авторизации
 * @returns {Promise<object|null>} - Объект с { latitude, longitude }
 */
export const getCoordsByString = async (address, cityId, token) => {
    try {
        const response = await fetch(API_URLS.GEOCODE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...getCityHeader()
            },
            body: JSON.stringify({ latitude: null, longitude: null, search_string: address, city: cityId }),
        });
        if (!response.ok) throw new Error('Ошибка геокодирования');
        const result = await response.json();
        return result.data[0];
    } catch (error) {
        console.error("Ошибка при получении координат:", error);
        return null;
    }
};
/**
 * Получение адреса по координатам
 * @param {number} latitude - Широта
 * @param {number} longitude - Долгота
 * @param {string} token - Токен авторизации
 * @returns {Promise<object|null>} - Объект с адресом { address, building, ... }
 */
export const getAddressByCoords = async (latitude, longitude, token) => {
    try {
        const response = await fetch(API_URLS.GEOCODE, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...getCityHeader()
            },
            body: JSON.stringify({ latitude, longitude }),
        });
        if (!response.ok) throw new Error('Ошибка обратного геокодирования');
        const result = await response.json();
        return result.data[0];
    } catch (error) {
        console.error("Ошибка при получении адреса:", error);
        return null;
    }
};

/**
 * Получение полигонов зон доставки для текущего города
 * @param {string} token - Токен авторизации
 * @returns {Promise<Array>} - Массив полигонов
 */
export const getCityPolygons = async (token) => {
    try {
        const response = await fetch(API_URLS.POINTS, {
            headers: {
                'Authorization': `Bearer ${token}`,
                ...getCityHeader()
            },
        });
        if (!response.ok) throw new Error('Не удалось загрузить зоны доставки');
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Ошибка при получении зон доставки:", error);
        return [];
    }
};

/**
 * Удаление адреса по его ID
 * @param {number} addressId - ID адреса, который нужно удалить
 * @param {string} token - Токен авторизации
 * @returns {Promise<boolean>} - true в случае успешного удаления, false - в противном случае
 */
export const deleteAddress = async (addressId, token) => {
    try {
        const response = await fetch(`${API_URLS.ADDRESS}${addressId}/`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                ...getCityHeader()
            },
        });
        if (!response.ok) throw new Error('Не удалось удалить адрес');
        return true;
    } catch (error) {
        console.error("Ошибка при удалении адреса:", error);
        return false;
    }
};


/**
 * Установка адреса как избранного
 * @param {number} addressId - ID адреса, который нужно сделать избранным
 * @param {string} token - Токен авторизации
 * @returns {Promise<object>} - Обновленный объект адреса
 */
export const setAddressAsFavourite = async (addressId, token) => {
    try {
        const response = await fetch(`${API_URLS.ADDRESS}${addressId}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                ...getCityHeader()
            },
        });
        if (!response.ok) throw new Error('Не удалось сделать адрес избранным');
        const result = await response.json();
        return result.data;
    } catch (error) {
        console.error("Ошибка при установке избранного адреса:", error);
        throw error;
    }
};