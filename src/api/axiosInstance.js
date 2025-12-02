import axios from 'axios';
import { API_BASE_URL } from './api';

const $api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
});

$api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    const savedCityJSON = localStorage.getItem('userCity');
    let cityName = null;
    let cityId = '2';

    if (savedCityJSON) {
        try {
            const parsed = JSON.parse(savedCityJSON);
            cityName = parsed.name || parsed;
        } catch (e) {
            console.error('Ошибка парсинга города', e);
        }
    }

    if (cityName === 'Алматы') {
        cityId = '1';
    } else if (cityName === 'Ташкент') {
        cityId = '3';
    } else {
        cityId = '2'; // Астана и все остальные случаи
    }
    config.headers['City'] = cityId;

    const locale = localStorage.getItem('locale') || 'ru';
    config.headers['Accept-Language'] = locale.toLowerCase();

    return config;
}, (error) => {
    return Promise.reject(error);
});

$api.interceptors.response.use((response) => {
    return response;
}, (error) => {
    return Promise.reject(error);
});

export default $api;