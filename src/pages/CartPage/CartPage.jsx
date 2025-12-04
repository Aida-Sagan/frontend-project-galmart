import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { Link } from 'react-router-dom';
import { deleteCart as deleteCartService } from '../../api/services/cartService';

import CartItemsSection from '../../components/CartSection/CartItemsSection';
import Container from '../../components/Container/Container';
import LocationModal from '../../components/AddressModal/LocationModal';
import Loader from '../../components/Loader/Loader.jsx';
import DeliveryTimeModal from './DeliveryTimeModal/DeliveryTimeModal';

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

const CartSkeleton = () => {
    return (
        <div className="cart-content animate-pulse">
            <div className="cart-page-header">
                <div className="skeleton-box" style={{ width: '200px', height: '40px', borderRadius: '8px' }}></div>
                <div className="skeleton-box" style={{ width: '150px', height: '20px', borderRadius: '4px' }}></div>
            </div>
            <div className="cart-layout">
                <div className="cart-items-column">
                    {[1, 2, 3].map((item) => (
                        <div key={item} className="skeleton-box" style={{ width: '100%', height: '140px', marginBottom: '16px', borderRadius: '16px' }}></div>
                    ))}
                </div>
                <div className="cart-checkout-column">
                    <div className="skeleton-box" style={{ width: '100%', height: '100px', marginBottom: '16px', borderRadius: '16px' }}></div>
                    <div className="skeleton-box" style={{ width: '100%', height: '150px', marginBottom: '16px', borderRadius: '16px' }}></div>
                    <div className="skeleton-box" style={{ width: '100%', height: '300px', borderRadius: '16px' }}></div>
                </div>
            </div>
            <style>{`
                .skeleton-box {
                    background: #f0f0f0;
                    background: linear-gradient(90deg, #f0f0f0 25%, #f8f8f8 50%, #f0f0f0 75%);
                    background-size: 200% 100%;
                    animation: skeleton-loading 1.5s infinite;
                }
                @keyframes skeleton-loading {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </div>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, text }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>{title}</h2>
                <p>{text}</p>
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
    const {
        cartData,
        isLoading,
        cartError,
        items,
        setOrderApi,
        fetchCart
    } = useCart();

    const { city, loading: isLocationLoading, selectedAddress } = useLocation();

    const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
    const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);

    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);

    useEffect(() => {
        if (city) {
            fetchCart();
        }
    }, [city, selectedAddress, fetchCart]);

    const itemsPrice = cartData?.items_price || 0;
    const deliveryCost = cartData?.delivery_price || 0;
    const freeDeliveryThreshold = cartData?.free_delivery || 10000;

    const bonusesBalance = cartData?.bonuses?.balance || 0;
    const addressString = cartData?.address?.full_address || cartData?.address_string;
    const currency = cartData?.currency || '₸';

    const [checkoutDetails, setCheckoutDetails] = useState({
        paymentMethod: 'Картой онлайн',
        useBonuses: false,
        promoCode: '',
        comment: '',
        replaceItemsAction: 'Позвонить и заменить',
        deliveryTimePreferences: 'on_time',
        leaveAtDoor: false,
        acceptPriceChanges: false,
    });


    const discount = cartData?.applied_promocode?.amount || 0;

    const finalTotal = cartData?.total || (itemsPrice + deliveryCost - discount);
    const deliveryProgress = freeDeliveryThreshold > 0
        ? Math.min((itemsPrice / freeDeliveryThreshold) * 100, 100)
        : 100;

    const hasOutOfStockItems = items?.some(item => item.out_of_stock) || false;

    const isCheckoutReady = useMemo(() => {
        const hasAddress = !!addressString;
        const hasCard = true;
        const hasProducts = items?.length > 0;
        return hasAddress && hasCard && checkoutDetails.acceptPriceChanges && hasProducts;
    }, [checkoutDetails, addressString, items?.length]);

    const deliveryTimeRaw = cartData?.delivery_time;
    let displayDeliveryTime = null;

    if (deliveryTimeRaw) {
        if (typeof deliveryTimeRaw === 'string') {
            displayDeliveryTime = deliveryTimeRaw;
        } else if (typeof deliveryTimeRaw === 'object') {
            displayDeliveryTime = deliveryTimeRaw.time || deliveryTimeRaw.title || "Время выбрано";
        }
    }


    const handleTimeSaveSuccess = () => {
        fetchCart();
    };

    const handleClearCartClick = async () => {
        try {
            // false = удалить все (не только недоступные)
            await deleteCartService(false);
            setIsClearCartModalOpen(false);
            await fetchCart();
        } catch (error) {
            console.error("Ошибка при очистке корзины:", error);
            alert("Не удалось очистить корзину");
        }
    };

    const handleClearUnavailableClick = async () => {
        try {
            await deleteCartService(true);
            setIsUnavailableModalOpen(false);
            await fetchCart();
        } catch (error) {
            console.error("Ошибка при удалении недоступных:", error);
        }
    };

    const handleOrderSubmit = () => {
        if (!isCheckoutReady) return;

        const orderDetails = {
            bonuses: checkoutDetails.useBonuses ? 1 : 0,
            notes: checkoutDetails.comment,
            replace_items_action: checkoutDetails.replaceItemsAction === 'Позвонить и заменить' ? 'call' : 'replace', // Пример маппинга
            delivery_time_preferences: checkoutDetails.deliveryTimePreferences,
            leave_at_door: checkoutDetails.leaveAtDoor,
        };

        setOrderApi(orderDetails)
            .then(data => console.log("Заказ успешно создан:", data))
            .catch(error => console.error("Ошибка при создании заказа:", error));
    };

    const handleModalClose = () => {
        setIsAddressModalOpen(false);
        fetchCart();
    };


    if (isLocationLoading) return <Loader />;
    if (isLoading) return <CartSkeleton />;
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
                <button className="clear-cart-text-btn" onClick={() => setIsClearCartModalOpen(true)}>
                    Очистить корзину <TrashIcon />
                </button>
            </div>

            <div className="cart-layout">
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

                <div className="cart-checkout-column">

                    <div className="checkout-widget">
                        <div className="widget-header">
                            <h3>Доставка {deliveryCost > 0 ? `${deliveryCost} ${currency}` : 'Бесплатно'}</h3>
                        </div>
                        <div className="delivery-progress-text">
                            {itemsPrice < freeDeliveryThreshold
                                ? `До бесплатной доставки ${(freeDeliveryThreshold - itemsPrice).toLocaleString()} ${currency}`
                                : 'Для вас доставка будет бесплатной'
                            }
                        </div>
                        <div className="delivery-progress-bar">
                            <div className="progress-fill" style={{ width: `${deliveryProgress}%` }}></div>
                        </div>
                    </div>

                    <div className="checkout-widget clickable-widget">
                        <div className="widget-row border-bottom" onClick={() => setIsAddressModalOpen(true)}>
                            <div className="widget-info">
                                <span className="label">Адрес доставки</span>
                                <span className={addressString ? "value" : "value red-text"}>
                                    {addressString || "Выберите адрес"}
                                </span>
                            </div>
                            <ChevronRight />
                        </div>

                        <div className="widget-row" onClick={() => setIsDeliveryTimeModalOpen(true)}>
                            <div className="widget-info">
                                <span className="label">Время доставки</span>
                                <span className={displayDeliveryTime ? "value" : "value red-text"}>
                                {displayDeliveryTime || "Время доставки не указано"}
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
                                <span className="sub-label">{checkoutDetails.replaceItemsAction}</span>
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
                            <div className="widget-info">
                                <span className="label">Способ оплаты</span>
                                <span className="value">.... 2636 <span style={{border:'1px solid #ccc', padding:'0 4px', borderRadius:'4px', fontSize:'10px'}}>VISA</span></span>
                            </div>
                            <ChevronRight />
                        </div>

                        {/* Bonuses Switch */}
                        <div className="widget-row clickable-row border-bottom">
                            <div className="widget-info">
                                <span className="label">Списать бонусы</span>
                                <span className="sub-label" style={{color: '#902067'}}>
                                    {checkoutDetails.useBonuses
                                        ? `Списать ${bonusesBalance} бонусов`
                                        : `Баланс: ${bonusesBalance} бонусов`}
                                </span>
                            </div>
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={checkoutDetails.useBonuses}
                                    onChange={() => setCheckoutDetails({...checkoutDetails, useBonuses: !checkoutDetails.useBonuses})}
                                    disabled={bonusesBalance === 0}
                                />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="widget-row clickable-row">
                            <div className="widget-info">
                                <span className="label">Промокод</span>
                                {cartData?.applied_promocode?.code && (
                                    <span className="sub-label" style={{color: '#902067'}}>{cartData.applied_promocode.code}</span>
                                )}
                            </div>
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
                            <span>{itemsPrice.toLocaleString()} {currency}</span>
                        </div>
                        <div className="summary-row">
                            <span>Доставка</span>
                            <span>{deliveryCost > 0 ? `${deliveryCost} ${currency}` : '0 ' + currency}</span>
                        </div>

                        {/* Отображаем скидку если она есть */}
                        {discount > 0 && (
                            <div className="summary-row">
                                <span>Скидка</span>
                                <span>-{discount.toLocaleString()} {currency}</span>
                            </div>
                        )}

                        <div className="summary-total-row">
                            <span>Итого</span>
                            <span>{finalTotal.toLocaleString()} {currency}</span>
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
                            Оплатить {finalTotal.toLocaleString()} {currency}
                        </button>
                    </div>

                </div>
            </div>

            <DeliveryTimeModal
                isOpen={isDeliveryTimeModalOpen}
                onClose={() => setIsDeliveryTimeModalOpen(false)}
                onSaveSuccess={handleTimeSaveSuccess}
            />

            <ConfirmationModal
                isOpen={isUnavailableModalOpen}
                onClose={() => setIsUnavailableModalOpen(false)}
                onConfirm={handleClearUnavailableClick}
                title="Удалить недоступные товары?"
                text="Вы уверены, что хотите удалить товары, которых нет в наличии?"
            />

            <ConfirmationModal
                isOpen={isClearCartModalOpen}
                onClose={() => setIsClearCartModalOpen(false)}
                onConfirm={handleClearCartClick}
                title="Очистить корзину?"
                text="Вы уверены, что хотите удалить все товары из корзины?"
            />

            {/* ИЗМЕНЕНИЕ 2: Использование LocationModal. Условный рендеринг, так как внутри нет isOpen */}
            {isAddressModalOpen && (
                <LocationModal
                    onClose={handleModalClose}
                    onCitySelect={() => {}}
                />
            )}
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