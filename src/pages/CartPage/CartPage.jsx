import React, { useState, useMemo } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

import CartItemsSection from '../../components/CartSection/CartItemsSection';
import Container from '../../components/Container/Container';
import AddressModal from '../../components/AddressModal/AddressModal.jsx';
import './style/CartPage.css';
import authRequiredIcon from '../../assets/is_exists.png';
import cartEmpty from '../../assets/cartEmpty.png';

const TrashIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M3 6H5H21" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ChevronRight = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 18L15 12L9 6" stroke="#222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null;
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
            <h2 className="placeholder-title">Войдите или зарегистрируйтесь</h2>
            <p className="placeholder-subtitle">Чтобы добавлять товары в корзину необходима авторизация</p>
            <Link to="/login" className="auth-button">Войти</Link>
        </div>
    );
};

const CartContent = () => {
    // Added fetchCart to destructuring
    const { cartData, isLoading, cartError, items, deleteUnavailableItemsApi, setOrderApi, fetchCart } = useCart();

    const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false); // NEW STATE

    const orderTotal = cartData?.total_price_incl_discount || 0;
    const deliveryCost = cartData?.delivery_price || 0;
    const freeDeliveryThreshold = 1389;
    const bonusesValue = 30850;

    const [checkoutDetails, setCheckoutDetails] = useState({
        deliveryTime: cartData?.delivery_time || null,
        paymentMethod: 'Картой онлайн',
        useBonuses: false,
        promoCode: '',
        comment: '',
        replaceItemsAction: 'replace_after_call',
        deliveryTimePreferences: 'on_time',
        leaveAtDoor: false,
        acceptPriceChanges: false,
    });

    const finalTotal = orderTotal + deliveryCost - (checkoutDetails.useBonuses ? 0 : 0);

    const hasOutOfStockItems = items?.some(item => item.out_of_stock) || false;

    // Delivery progress logic
    const deliveryProgress = Math.min((deliveryCost / freeDeliveryThreshold) * 100, 100);

    const isCheckoutReady = useMemo(() => {
        const hasAddress = cartData?.address_string;
        const hasCard = true;
        const hasProducts = items?.length > 0;
        return hasAddress && hasCard && checkoutDetails.acceptPriceChanges && hasProducts;
    }, [checkoutDetails, cartData?.address_string, items?.length]);

    const handleClearCartClick = () => {
        console.log("Очистить всю корзину");
    };

    const handleOrderSubmit = () => {
        if (!isCheckoutReady) return;
        const orderDetails = {
            bonuses: checkoutDetails.useBonuses ? bonusesValue : 0,
            notes: checkoutDetails.comment,
            replace_items_action: checkoutDetails.replaceItemsAction,
            delivery_time_preferences: checkoutDetails.deliveryTimePreferences,
            leave_at_door: checkoutDetails.leaveAtDoor,
        };
        setOrderApi(orderDetails)
            .then(data => console.log("Заказ успешно создан:", data))
            .catch(error => console.error("Ошибка при создании заказа:", error));
    };

    // Callback when address changes in modal
    const handleAddressUpdate = () => {
        // Refresh cart to get new address string and delivery price
        fetchCart();
    };

    if (isLoading) return <div className="cart-content-loading">Загрузка корзины...</div>;
    if (cartError) return <div className="cart-content-error">Ошибка: {cartError}</div>;

    if (!cartData || (items.length === 0 && !isLoading)) {
        return (
            <div className="empty-cart-message">
                <img src={cartEmpty} alt="Корзина пуста" className="placeholder-image" />
                <h2>В корзине пока пусто</h2>
                <p>Добавьте товары, чтобы продолжить оформление заказа</p>
            </div>
        );
    }

    return (
        <div className="cart-content">
            <div className="cart-page-header">
                <h1>Корзина</h1>
                <button className="clear-cart-text-btn" onClick={handleClearCartClick}>
                    Очистить корзину <TrashIcon />
                </button>
            </div>

            <div className="cart-layout">
                {/* Left Column - Items */}
                <div className="cart-items-column">
                    <CartItemsSection />

                    {hasOutOfStockItems && (
                        <div className="out-of-stock-section">
                            <div className="out-of-stock-header">
                                <h2>Нет в наличии</h2>
                                <button onClick={() => setIsUnavailableModalOpen(true)} className="clear-unavailable-link">
                                    Очистить список
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column - Checkout */}
                <div className="cart-checkout-column">

                    {/* 1. Delivery Block */}
                    <div className="checkout-widget">
                        <div className="widget-header">
                            <h3>Доставка {deliveryCost} ₸</h3>
                        </div>
                        <div className="delivery-progress-text">
                            До бесплатной доставки {freeDeliveryThreshold} ₸
                        </div>
                        <div className="delivery-progress-bar">
                            <div className="progress-fill" style={{ width: `${deliveryProgress}%` }}></div>
                        </div>
                    </div>

                    {/* 2. Address and Time Block */}
                    <div className="checkout-widget clickable-widget">
                        {/* ADDRESS ROW - CLICKABLE */}
                        <div className="widget-row border-bottom" onClick={() => setIsAddressModalOpen(true)}>
                            <div className="widget-info">
                                <span className="label">Адрес доставки</span>
                                {/* Display address from backend or prompt to select */}
                                <span className={cartData?.address_string ? "value" : "value red-text"}>
                                    {cartData?.address_string || "Выберите адрес"}
                                </span>
                            </div>
                            <ChevronRight />
                        </div>

                        <div className="widget-row">
                            <div className="widget-info">
                                <span className="label">Время доставки</span>
                                <span className="value red-text">
                                    {checkoutDetails.deliveryTime ? checkoutDetails.deliveryTime : "Время доставки не указано"}
                                </span>
                            </div>
                            <ChevronRight />
                        </div>
                    </div>

                    {/* 3. Replacements Block */}
                    <div className="checkout-widget clickable-widget">
                        <div className="widget-row">
                            <div className="widget-info">
                                <span className="label">Замена товаров</span>
                                <span className="sub-label">Позвонить и заменить</span>
                            </div>
                            <ChevronRight />
                        </div>
                        <div className="widget-input-wrapper">
                            <input
                                type="text"
                                placeholder="Напишите, если что-то не нашли"
                                className="widget-input"
                                value={checkoutDetails.comment}
                                onChange={(e) => setCheckoutDetails({...checkoutDetails, comment: e.target.value})}
                            />
                        </div>
                    </div>

                    {/* 4. Preferences Block */}
                    <div className="checkout-widget clickable-widget">
                        <div className="widget-row">
                            <div className="widget-info">
                                <span className="label">Пожелания по доставке</span>
                                <span className="sub-label">В указанное время</span>
                            </div>
                            <ChevronRight />
                        </div>
                    </div>

                    {/* 5. Payment Block */}
                    <div className="checkout-widget">
                        <div className="widget-header">
                            <h3>Способ оплаты</h3>
                        </div>
                        <div className="widget-row clickable-row border-bottom">
                            <span className="label">Выберите способ оплаты</span>
                            <ChevronRight />
                        </div>
                        <div className="widget-row clickable-row border-bottom">
                            <div className="widget-info">
                                <span className="label">Списать бонусы</span>
                                <span className="sub-label">Накоплено {bonusesValue} бонусов</span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={checkoutDetails.useBonuses}
                                    onChange={() => setCheckoutDetails({...checkoutDetails, useBonuses: !checkoutDetails.useBonuses})}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="widget-row clickable-row">
                            <span className="label">Промокод</span>
                            <ChevronRight />
                        </div>
                    </div>

                    {/* 6. Total Summary Block */}
                    <div className="checkout-widget summary-widget">
                        <div className="widget-header">
                            <h3>Сумма к оплате</h3>
                        </div>
                        <div className="summary-row">
                            <span>Сумма заказа</span>
                            <span>{orderTotal.toLocaleString()} ₸</span>
                        </div>
                        <div className="summary-row">
                            <span>Доставка</span>
                            <span>{deliveryCost.toLocaleString()} ₸</span>
                        </div>
                        <div className="summary-total-row">
                            <span>Итого</span>
                            <span>{finalTotal.toLocaleString()} ₸</span>
                        </div>

                        <label className="legal-checkbox">
                            <input
                                type="checkbox"
                                checked={checkoutDetails.acceptPriceChanges}
                                onChange={(e) => setCheckoutDetails({...checkoutDetails, acceptPriceChanges: e.target.checked})}
                            />
                            <span className="checkmark"></span>
                            <span className="legal-text">
                                Я подтверждаю, что сумма заказа может измениться из-за наличия весового товара в моем заказе
                            </span>
                        </label>

                        <button
                            className="checkout-submit-btn"
                            disabled={!isCheckoutReady}
                            onClick={handleOrderSubmit}
                        >
                            Оплатить {finalTotal.toLocaleString()} ₸
                        </button>
                    </div>

                </div>
            </div>

            {/* CONFIRMATION MODAL FOR CLEARING ITEMS */}
            <ConfirmationModal
                isOpen={isUnavailableModalOpen}
                onClose={() => setIsUnavailableModalOpen(false)}
                onConfirm={() => { /* add delete logic here */ setIsUnavailableModalOpen(false); }}
            />

            {/* ADDRESS MODAL - CONNECTED */}
            <AddressModal
                isOpen={isAddressModalOpen}
                onClose={() => setIsAddressModalOpen(false)}
                onAddressUpdate={handleAddressUpdate}
            />
        </div>
    );
};

const CartPage = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Container>
            <div className="cart-page-wrapper">
                {isAuthenticated ? <CartContent /> : <UnauthorizedCartPlaceholder />}
            </div>
        </Container>
    );
};

export default CartPage;