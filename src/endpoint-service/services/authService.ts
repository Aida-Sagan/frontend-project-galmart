import { API_URLS } from '../api';
import $api from '../axiosInstance';

export const sendLoginCode = (login) => {
    return $api.post(API_URLS.SEND_CODE, { login });
};

export const loginWithCode = (login, code) => {
    return $api.post(API_URLS.LOGIN, { login, code });
};

export const fetchFavorites = ({ page = 1, limit = 16, ordering = '' } = {}) => {
    return $api.get(API_URLS.FAVORITE, {
        params: {
            page,
            limit,
            ordering
        }
    });
};

export const toggleFavorite = (productId) => {
    return $api.post(API_URLS.FAVORITE, { id: productId });
};

export const clearAllFavorites = () => {
    return $api.delete(API_URLS.FAVORITE_CLEAR);
};

export const completeRegistrationApi = (userData) => {

    return $api.post(API_URLS.PROFILE, userData);
};