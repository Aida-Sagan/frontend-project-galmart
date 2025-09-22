export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_URLS = {
    // Catalog
    HOMEPAGE: `${API_BASE_URL}/api/v2/catalog/homepage/`,
    BASE_SECTIONS: `${API_BASE_URL}/api/v2/catalog/base-sections/`,
    SECTION_DETAILS: (id) => `${API_BASE_URL}/api/v2/catalog/sections/${id}/goods/`,
    PRODUCT_DETAILS: (id) => `${API_BASE_URL}/api/v2/catalog/goods/${id}/`,
    COMPILATION_DETAILS: (id) => `${API_BASE_URL}/api/v2/catalog/compilations/${id}/`,
    FAVORITE: `${API_BASE_URL}/api/v2/catalog/favorite/`,
    FAVORITE_CLEAR: `${API_BASE_URL}/api/v2/catalog/favorite/clear/`,

    // Account
    SEND_CODE: `${API_BASE_URL}/api/v2/account/send_code/`,
    LOGIN: `${API_BASE_URL}/api/v2/account/login/`,
    ADDRESS: `${API_BASE_URL}/api/v2/account/address/`,
    GEOCODE: `${API_BASE_URL}/api/v2/account/geocode/`,
    POINTS: `${API_BASE_URL}/api/v2/account/points/`,
};

export const getCityHeader = () => {
    try {
        const cityJSON = localStorage.getItem('userCity');
        if (cityJSON) {
            const city = JSON.parse(cityJSON);
            return { 'X-City-ID': city.id };
        }
    } catch (e) {
        console.error(e);
        return {};
    }
    return {};
};