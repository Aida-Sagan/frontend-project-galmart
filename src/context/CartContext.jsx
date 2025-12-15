import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
    getCartData,
    updateCart as updateCartApi,
    setDeliveryTime as setDeliveryTimeService,
    getDeliveryTimes as getDeliveryTimesService,
    setOrder as setOrderService,
    deleteCart as deleteCartApi
} from '../api/services/cartService';
import { useLocation } from './LocationContext';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const [cartData, setCartData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [cartError, setCartError] = useState(null);

    const { city } = useLocation();

    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCartData(null);
            setCartError(null);
            return;
        }
        setIsLoading(true);
        try {
            const response = await getCartData();


            const dataToSave = response.data || response;

            setCartData(dataToSave);
            setCartError(null);
        } catch (error) {
            console.error("Ошибка загрузки корзины:", error);
            setCartError("Не удалось загрузить корзину.");
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (isAuthenticated && city) {
            fetchCart();
        }
    }, [isAuthenticated, city, fetchCart]);


    const updateCartItemQuantity = async (itemId, newCount, productDetails = {}) => {
        if (!isAuthenticated) {
            console.warn("Пользователь не авторизован. Действие отменено.");
            return;
        }

        const previousCartData = cartData;
        setCartError(null);

        setCartData(prev => {
            if (!prev || !prev.items) return prev;

            let updatedItems = [];
            const existingItem = prev.items.find(item => item.id === itemId);

            if (existingItem) {
                updatedItems = prev.items.map(item => {
                    if (item.id === itemId) {
                        return { ...item, quantity: newCount, count: newCount };
                    }
                    return item;
                });
            } else {
                updatedItems = [...prev.items, { ...productDetails, id: itemId, quantity: newCount }];
            }

            const newTotal = updatedItems.reduce((acc, i) => acc + (i.unit_price * i.quantity), 0);

            return { ...prev, items: updatedItems, total_price: newTotal };
        });

        try {
            await updateCartApi(newCount, itemId);
            await fetchCart();
        } catch (error) {
            setCartData(previousCartData);
            console.error("Ошибка API:", error);
        }
    };

    const removeCartItem = (itemId) => {
        updateCartItemQuantity(itemId, 0);
    };

    const clearCart = async () => {
        if (!isAuthenticated) return;

        setCartData({ ...cartData, items: [], total_price: 0 });

        try {
            await deleteCartApi(false);
            await fetchCart();
        } catch (error) {
            console.error("Ошибка очистки корзины:", error);
            await fetchCart();
        }
    };

    const getDeliveryTimesApi = async () => {
        try {
            const response = await getDeliveryTimesService();
            return response.data;
        } catch (error) {
            console.error("Ошибка получения времени доставки:", error);
            setCartError("Не удалось получить доступное время доставки.");
            throw error;
        }
    };

    const setDeliveryTimeApi = async (date, time) => {
        try {
            const response = await setDeliveryTimeService(date, time);
            setCartData(response.data);
            setCartError(null);
        } catch (error) {
            console.error("Ошибка установки времени доставки:", error);
            setCartError("Не удалось установить время доставки.");
            throw error;
        }
    };

    const setOrderApi = async (orderDetails) => {
        try {
            const response = await setOrderService(orderDetails);
            await fetchCart();
            return response.data;
        } catch (error) {
            console.error("Ошибка создания заказа:", error);
            // set OrderError здесь больше не вызывается, чтобы не блокировать модальное окно ошибки.
            throw error;
        }
    };


    const value = {
        cartData,
        isLoading,
        cartError,
        items: cartData?.items || [],
        fetchCart,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        getDeliveryTimesApi,
        setDeliveryTimeApi,
        setOrderApi,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
    return useContext(CartContext);
};