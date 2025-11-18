import React, { useState } from 'react';
import ArrowLink from './ArrowLink';
import TotalSummary from './TotalSummary';
import { useCart } from '../../context/CartContext';
import './styles/CheckoutSection.css';

const CheckoutSection = ({ bonuses = 30850 }) => {
    const { cartData, setOrderApi } = useCart();

    const [comment, setComment] = useState('');
    const [checkboxChecked, setCheckboxChecked] = useState(false);
    const [replaceAction, setReplaceAction] = useState('Позвонить и заменить');

    const orderTotal = cartData?.total_price_incl_discount || 0;
    const deliveryCost = cartData?.delivery_price || 1000;
    const minOrderForFreeDelivery = cartData?.min_price_for_free_delivery || 1389;
    const finalTotal = orderTotal + deliveryCost;

    const deliveryAddress = cartData?.address_string || "улица Мангилик Ел, 60, кв 25, под. 2, эт. 3";
    const deliveryTime = cartData?.delivery_time || null;
    const paymentMethod = "Картой онлайн"; // Заглушка, должен быть из состояния/контекста

    const isCheckoutReady = deliveryTime !== null && paymentMethod !== null && checkboxChecked;

    const handleNavigation = (detailType) => {
        console.log(`Открытие модального окна для: ${detailType}`);
        // Здесь должна быть логика вызова setDeliveryTimeApi или других API
    };

    const handleOrderSubmit = () => {
        if (!isCheckoutReady) return;

        const orderDetails = {
            bonuses: 0,
            comment: comment,
            replaceItemsAction: replaceAction,
            // Другие детали заказа
        };

        setOrderApi(orderDetails)
            .then(data => {
                console.log("Заказ успешно создан:", data);
            })
            .catch(error => {
                console.error("Ошибка при создании заказа:", error);
            });
    };

    const progress = Math.min(100, (orderTotal / minOrderForFreeDelivery) * 100);

    if (!cartData) {
        return <div className="checkout-section-container loading-state">Загрузка данных...</div>;
    }

    return (
        <div className="checkout-section-container">
            <div className="checkout-block delivery-block">
                <div className="delivery-info">
                    <h3 className="montserrat-font">Доставка {deliveryCost.toLocaleString('ru-RU')} ₸</h3>
                    <div className="free-delivery-progress">
                        До бесплатной доставки {minOrderForFreeDelivery.toLocaleString('ru-RU')} ₸
                        <div className="progress-bar-bg">
                            <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="address-block">
                    <h3 className="montserrat-font">Адрес доставки</h3>
                    <p className="montserrat-font">{deliveryAddress}</p>
                    <ArrowLink onClick={() => handleNavigation('address')} />
                </div>

                <ArrowLink
                    title="Время доставки"
                    subtitle={deliveryTime ? deliveryTime : <span className="error-text montserrat-font">Время доставки не указано</span>}
                    onClick={() => handleNavigation('time')}
                    disabled={!deliveryAddress}
                />
            </div>

            <div className="checkout-block preference-block">
                <div className="replacement-block">
                    <ArrowLink
                        title="Замена товаров"
                        subtitle={replaceAction}
                        onClick={() => handleNavigation('replacement')}
                    />
                    <input
                        type="text"
                        placeholder="Напишите, если что-то не нашли"
                        className="replacement-comment montserrat-font"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                </div>

                <ArrowLink
                    title="Пожелания по доставке"
                    subtitle="В указанное время"
                    onClick={() => handleNavigation('deliveryPreferences')}
                />
            </div>

            <div className="checkout-block payment-block">
                <h3 className="montserrat-font">Способ оплаты</h3>
                <ArrowLink
                    title="Выберите способ оплаты"
                    subtitle={paymentMethod || "Не выбран"}
                    onClick={() => handleNavigation('paymentMethod')}
                />

                <div className="bonuses-toggle">
                    <h3 className="montserrat-font">Списать бонусы</h3>
                    <p className="montserrat-font">Накоплено {bonuses.toLocaleString('ru-RU')} бонусов</p>
                    <label className="switch">
                        <input type="checkbox" />
                        <span className="slider round"></span>
                    </label>
                </div>

                <ArrowLink title="Промокод" subtitle="Не использован" onClick={() => handleNavigation('promo')} />
            </div>

            <TotalSummary
                orderTotal={orderTotal}
                deliveryCost={deliveryCost}
                finalTotal={finalTotal}
                onCheckboxChange={() => setCheckboxChecked(prev => !prev)}
                isReady={isCheckoutReady}
                onSubmit={handleOrderSubmit}
            />
        </div>
    );
};

export default CheckoutSection;