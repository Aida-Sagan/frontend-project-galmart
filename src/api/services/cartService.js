import { API_URLS, getCityHeader } from '../api';

const getToken = () => {
    try {
        return localStorage.getItem('authToken');
    } catch (e) {
        console.error("Ошибка при получении токена из localStorage:", e);
        return null;
    }
};

const getHeaders = (isJson = true) => {
    const token = getToken();
    const headers = {
        'Authorization': token ? `Bearer ${token}` : '',
        ...getCityHeader(),
    };
    if (isJson) {
        headers['Content-Type'] = 'application/json';
    }
    return headers;
};

// ------------------------------------------
// --- Методы для работы с корзиной ---
// ------------------------------------------

/**
 * Получение корзины
 * @returns {Promise<DTO>}
 */
export const getCartData = async () => {
    const requestUrl = API_URLS.GET_CART_DATA;
    try {
        console.log(`[Service] ➡️ Отправка GET запроса на URL: ${requestUrl}`);
        const response = await fetch(requestUrl, {
            headers: getHeaders(false),
        });

        if (!response.ok) {
            console.error(`[Service] ❌ API вернул ошибку ${response.status} для URL: ${requestUrl}`);
            throw new Error(`Не удалось получить данные корзины. Статус: ${response.status}`);
        }

        console.log(`[Service] ✅ Успешный ответ от URL: ${requestUrl}`);
        return response.json();
    } catch (error) {
        // Перехватывает TypeError: Failed to fetch (проблемы сети/CORS)
        console.error(`[Service] 🛑 Критическая ошибка при получении корзины. URL: ${requestUrl}`, error);
        throw error;
    }
};

// ------------------------------------------
// --- Остальные функции (без изменений) ---
// ------------------------------------------

/**
 * Добавление/удаление товаров в корзине (Установка количества)
 * ... (код updateCart остается прежним)
 */
export const updateCart = async (count, item) => {
    const itemToSend = String(item);
    console.log(`[Service] 📢 Попытка отправить запрос PUT/корзина: count=${count}, item=${itemToSend}`);
    const body = {
        'count': count,
        'item': itemToSend,
    };

    try {
        const response = await fetch(API_URLS.SET_BASKET_ITEM, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });

        console.log(`[Service] Статус ответа API: ${response.status}`);

        if (!response.ok) {
            let errorMessage = 'Не удалось изменить количество товара в корзине';
            try {
                const errorDetail = await response.json();
                console.error("API вернул ошибку. Детали:", errorDetail);
                if (errorDetail.detail) {
                    errorMessage = errorDetail.detail;
                } else if (errorDetail.item) {
                    errorMessage = `Ошибка в поле 'item': ${errorDetail.item.join('; ')}`;
                } else if (errorDetail.count) {
                    errorMessage = `Ошибка в поле 'count': ${errorDetail.count.join('; ')}`;
                }
            } catch (e) {
                // Игнорируем ошибку чтения тела ответа
            }
            throw new Error(errorMessage);
        }
        return response.json();
    } catch (error) {
        console.error("Ошибка при изменении корзины:", error);
        throw error;
    }
};

/**
 * Очистка корзины
 * ... (код deleteCart остается прежним)
 */
export const deleteCart = async (deleteOnlyUnavailable = false) => {
    let url = API_URLS.CLEAR_CART;
    if (deleteOnlyUnavailable) {
        url += '?is_unavailable_items=true';
    }
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: getHeaders(false),
        });
        if (!response.ok) throw new Error('Не удалось очистить корзину');
        return response.json();
    } catch (error) {
        console.error("Ошибка при очистке корзины:", error);
        throw error;
    }
};

// ----------------------------------------------------
// --- Методы для доставки и оформления заказа ---
// ----------------------------------------------------

/**
 * Получение списка доступного времени доставки
 * ... (код getDeliveryTimes остается прежним)
 */
export const getDeliveryTimes = async () => {
    try {
        const response = await fetch(API_URLS.GET_DELIVERY_TIMES, {
            headers: getHeaders(false),
        });
        if (!response.ok) throw new Error('Не удалось получить время доставки');
        return response.json();
    } catch (error) {
        console.error("Ошибка при получении времени доставки:", error);
        throw error;
    }
};

/**
 * Установка времени доставки
 * ... (код setDeliveryTime остается прежним)
 */
export const setDeliveryTime = async (date, time) => {
    const body = {
        'delivery_date': date,
        'delivery_time': time,
    };
    try {
        const response = await fetch(API_URLS.SET_DELIVERY_TIME, {
            method: 'PUT',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Не удалось установить время доставки');
        return response.json();
    } catch (error) {
        console.error("Ошибка при установке времени доставки:", error);
        throw error;
    }
};

/**
 * Создание заказа
 * ... (код setOrder остается прежним)
 */
export const setOrder = async (orderDetails) => {
    const body = {};

    if (orderDetails.bonuses != null) body['bonuses'] = orderDetails.bonuses;
    if (orderDetails.comment != null) body['notes'] = orderDetails.comment;
    if (orderDetails.replaceItemsAction != null)
        body['replace_items_action'] = orderDetails.replaceItemsAction;
    if (orderDetails.deliveryTimePreferences != null)
        body['delivery_time_preferences'] = orderDetails.deliveryTimePreferences;
    if (orderDetails.leaveAtDoor != null) body['leave_at_door'] = orderDetails.leaveAtDoor;

    try {
        const response = await fetch(API_URLS.CREATE_ORDER, {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify(body),
        });
        if (!response.ok) throw new Error('Ошибка при создании заказа');
        return response.json();
    } catch (error) {
        console.error("Ошибка при создании заказа:", error);
        throw error;
    }
};