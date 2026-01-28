import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { setPromocode, attachNewCard } from '../../api/services/cartService';

import CartItemsSection from '../../components/CartSection/CartItemsSection';
import Container from '../../components/Container/Container';
import LocationModal from '../../components/AddressModal/LocationModal';
import Loader from '../../components/Loader/Loader.jsx';
import DeliveryTimeModal from './DeliveryTimeModal/DeliveryTimeModal';
import PromoCodeModal from './PromoCodeModal/PromoCodeModal';
import DeliveryPreferencesModal from './DeliveryPreferencesModal/DeliveryPreferencesModal';
import ReplacementModal from './ReplacementModal/ReplacementModal';
import PaymentMethodModal from './PaymentMethodModal/PaymentMethodModal';
import OrderFailureModal from './OrderFailureModal';
import OrderSuccessModal from './OrderSuccessModal';


import { ReactComponent as VisaIcon } from '../../assets/svg/visa.svg';
import { ReactComponent as MastercardIcon } from '../../assets/svg/mastercard.svg';
import { ReactComponent as CheckboxIcon } from '../../assets/svg/checkbox.svg';

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

const CartSkeleton = () => (
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
    </div>
);

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, text }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content modal-content-confirm" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>{title}</h2>
                <p>{text}</p>
                <div className="modal-actions">
                    <button className="modal-btn secondary" onClick={onConfirm}>Очистить корзину</button>
                    <button className="modal-btn primary" onClick={onClose}>Отмена</button>
                </div>
            </div>
        </div>
    );
};

const UnauthorizedCartPlaceholder = () => (
    <div className="favorites-placeholder">
        <img src={authRequiredIcon} alt="Войдите в аккаунт" className="placeholder-image" />
        <h2 className="placeholder-title">Войдите или зарегистрируйтесь</h2>
        <p className="placeholder-subtitle">Чтобы добавлять товары в корзину необходима авторизация</p>
        <Link to="/login" className="auth-button">Войти</Link>
    </div>
);

