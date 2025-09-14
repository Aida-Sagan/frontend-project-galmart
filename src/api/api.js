export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_URLS = {
    HOMEPAGE: `${API_BASE_URL}/api/v2/catalog/homepage/`,
    BASE_SECTIONS: `${API_BASE_URL}/api/v2/catalog/base-sections/`,
    SECTION_DETAILS: (id) => `${API_BASE_URL}/api/v2/catalog/sections/${id}/goods/`,
    PRODUCT_DETAILS: (id) => `${API_BASE_URL}/api/v2/catalog/goods/${id}/`,
    COMPILATION_DETAILS: (id) => `${API_BASE_URL}/api/v2/catalog/compilations/${id}/`,
    SEND_CODE: `${API_BASE_URL}/api/v2/account/send_code/`,
    LOGIN: `${API_BASE_URL}/api/v2/account/login/`,
    FAVORITE: `${API_BASE_URL}/api/v2/catalog/favorite/`,
    FAVORITE_CLEAR: `${API_BASE_URL}/api/v2/catalog/favorite/clear/`,
};