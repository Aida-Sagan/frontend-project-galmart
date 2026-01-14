import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import {
    getCartData,
    updateCart as updateCartApi,
    setDeliveryTime as setDeliveryTimeService,
    getDeliveryTimes as getDeliveryTimesService,
    setOrder as setOrderService,
    deleteCart as deleteCartApi,
    getSavedCards as getSavedCardsApi,
    deleteSavedCard as deleteSavedCardApi
} from '../api/services/cartService';
import { useLocation } from './LocationContext';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const { city } = useLocation();

    const [cartData, setCartData] = useState(null);
    const [savedCards, setSavedCards] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isCardsLoading, setIsCardsLoading] = useState(false);
    const [cartError, setCartError] = useState(null);

    // Храним ID выбранного метода оплаты прямо в контексте
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState(() => {
        return localStorage.getItem('selectedPaymentMethodId') || 'apple_pay';
    });

    // Синхронизируем выбор с localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem('selectedPaymentMethodId', selectedPaymentMethodId);
    }, [selectedPaymentMethodId]);

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
            setCartError("Не удалось загрузить корзину.");
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    const fetchCards = useCallback(async () => {
        if (!isAuthenticated) {
            setSavedCards([]);
            return;
        }
        setIsCardsLoading(true);
        try {
            const cards = await getSavedCardsApi();
            const cardsList = cards || [];
            setSavedCards(cardsList);

            const currentMethodIsCard = !['apple_pay', 'kaspi'].includes(selectedPaymentMethodId);
            const cardStillExists = cardsList.some(c => c.id === selectedPaymentMethodId);

            if (cardsList.length > 0 && (!cardStillExists && currentMethodIsCard)) {
                const favoriteCard = cardsList.find(c => c.is_favorite) || cardsList[0];
                setSelectedPaymentMethodId(favoriteCard.id);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsCardsLoading(false);
        }
    }, [isAuthenticated, selectedPaymentMethodId]);

    const deleteCard = async (cardId) => {
        try {
            await deleteSavedCardApi(cardId);
            setSavedCards(prev => prev.filter(card => card.id !== cardId));
            if (selectedPaymentMethodId === cardId) {
                setSelectedPaymentMethodId('apple_pay');
            }
        } catch (error) {
            throw error;
        }
    };

    useEffect(() => {
        if (isAuthenticated && city) {
            fetchCart();
            fetchCards();
        }
    }, [isAuthenticated, city, fetchCart, fetchCards]);

    const updateCartItemQuantity = async (itemId, newCount, productDetails = {}) => {
        if (!isAuthenticated) return;
        const previousCartData = cartData;
        setCartError(null);
        setCartData(prev => {
            if (!prev || !prev.items) return prev;
            let updatedItems = [];
            const existingItem = prev.items.find(item => item.id === itemId);
            if (existingItem) {
                updatedItems = prev.items.map(item => item.id === itemId ? { ...item, quantity: newCount, count: newCount } : item);
            } else {
                updatedItems = [...prev.items, { ...productDetails, id: itemId, quantity: newCount, count: newCount }];
            }
            const newTotal = updatedItems.reduce((acc, i) => acc + (i.unit_price * i.quantity), 0);
            return { ...prev, items: updatedItems, total_price: newTotal };
        });
        try {
            await updateCartApi(newCount, itemId);
            await fetchCart();
        } catch (error) {
            setCartData(previousCartData);
        }
    };

    const clearCart = async () => {
        if (!isAuthenticated) return;
        try {
            await deleteCartApi(false);
            await fetchCart();
        } catch (error) {
            await fetchCart();
        }
    };

    const getDeliveryTimesApi = async () => {
        try {
            const response = await getDeliveryTimesService();
            return response.data;
        } catch (error) {
            setCartError("Не удалось получить время доставки.");
            throw error;
        }
    };

    const setDeliveryTimeApi = async (date, time) => {
        try {
            const response = await setDeliveryTimeService(date, time);
            setCartData(response.data);
            setCartError(null);
        } catch (error) {
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
            throw error;
        }
    };

    const value = {
        cartData,
        isLoading,
        savedCards,
        isCardsLoading,
        selectedPaymentMethodId,
        setSelectedPaymentMethodId,
        cartError,
        items: cartData?.items || [],
        fetchCart,
        fetchCards,
        deleteCard,
        updateCartItemQuantity,
        clearCart,
        getDeliveryTimesApi,
        setDeliveryTimeApi,
        setOrderApi,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => useContext(CartContext);