const CartContent = () => {
    const {
        cartData,
        isLoading,
        items,
        savedCards,
        isCardsLoading,
        selectedPaymentMethodId,
        setSelectedPaymentMethodId,
        deleteCard,
        setOrderApi,
        fetchCart,
        clearCart
    } = useCart();

    const { city, loading: isLocationLoading, selectedAddress } = useLocation();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUnavailableModalOpen, setIsUnavailableModalOpen] = useState(false);
    const [isClearCartModalOpen, setIsClearCartModalOpen] = useState(false);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [isDeliveryTimeModalOpen, setIsDeliveryTimeModalOpen] = useState(false);
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
    const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [isOrderFailureModalOpen, setIsOrderFailureModalOpen] = useState(false);
    const [orderFailureMessage, setOrderFailureMessage] = useState('');
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);


    const [checkoutDetails, setCheckoutDetails] = useState({
        useBonuses: false,
        comment: '',
        replaceItemsAction: 'Позвонить и заменить',
        deliveryTimePreferences: 'on_time',
        leaveAtDoor: false,
        acceptPriceChanges: false,
    });

    useEffect(() => {
        if (city) fetchCart();
    }, [city, selectedAddress, fetchCart]);

    const itemsPrice = cartData?.items_price || 0;
    const deliveryCost = cartData?.delivery_price || 0;
    const freeDeliveryThreshold = cartData?.free_delivery || 10000;
    const bonusesBalance = cartData?.bonuses?.balance || 0;
    const currency = cartData?.currency || '₸';
    const discount = cartData?.applied_promocode?.amount || 0;
    const promoCodeName = cartData?.applied_promocode?.code;
    const bonusesSpent = cartData?.bonuses?.spent || 0;
    const oldTotal = cartData?.old_total || 0;
    const finalTotal = cartData?.total || (itemsPrice + deliveryCost - discount - bonusesSpent);
    const checkboxMessage = cartData?.checkbox_message || " ";

    const handleApplyPromocode = async (code) => {
        await setPromocode(code);
        await fetchCart();
    };

    const handleSaveReplacementAction = (actionText) => {
        setCheckoutDetails(prev => ({ ...prev, replaceItemsAction: actionText }));
    };

    const addressString = selectedAddress?.full_address || selectedAddress?.base_address || selectedAddress?.address || cartData?.address?.full_address || cartData?.address_string || city?.name;

    const deliveryProgress = freeDeliveryThreshold > 0 ? Math.min((itemsPrice / freeDeliveryThreshold) * 100, 100) : 100;
    const hasOutOfStockItems = items?.some(item => item.out_of_stock) || false;

    const isCheckoutReady = useMemo(() => {
        const hasAddress = !!(selectedAddress || cartData?.address);
        const hasProducts = items?.length > 0;
        return hasAddress && checkoutDetails.acceptPriceChanges && hasProducts;
    }, [checkoutDetails.acceptPriceChanges, selectedAddress, cartData, items?.length]);

    const deliveryTimeRaw = cartData?.delivery_time;
    const displayDeliveryTime = useMemo(() => {
        if (!deliveryTimeRaw) return null;
        return typeof deliveryTimeRaw === 'string' ? deliveryTimeRaw : (deliveryTimeRaw.time || deliveryTimeRaw.title || "Время выбрано");
    }, [deliveryTimeRaw]);

    const handleSavePreferences = (newPrefs) => {
        setCheckoutDetails(prev => ({
            ...prev,
            deliveryTimePreferences: newPrefs.deliveryTimePreferences,
            leaveAtDoor: newPrefs.leaveAtDoor
        }));
    };

    const getPreferencesText = () => {
        const timeText = checkoutDetails.deliveryTimePreferences === 'on_time' ? 'В указанное время' : 'По возможности раньше';
        return checkoutDetails.leaveAtDoor ? `${timeText}, оставить у двери` : timeText;
    };

    const handleOrderSubmit = async () => {
        if (isSubmitting || !isCheckoutReady) return;

        setIsSubmitting(true);

        let replaceActionKey = 'call';
        if (checkoutDetails.replaceItemsAction === 'Не звонить и заменить') replaceActionKey = 'replace';
        if (checkoutDetails.replaceItemsAction === 'Не заменять') replaceActionKey = 'remove';

        const orderDetails = {
            bonuses: checkoutDetails.useBonuses ? 1 : 0,
            notes: checkoutDetails.comment,
            replace_items_action: replaceActionKey,
            delivery_time_preferences: checkoutDetails.deliveryTimePreferences,
            leave_at_door: checkoutDetails.leaveAtDoor,
            paymentMethodId: selectedPaymentMethodId,
        };

        try {
            await setOrderApi(orderDetails);

            setIsSuccessModalOpen(true);

            await clearCart();

        } catch (error) {
            const message = error?.response?.data?.message || error.message || "Произошла ошибка при оплате заказа.";
            setOrderFailureMessage(message);
            setIsOrderFailureModalOpen(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleAddNewCard = async () => {
        try {
            const url = await attachNewCard();
            if (url) window.location.href = url;
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            alert("Ошибка при попытке добавить карту");
        }
    };

    const getSelectedMethodName = () => {
        if (isCardsLoading) return { name: "Загрузка..." };
        const card = savedCards.find(c => c.id === selectedPaymentMethodId);
        if (card) {
            const last4 = card.name?.slice(-4) || '****';
            const system = (card.type || 'visa').toLowerCase();
            return {
                name: `•••• ${last4}`,
                icon: system === 'visa' ? <VisaIcon /> : <MastercardIcon />,
                isCard: true,
                system
            };
        }

        return { name: 'Выбрать способ оплаты' };
    };

    if (isLocationLoading) return <Loader />;
    if (isLoading) return <CartSkeleton />;

    if (!cartData || (items.length === 0 && !isLoading)) {
        return (
            <div className="empty-cart-message">
                <img src={cartEmpty} alt="Корзина пуста" className="placeholder-image" />
                <h2>В корзине пока пусто</h2>
                <p>Добавьте товары, чтобы продолжить оформление заказа</p>
            </div>
        );
    }

    const currentMethod = getSelectedMethodName();

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
                                <button onClick={() => setIsUnavailableModalOpen(true)} className="clear-unavailable-link">Очистить список</button>
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
                            {itemsPrice < freeDeliveryThreshold ? `До бесплатной доставки ${(freeDeliveryThreshold - itemsPrice).toLocaleString()} ${currency}` : 'Для вас доставка будет бесплатной'}
                        </div>
                        <div className="delivery-progress-bar">
                            <div className="progress-fill" style={{ width: `${deliveryProgress}%` }}></div>
                        </div>
                    </div>

                    <div className="checkout-widget clickable-widget">
                        <div className="widget-row border-bottom" onClick={() => setIsAddressModalOpen(true)}>
                            <div className="widget-info">
                                <span className="label">Адрес доставки</span>
                                <span className={addressString ? "value" : "value red-text"}>{addressString || "Выберите адрес"}</span>
                            </div>
                            <ChevronRight />
                        </div>
                        <div className="widget-row" onClick={() => setIsDeliveryTimeModalOpen(true)}>
                            <div className="widget-info">
                                <span className="label">Время доставки</span>
                                <span className={displayDeliveryTime ? "value" : "value red-text"}>{displayDeliveryTime || "Время доставки не указано"}</span>
                            </div>
                            <ChevronRight />
                        </div>
                    </div>

                    <div className="checkout-widget clickable-widget">
                        <div className="widget-row" onClick={() => setIsReplacementModalOpen(true)}>
                            <div className="widget-info">
                                <span className="widget-info-text">Замена товаров</span>
                                <span className="sub-label">{checkoutDetails.replaceItemsAction}</span>
                            </div>
                            <ChevronRight />
                        </div>
                        <div className="widget-input-wrapper">
                            <input type="text" placeholder="Напишите, если что-то не нашли" className="widget-input" value={checkoutDetails.comment} onChange={(e) => setCheckoutDetails({...checkoutDetails, comment: e.target.value})} />
                        </div>
                    </div>

                    <div className="checkout-widget clickable-widget">
                        <div className="widget-row" onClick={() => setIsPreferencesModalOpen(true)}>
                            <div className="widget-info">
                                <span className="widget-info-text ">Пожелания по доставке</span>
                                <span className="sub-label">{getPreferencesText()}</span>
                            </div>
                            <ChevronRight />
                        </div>
                    </div>

                    <div className="checkout-widget">
                        <div className="widget-header"><h3>Способ оплаты</h3></div>
                        <div className="widget-row clickable-row border-bottom" onClick={() => setIsPaymentModalOpen(true)}>
                            <div className="widget-info">
                                <span className="label">Способ оплаты</span>
                                <div className="payment-value-container" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className="value">{currentMethod.name}</span>
                                    {currentMethod.isCard && (
                                        <div className={`card-icon ${currentMethod.system}`} >
                                            {currentMethod.icon}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <ChevronRight />
                        </div>

                        <div className="widget-row clickable-row border-bottom">
                            <div className="widget-info">
                                <span className="label">Списать бонусы</span>
                                <span className="sub-label" style={{color: '#902067'}}>{checkoutDetails.useBonuses ? `Списать ${bonusesBalance} бонусов` : `Баланс: ${bonusesBalance} бонусов`}</span>
                            </div>
                            <label className="toggle-switch">
                                <input type="checkbox" checked={checkoutDetails.useBonuses} onChange={() => setCheckoutDetails({...checkoutDetails, useBonuses: !checkoutDetails.useBonuses})} disabled={bonusesBalance === 0} />
                                <span className="slider round"></span>
                            </label>
                        </div>
                        <div className="widget-row clickable-row" onClick={() => setIsPromoModalOpen(true)}>
                            <div className="widget-info">
                                <span className="label">Промокод</span>
                                {cartData?.applied_promocode?.code ? (
                                    <span className="sub-label" style={{color: '#902067'}}>{cartData.applied_promocode.code} (Применен)</span>
                                ) : (
                                    <span className="sub-label">Введите промокод</span>
                                )}
                            </div>
                            <ChevronRight />
                        </div>
                    </div>

                    <div className="checkout-widget summary-widget">
                        <div className="widget-header"><h3>Сумма к оплате</h3></div>
                        <div className="summary-row"><span>Сумма заказа</span><span>{itemsPrice.toLocaleString()} {currency}</span></div>
                        <div className="summary-row"><span>Доставка</span><span>{deliveryCost > 0 ? `${deliveryCost} ${currency}` : '0 ' + currency}</span></div>

                        <div className="summary-row discount-row">
                            <div className="discount-main-line">
                                <span className="discount-label">Скидка</span>
                                <span className="discount-value">
                                    -{discount.toLocaleString()} {currency}
                                </span>
                            </div>
                            {promoCodeName && (
                                <span className="promo-name">По промокоду {promoCodeName}</span>
                            )}
                        </div>

                        {bonusesSpent > 0 && <div className="summary-row bonus-spent-row"><span>Оплачено бонусами</span><span>-{bonusesSpent.toLocaleString()} {currency}</span></div>}
                        <div className="summary-total-row">
                            <span>Итого</span>
                            <span className="final-total-value">
                                {oldTotal > finalTotal && oldTotal > 0 && <span className="old-total-price">{oldTotal.toLocaleString()} {currency} </span>}
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M15.9697 7.46967C15.6768 7.76256 15.6768 8.23744 15.9697 8.53033L18.6893 11.25H4C3.58579 11.25 3.25 11.5858 3.25 12C3.25 12.4142 3.58579 12.75 4 12.75H18.6893L15.9697 15.4697C15.6768 15.7626 15.6768 16.2374 15.9697 16.5303C16.2626 16.8232 16.7374 16.8232 17.0303 16.5303L21.0303 12.5303C21.3232 12.2374 21.3232 11.7626 21.0303 11.4697L17.0303 7.46967C16.7374 7.17678 16.2626 7.17678 15.9697 7.46967Z" fill="#222222"/>
                                </svg>

                                {finalTotal.toLocaleString()} {currency}
                            </span>
                        </div>
                        <label className="legal-checkbox">
                            <input type="checkbox" checked={checkoutDetails.acceptPriceChanges} onChange={(e) => setCheckoutDetails({...checkoutDetails, acceptPriceChanges: e.target.checked})} />
                            <span className="checkmark"><CheckboxIcon /></span>
                            <span className="legal-text-cart">{checkboxMessage}</span>
                        </label>
                        <button className="checkout-submit-btn" disabled={!isCheckoutReady} onClick={handleOrderSubmit}>Оплатить {finalTotal.toLocaleString()} {currency}</button>
                    </div>
                </div>
            </div>
            <OrderSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => setIsSuccessModalOpen(false)}
            />
            <OrderFailureModal isOpen={isOrderFailureModalOpen} onClose={() => setIsOrderFailureModalOpen(false)} errorMessage={orderFailureMessage} />
            <PaymentMethodModal isOpen={isPaymentModalOpen} onClose={() => setIsPaymentModalOpen(false)} selectedMethodId={selectedPaymentMethodId} onSelect={setSelectedPaymentMethodId} cards={savedCards} onDeleteCard={deleteCard} onAddCard={handleAddNewCard} />
            <ReplacementModal isOpen={isReplacementModalOpen} onClose={() => setIsReplacementModalOpen(false)} initialValue={checkoutDetails.replaceItemsAction} onSave={handleSaveReplacementAction} />
            <DeliveryPreferencesModal isOpen={isPreferencesModalOpen} onClose={() => setIsPreferencesModalOpen(false)} initialData={{ deliveryTimePreferences: checkoutDetails.deliveryTimePreferences, leaveAtDoor: checkoutDetails.leaveAtDoor }} onSave={handleSavePreferences} />
            <PromoCodeModal isOpen={isPromoModalOpen} onClose={() => setIsPromoModalOpen(false)} onApply={handleApplyPromocode} />
            <DeliveryTimeModal isOpen={isDeliveryTimeModalOpen} onClose={() => setIsDeliveryTimeModalOpen(false)} onSaveSuccess={() => fetchCart()} />
            <ConfirmationModal isOpen={isUnavailableModalOpen} onClose={() => setIsUnavailableModalOpen(false)} onConfirm={() => fetchCart()} title="Удалить недоступные товары?" text="Вы уверены?" />
            <ConfirmationModal isOpen={isClearCartModalOpen} onClose={() => setIsClearCartModalOpen(false)} onConfirm={() => { clearCart(); setIsClearCartModalOpen(false); }} title="Очистить корзину?" text="Вы уверены, что хотите
удалить корзину? Товары придется выбирать заново" />
            {isAddressModalOpen && <LocationModal onClose={() => setIsAddressModalOpen(false)} onCitySelect={() => {}} />}
        </div>
    );
};

const CartPage = () => {
    const { isAuthenticated } = useAuth();
    return (
        <Container>
            <div className="cart-page-wrapper">{isAuthenticated ? <CartContent /> : <UnauthorizedCartPlaceholder />}</div>
        </Container>
    );
};

export default CartPage;