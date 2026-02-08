import axios from 'axios';

export const searchProducts = async ({ text, page = 1, sort = 'default', categoryId = 1 }) => {
    try {
        const response = await axios.get('/api/search', {
            params: {
                text,
                page,
                sort,
                categoryId
            }
        });
        return response.data;
    } catch (error) {
        console.error("Search API Error:", error);
        throw error;
    }
};