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

export const sendLoginCode = (login) => {
    return apiClient(API_URLS.SEND_CODE, {
        method: 'POST',
        body: JSON.stringify({ login }),
    });
};

export const loginWithCode = (login, code) => {
    return apiClient(API_URLS.LOGIN, {
        method: 'POST',
        body: JSON.stringify({ login, code }),
    });
};

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

export const toggleFavorite = (productId) => {
    const url = API_URLS.FAVORITE;

    return apiClient(url, {
        method: 'POST',
        body: JSON.stringify({ id: productId }),
    });
};

export const clearAllFavorites = () => {
    return apiClient(API_URLS.FAVORITE_CLEAR, {
        method: 'DELETE',
    });
};

export const completeRegistrationApi = async (userData, tempToken) => {
    const PROFILE_URL = `${import.meta.env.VITE_API_BASE_URL}/api/v2/account/profile/`;

    const response = await fetch(PROFILE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tempToken}`
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Ошибка обновления профиля');
    }

    return response.json();
};