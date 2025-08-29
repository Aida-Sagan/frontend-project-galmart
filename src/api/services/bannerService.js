
import { API_URLS } from '../api';

export const fetchHomepageBanners = async () => {
    try {
        const response = await fetch(API_URLS.HOMEPAGE);

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Server error response body:', errorText);
            throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
        }

        const data = await response.json();
        return data.data.banners;
    } catch (error) {
        console.error('Failed to fetch homepage data:', error);
        throw error;
    }
};