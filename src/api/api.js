export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_URLS = {
    // Catalog
    HOMEPAGE: `/api/v2/catalog/homepage/`,
    BASE_SECTIONS: `/api/v2/catalog/base-sections/`,
    SECTION_DETAILS: (id) => `/api/v2/catalog/sections/${id}/goods/`,
    PRODUCT_DETAILS: (id) => `/api/v2/catalog/goods/${id}/`,
    COMPILATION_DETAILS: (id) => `/api/v2/catalog/compilations/${id}/`,
    FAVORITE: `/api/v2/catalog/favorite/`,
    FAVORITE_CLEAR: `/api/v2/catalog/favorite/clear/`,

    // Account
    SEND_CODE: `/api/v2/account/send_code/`,
    LOGIN: `/api/v2/account/login/`,
    PROFILE: `/api/v2/account/profile/`,
    ADDRESS: `/api/v2/account/address/`,
    GEOCODE: `/api/v2/account/geocode/`,
    POINTS: `/api/v2/account/points/`,

    // Order / Cart (New Endpoints)
    GET_CART_DATA: `/api/v2/orders/basket/`,
    SET_BASKET_ITEM: `/api/v2/orders/basket/set/`,
    CLEAR_CART: `/api/v2/orders/basket/clear/`,
    GET_DELIVERY_TIMES: `/api/v2/orders/get_delivery_times`,
    SET_DELIVERY_TIME: `/api/v2/orders/basket/set_delivery_time/`,
    CREATE_ORDER: `/api/v2/orders/order/`,
    APPLY_PROMOCODE: '/api/v2/promocode_my/apply/',


};
