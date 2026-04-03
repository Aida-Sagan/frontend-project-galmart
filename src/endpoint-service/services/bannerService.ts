import { API_URLS } from '../api';
import $api from '../axiosInstance';

export const fetchHomepageBanners = async () => {
    try {
        const response = await $api.get(API_URLS.HOMEPAGE);
        return response.data.data.banners;
    } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        throw error;
    }
};