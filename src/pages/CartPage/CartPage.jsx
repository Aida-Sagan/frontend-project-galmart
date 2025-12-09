import React, { useState, useMemo, useEffect } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useLocation } from '../../context/LocationContext';
import { Link } from 'react-router-dom';
import { deleteCart as deleteCartService, setPromocode,getSavedCards, deleteSavedCard } from '../../api/services/cartService';

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
            <div className="modal-content modal-content-confirm" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>{title}</h2>
                <p>{text}</p>
                <div className="modal-actions">
                    <button className="modal-btn secondary" onClick={onConfirm}>
                        Очистить корзину</button>
                    <button className="modal-btn primary" onClick={onClose}>Отмена</button>
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
    const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);
    const [isPreferencesModalOpen, setIsPreferencesModalOpen] = useState(false);
    const [isReplacementModalOpen, setIsReplacementModalOpen] = useState(false);
    const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
    const [savedCards, setSavedCards] = useState([]);
    const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState('apple_pay');
    const [isOrderFailureModalOpen, setIsOrderFailureModalOpen] = useState(false);
    const [orderFailureMessage, setOrderFailureMessage] = useState('');

    useEffect(() => {
        if (city) {
            fetchCart();
        }
    }, [city, selectedAddress, fetchCart]);

    const itemsPrice = cartData?.items_price || 0;
    const deliveryCost = cartData?.delivery_price || 0;
    const freeDeliveryThreshold = cartData?.free_delivery || 10000;

    const bonusesBalance = cartData?.bonuses?.balance || 0;
    const currency = cartData?.currency || '₸';


    // Новые переменные для сумм
    const discount = cartData?.applied_promocode?.amount || 0;
    const promoCodeName = cartData?.applied_promocode?.code;
    const bonusesSpent = cartData?.bonuses?.spent || 0; // Предполагаем, что бэкенд возвращает spent
    const oldTotal = cartData?.old_total || 0;
    const finalTotal = cartData?.total || (itemsPrice + deliveryCost - discount - bonusesSpent);


    const handleApplyPromocode = async (code) => {
        // eslint-disable-next-line no-useless-catch
        try {
            await setPromocode(code);
            await fetchCart();
        } catch (error) {
            throw error;
        }
    };

    const handleSaveReplacementAction = (actionText) => {
        setCheckoutDetails(prev => ({
            ...prev,
            replaceItemsAction: actionText
        }));
    };


    const addressString =
        selectedAddress?.full_address ||
        selectedAddress?.base_address ||
        selectedAddress?.address ||
        cartData?.address?.full_address ||
        cartData?.address_string ||
        city?.name;

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


    const deliveryProgress = freeDeliveryThreshold > 0
        ? Math.min((itemsPrice / freeDeliveryThreshold) * 100, 100)
        : 100;

    const hasOutOfStockItems = items?.some(item => item.out_of_stock) || false;

    const isCheckoutReady = useMemo(() => {
        const hasAddress = !!(selectedAddress || cartData?.address);
        const hasCard = true;
        const hasProducts = items?.length > 0;
        return hasAddress && hasCard && checkoutDetails.acceptPriceChanges && hasProducts;
    }, [checkoutDetails, selectedAddress, cartData, items?.length]);

    const deliveryTimeRaw = cartData?.delivery_time;
    let displayDeliveryTime = null;

    if (deliveryTimeRaw) {
        if (typeof deliveryTimeRaw === 'string') {
            displayDeliveryTime = deliveryTimeRaw;
        } else if (typeof deliveryTimeRaw === 'object') {
            displayDeliveryTime = deliveryTimeRaw.time || deliveryTimeRaw.title || "Время выбрано";
        }
    }

    const handleSavePreferences = (newPrefs) => {
        setCheckoutDetails(prev => ({
            ...prev,
            deliveryTimePreferences: newPrefs.deliveryTimePreferences,
            leaveAtDoor: newPrefs.leaveAtDoor
        }));
    };

    const getPreferencesText = () => {
        const timeText = checkoutDetails.deliveryTimePreferences === 'on_time'
            ? 'В указанное время'
            : 'По возможности раньше';

        if (checkoutDetails.leaveAtDoor) {
            return `${timeText}, оставить у двери`;
        }
        return timeText;
    };

    const handleTimeSaveSuccess = () => {
        fetchCart();
    };

    useEffect(() => {
        const fetchCards = async () => {

            try {
                const cards = await getSavedCards();
                setSavedCards(cards || []);
            } catch (e) {
                console.error("Failed to load cards", e);
            }
        };
        fetchCards();
    }, []);

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

        setOrderApi(orderDetails)
            .then(data => {
                console.log("Заказ успешно создан:", data);
            })
            .catch(error => {
                console.error("Ошибка при создании заказа:", error);

                let message = "Произошла ошибка при оплате заказа. Пожалуйста, попробуйте снова.";

                if (error && error.response && error.response.data && error.response.data.message) {
                    message = error.response.data.message;
                } else if (error instanceof Error) {
                    message = error.message;
                }

                setOrderFailureMessage(message);
                setIsOrderFailureModalOpen(true);
            });
    };

    const handleModalClose = () => {
        setIsAddressModalOpen(false);

        fetchCart();
    };

    const handleDeleteCard = async (cardId) => {
        try {
            await deleteSavedCard(cardId);

            const updatedCards = await getSavedCards();
            setSavedCards(updatedCards || []);

            if (selectedPaymentMethodId === cardId) {
                setSelectedPaymentMethodId('apple_pay');
            }
        } catch (error) {
            console.error("Failed to delete card", error);
            alert("Не удалось удалить карту");
        }
    };


    const handleAddNewCard = () => {
        console.log("Redirect to add card flow");
        // Implement redirection logic here (e.g., navigate('/profile/cards/add'))
    };


    const getSelectedMethodName = () => {
        if (selectedPaymentMethodId === 'apple_pay') return 'Apple Pay';
        if (selectedPaymentMethodId === 'kaspi') return 'Kaspi.kz';

        const card = savedCards.find(c => c.id === selectedPaymentMethodId);
        if (card) {
            const last4 = card.pan || card.mask || card.number?.slice(-4) || '****';
            return `.... ${last4} ${card.type || ''}`;
        }

        return 'Выбрать способ оплаты';
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

                    <div className="checkout-widget clickable-widget">
                        <div
                            className="widget-row"
                            onClick={() => setIsReplacementModalOpen(true)}
                        >
                            <div className="widget-info">
                                <span className="widget-info-text">Замена товаров</span>
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
                        <div
                            className="widget-row"
                            onClick={() => setIsPreferencesModalOpen(true)}
                        >
                            <div className="widget-info">
                                <span className="widget-info-text ">Пожелания по доставке</span>
                                <span className="sub-label">{getPreferencesText()}</span>
                            </div>
                            <ChevronRight />
                        </div>
                    </div>

                    {/* 5. Payment Block */}
                    <div className="checkout-widget">
                        <div className="widget-header">
                            <h3>Способ оплаты</h3>
                        </div>
                        <div
                            className="widget-row clickable-row border-bottom"
                            onClick={() => setIsPaymentModalOpen(true)}
                        >
                            <div className="widget-info">
                                <span className="label">Способ оплаты</span>
                                <span className="value">
                                {getSelectedMethodName()}
                                    {savedCards.some(c => c.id === selectedPaymentMethodId) && (
                                        <span style={{border:'1px solid #ccc', padding:'0 4px', borderRadius:'4px', fontSize:'10px', marginLeft: '5px'}}>
                                         CARD
                                     </span>
                                    )}
                            </span>
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
                        <div
                            className="widget-row clickable-row"
                            onClick={() => setIsPromoModalOpen(true)}
                        >
                            <div className="widget-info">
                                <span className="label">Промокод</span>
                                {cartData?.applied_promocode?.code ? (
                                    <span className="sub-label" style={{color: '#902067'}}>
                                        {cartData.applied_promocode.code} (Применен)
                                    </span>
                                ) : (
                                    <span className="sub-label">Введите промокод</span>
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

                        {/* Отображаем Скидку */}
                        {discount > 0 && (
                            <div className="summary-row discount-row">
                                <span>Скидка</span>
                                {promoCodeName && <span className="promo-name">По промокоду {promoCodeName}</span>}
                                <span>-{discount.toLocaleString()} {currency}</span>
                            </div>
                        )}

                        {/* Отображаем Оплачено бонусами */}
                        {bonusesSpent > 0 && (
                            <div className="summary-row bonus-spent-row">
                                <span>Оплачено бонусами</span>
                                <span>-{bonusesSpent.toLocaleString()} {currency}</span>
                            </div>
                        )}


                        <div className="summary-total-row">
                            <span>Итого</span>
                            <span className="final-total-value">
                                {/* Отображение старой цены */}
                                {oldTotal > finalTotal && oldTotal > 0 && (
                                    <span className="old-total-price">
                                        {oldTotal.toLocaleString()} {currency} &rarr;
                                    </span>
                                )}
                                {finalTotal.toLocaleString()} {currency}
                            </span>
                        </div>


                        <label className="legal-checkbox">
                            <input
                                type="checkbox"
                                checked={checkoutDetails.acceptPriceChanges}
                                onChange={(e) => setCheckoutDetails({...checkoutDetails, acceptPriceChanges: e.target.checked})}
                            />
                            <span className="checkmark"></span>
                            <span className="legal-text-cart">
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

            <OrderFailureModal
                isOpen={isOrderFailureModalOpen}
                onClose={() => setIsOrderFailureModalOpen(false)}
                onGoToOrders={() => {
                    setIsOrderFailureModalOpen(false);
                }}
                errorMessage={orderFailureMessage}
            />


            <PaymentMethodModal
                isOpen={isPaymentModalOpen}
                onClose={() => setIsPaymentModalOpen(false)}
                selectedMethodId={selectedPaymentMethodId}
                onSelect={setSelectedPaymentMethodId}

                cards={savedCards}
                onDeleteCard={handleDeleteCard}
                onAddCard={handleAddNewCard}
            />
            <ReplacementModal
                isOpen={isReplacementModalOpen}
                onClose={() => setIsReplacementModalOpen(false)}
                initialValue={checkoutDetails.replaceItemsAction}
                onSave={handleSaveReplacementAction}
            />

            <DeliveryPreferencesModal
                isOpen={isPreferencesModalOpen}
                onClose={() => setIsPreferencesModalOpen(false)}
                initialData={{
                    deliveryTimePreferences: checkoutDetails.deliveryTimePreferences,
                    leaveAtDoor: checkoutDetails.leaveAtDoor
                }}
                onSave={handleSavePreferences}
            />

            <PromoCodeModal
                isOpen={isPromoModalOpen}
                onClose={() => setIsPromoModalOpen(false)}
                onApply={handleApplyPromocode}
            />

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