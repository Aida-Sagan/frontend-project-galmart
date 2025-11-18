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

    // ➡️ LOG 1: Запрос и Токен
    console.log('API Client Request:');
    console.log('  URL:', url);
    console.log('  Method:', options.method || 'GET');
    console.log('  Using Token:', !!token);
    if (options.body) {
        console.log('  Body:', JSON.parse(options.body));
    }
    console.log('---');

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
    // ➡️ LOG 2: Данные для отправки кода
    console.log('Sending Login Code for:', login);
    return apiClient(API_URLS.SEND_CODE, {
        method: 'POST',
        body: JSON.stringify({ login }),
    });
};

/**
 * Отправляет номер телефона и код для проверки.
 */
export const loginWithCode = (login, code) => {
    // ➡️ LOG 3: Данные для входа
    console.log('Attempting Login with Code:', { login, code });
    return apiClient(API_URLS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ login, code }),
    });
};


/**
 * 1. Получает список избранных товаров.
 */
export const fetchFavorites = ({ page = 1, limit = 16, ordering = '' } = {}) => {
    const url = new URL(API_URLS.FAVORITE);
    url.searchParams.append('page', page);
    url.searchParams.append('limit', limit);
    if (ordering) {
        url.searchParams.append('ordering', ordering);
    }

    // ➡️ LOG 4: Параметры избранного
    console.log('Fetching Favorites with params:', { page, limit, ordering });

    return apiClient(url.toString(), {
        method: 'GET',
    });
};

/**
 * Добавляет или удаляет товар из избранного.
 */
export const toggleFavorite = (productId) => {
    const url = API_URLS.FAVORITE;

    // ➡️ LOG 5: ID для избранного
    console.log('Toggling Favorite for Product ID:', productId);

    return apiClient(url, {
        method: 'POST',
        body: JSON.stringify({ id: productId }),
    });
};

/**
 * 3. Удаляет все товары из избранного.
 */
export const clearAllFavorites = () => {
    // ➡️ LOG 6: Очистка избранного
    console.log('Clearing all Favorites.');
    return apiClient(API_URLS.FAVORITE_CLEAR, {
        method: 'DELETE',
    });
};


/**
 * Обновляет профиль пользователя, отправляя данные с формы регистрации.
 */
export const completeRegistrationApi = (userData, tempToken) => {

    const PROFILE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v2/account/profile/`;

    // ➡️ LOG 7: Данные регистрации и временный токен
    console.log('Completing Registration:');
    console.log('  Data:', userData);
    console.log('  Using Temporary Token:', !!tempToken);
    console.log('---');

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