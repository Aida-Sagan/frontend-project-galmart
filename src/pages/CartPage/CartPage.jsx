import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import CartItemsSection from '../../components/CartSection/CartItemsSection';
import CheckoutSection from '../../components/CartSection/CheckoutSection';
import Container from '../../components/Container/Container';
import './style/CartPage.css';
import authRequiredIcon from '../../assets/is_exists.png';


const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Удалить недоступные товары?</h2>
                <p>Вы уверены, что хотите удалить товары, которых нет в наличии?</p>
                <div className="modal-actions">
                    <button className="modal-btn primary" onClick={onClose}>Отмена</button>
                    <button className="modal-btn secondary" onClick={onConfirm}>Удалить</button>
                </div>
            </div>
        </div>
    );
};


const UnauthorizedCartPlaceholder = () => {
    return (
        <div className="favorites-placeholder">
            <img src={authRequiredIcon} alt="Войдите в аккаунт" className="placeholder-image" />

            <h2  className="placeholder-title">Войдите или зарегистрируйтесь</h2>
            <p className="placeholder-subtitle">Чтобы добавлять товары в корзину необходима авторизация</p>
            <Link to="/login" className="auth-button">Войти</Link>
        </div>
    );
};

const CartContent = () => {
    const { cartData, isLoading, cartError, items, deleteUnavailableItemsApi, setOrderApi } = useCart();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const orderTotal = cartData?.total_price_incl_discount || 0;
    const deliveryCost = cartData?.delivery_price || 0;
    const bonusesValue = 30850;

    const [checkoutDetails, setCheckoutDetails] = useState({
        deliveryTime: cartData?.delivery_time || null,
        paymentMethod: 'Картой онлайн',
        usedBonuses: 0,
        comment: '',
        replaceItemsAction: 'replace_after_call',
        deliveryTimePreferences: 'on_time',
        leaveAtDoor: false,
        acceptPriceChanges: false,
    });

    const finalTotal = orderTotal + deliveryCost - checkoutDetails.usedBonuses;

    const hasOutOfStockItems = items?.some(item => item.out_of_stock) || false;

    const isCheckoutReady = useMemo(() => {
        const { paymentMethod, acceptPriceChanges } = checkoutDetails;

        const hasAddress = cartData?.address_string;
        const hasDeliveryTime = checkoutDetails.deliveryTime;
        const hasCard = paymentMethod !== null;
        const hasProducts = items?.length > 0;

        return hasAddress && hasDeliveryTime && hasCard && acceptPriceChanges && hasProducts;
    }, [checkoutDetails, cartData?.address_string, items?.length]);

    const handleClearUnavailableClick = () => setIsModalOpen(true);

    const handleConfirmClearUnavailable = async () => {
        try {
            await deleteUnavailableItemsApi();
        } catch (error) {
            console.error("Ошибка при очистке недоступных товаров:", error);
        }
        setIsModalOpen(false);
    };

    const handleOrderSubmit = () => {
        if (!isCheckoutReady) return;

        const orderDetails = {
            bonuses: checkoutDetails.usedBonuses,
            notes: checkoutDetails.comment,
            replace_items_action: checkoutDetails.replaceItemsAction,
            delivery_time_preferences: checkoutDetails.deliveryTimePreferences,
            leave_at_door: checkoutDetails.leaveAtDoor,
        };

        setOrderApi(orderDetails)
            .then(data => {
                console.log("Заказ успешно создан:", data);
            })
            .catch(error => {
                console.error("Ошибка при создании заказа:", error);
            });
    };


    if (isLoading) {
        return <div className="cart-content-loading">Загрузка корзины...</div>;
    }

    if (cartError) {
        return <div className="cart-content-error">Ошибка: {cartError}</div>;
    }

    if (!cartData || items.length === 0) {
        return (
            <div className="empty-cart-message">
                <h2>Ваша корзина пуста</h2>
                <p>Добавьте товары, чтобы начать оформление заказа.</p>
            </div>
        );
    }

    return (
        <div className="cart-content">
            <div className="cart-header">
                <h1>Корзина</h1>
                {hasOutOfStockItems && (
                    <button onClick={handleClearUnavailableClick} className="clear-unavailable-btn">
                        <span>Удалить недоступные</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                )}
            </div>

            <div className="cart-layout">
                <div className="cart-items-column">
                    <CartItemsSection />
                </div>

                <div className="cart-checkout-column">
                    <CheckoutSection
                        orderTotal={orderTotal}
                        deliveryCost={deliveryCost}
                        finalTotal={finalTotal}
                        bonuses={bonusesValue}
                        checkoutDetails={checkoutDetails}
                        setCheckoutDetails={setCheckoutDetails}
                        isCheckoutReady={isCheckoutReady}
                        onOrderSubmit={handleOrderSubmit}
                    />
                </div>
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClearUnavailable}
            />
        </div>
    );
};

const CartPage = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Container>
            <div className="cart-page-wrapper">
                {isAuthenticated ? (
                    <CartContent />
                ) : (
                    <UnauthorizedCartPlaceholder />
                )}
            </div>
        </Container>
    );
};

export default CartPage;