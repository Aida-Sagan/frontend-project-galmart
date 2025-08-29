export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_URLS = {
    HOMEPAGE: `${API_BASE_URL}/api/v2/catalog/homepage/`,
    BASE_SECTIONS: `${API_BASE_URL}/api/v2/catalog/base-sections/`,
    SECTION_DETAILS: (id) => `${API_BASE_URL}/api/v2/catalog/sections/${id}/goods/`,
};