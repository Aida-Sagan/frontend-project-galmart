import { API_URLS } from '../api';

async function apiClient(url, options = {}) {
    const token = localStorage.getItem('authToken');
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Произошла ошибка');
    }
    const text = await response.text();
    return text ? JSON.parse(text) : {};
}

/**
 * Отправляет запрос на получение SMS-кода.
 */
export const sendLoginCode = (login) => {
    return apiClient(API_URLS.SEND_CODE, {
        method: 'POST',
        body: JSON.stringify({ login }),
    });
};

/**
 * Отправляет номер телефона и код для проверки.
 */
export const loginWithCode = (login, code) => {
    return apiClient(API_URLS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ login, code }),
    });
};


/**
 * 1. Получает список избранных товаров.
 * @param {object} params - Параметры для пагинации и сортировки.
 * @param {number} params.page - Номер страницы.
 * @param {number} params.limit - Количество элементов на странице.
 * @param {string} params.ordering - Поле для сортировки.
 */
export const fetchFavorites = ({ page = 1, limit = 16, ordering = '' } = {}) => {
    const url = new URL(API_URLS.FAVORITE);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    if (ordering) {
        url.searchParams.append('ordering', ordering);
    }

    return apiClient(url.toString(), {
        method: 'GET',
    });
};

/**
 * Добавляет или удаляет товар из избранного.
 */
export const toggleFavorite = (productId) => {
    const url = API_URLS.FAVORITE;

    return apiClient(url, {
        method: 'POST',
        body: JSON.stringify({ id: productId }),
    });
};

/**
 * 3. Удаляет все товары из избранного.
 */
export const clearAllFavorites = () => {
    return apiClient(API_URLS.FAVORITE_CLEAR, {
        method: 'DELETE',
    });
};


/**
 * Обновляет профиль пользователя, отправляя данные с формы регистрации.
 * @param {object} userData - Данные из формы (имя, фамилия и т.д.).
 * @param {string} tempToken - Временный токен, полученный после ввода кода.
 */
export const completeRegistrationApi = (userData, tempToken) => {

    const PROFILE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v2/account/profile/`;

    return fetch(PROFILE_URL, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify(userData),
    })
        .then(async response => {
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Ошибка обновления профиля');
            }
            return response.json();
        });
};