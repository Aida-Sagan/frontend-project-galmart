import React, { useState } from 'react';
import LocationModal from '../../../components/AddressModal/LocationModal.jsx';
import DeliveryTimeModal from '../../../pages/CartPage/DeliveryTimeModal/DeliveryTimeModal.jsx';
import PaymentMethodModal from '../../../pages/CartPage/PaymentMethodModal/PaymentMethodModal.jsx';
import ReturnOrderModal from './ReturnOrderModal.jsx';


const OrderDetails = ({ order, config, onBack }) => {
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);


    const isEditable = order.status === 'Не оплачен';

    const orderBlock = order || {
        number: '01100018957',
        status: 'Не оплачен',
        address: 'улица Мангилик Ел, 60, кв 25, под. 2, эт. 3',
        deliveryTime: '3 сентября, 18:00 - 20:00',
        totalAmount: 12037,
        deliveryFee: 1000,
        promoCode: 'QWERTY',
        discountAmount: 1000,
        bonusesUsed: 1000,
        finalPrice: 8037
    };

    const renderActionButtons = () => {
        if (order.status === 'Не оплачен') {
            return (
                <>
                    <button className="btn-primary-large">Оплатить заказ</button>
                    <button className="btn-outline-cancel">Отменить заказ</button>
                </>
            );
        }
        if (order.status === 'Оформлен') {
            return <button className="btn-outline-cancel">Отменить заказ</button>;
        }
        if (['На сборке', 'Собран'].includes(order.status)) {
            return (
                <button className="btn-primary-large chat-btn-main">
                    В чат с менеджером <span className="msg-badge">12</span>
                </button>
            );
        }
        if (order.status === 'Доставляется') {
            return <button className="btn-primary-large">Связаться с курьером</button>;
        }
        if (order.status === 'Ожидает оценки') {
            return (
                <>
                    <button
                        className="btn-primary-large"
                        onClick={() => setIsReturnModalOpen(true)}
                    >
                        Оформить возврат/замену
                    </button>
                    <button className="btn-outline-cancel">Оценить заказ</button>
                </>
            );
        }
        return null;
    };

    return (
        <div className="order-details-wrapper">
            {/* Навигация и Чек */}
            <div className="details-nav-header">
                <button className="back-navigation" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.53033 7.46967C8.82322 7.76256 8.82322 8.23744 8.53033 8.53033L5.81066 11.25H20.5C20.9142 11.25 21.25 11.5858 21.25 12C21.25 12.4142 20.9142 12.75 20.5 12.75H5.81066L8.53033 15.4697C8.82322 15.7626 8.82322 16.2374 8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967Z" fill="#222222"/>
                    </svg>
                    Вернуться к заказам
                </button>
                {(order.status === 'Собран' || order.status === 'Доставляется' || order.isHistory) && (
                    <div className="receipt-link-top">Чек <span className="receipt-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.252 1.25C16.6098 1.25013 16.953 1.39245 17.2061 1.64551L20.3545 4.79395C20.6076 5.04701 20.7499 5.39018 20.75 5.74805V21.4004C20.7498 22.1457 20.1457 22.7498 19.4004 22.75H4.59961C3.85433 22.7498 3.25021 22.1457 3.25 21.4004V2.59961C3.25021 1.85433 3.85434 1.25021 4.59961 1.25H16.252ZM4.75 21.25H19.25V6.75H16.5996C15.8543 6.74979 15.2502 6.14567 15.25 5.40039V2.75H4.75V21.25ZM16 17.25C16.4142 17.25 16.75 17.5858 16.75 18C16.75 18.4142 16.4142 18.75 16 18.75H8C7.58579 18.75 7.25 18.4142 7.25 18C7.25 17.5858 7.58579 17.25 8 17.25H16ZM12 13.25C12.4142 13.25 12.75 13.5858 12.75 14C12.75 14.4142 12.4142 14.75 12 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H12ZM16 9.25C16.4142 9.25 16.75 9.58579 16.75 10C16.75 10.4142 16.4142 10.75 16 10.75H8C7.58579 10.75 7.25 10.4142 7.25 10C7.25 9.58579 7.58579 9.25 8 9.25H16ZM16.75 5.25H18.6895L16.75 3.31055V5.25Z" fill="#222222"/>
                        </svg>
                    </span></div>
                )}
            </div>

            <h2 className="detail-order-number">Заказ №{order.number}</h2>

            {/* Статус-карточка */}
            <div className="order-status-card-bg">
                <h2 className="card-status-text" style={{ color: config.color }}>{order.status}</h2>
                {order.returnStatus === 'approved' && (
                    <p className="return-status-msg">Ваша заявка на возврат/замену одобрена</p>
                )}
                {order.returnStatus === 'rejected' && (
                    <p className="return-status-msg rejected">Ваша заявка на возврат/замену отклонена</p>
                )}
                <div className="progress-bars-container">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className={`step-bar ${step <= config.steps ? 'active' : ''}`} />
                    ))}
                </div>
                <p className="card-description">{config.desc}</p>
            </div>

            {/* Инфо-блоки */}
            <div className="detail-info-blocks">
                <div className="info-row-item">
                    <div className="label-group"><span>Адрес доставки</span><strong>{order.address || 'улица Мангилик Ел, 60...'}</strong></div>
                    {isEditable && (
                        <span className="chevron-right clickable" onClick={() => setIsLocationOpen(true)}>›</span>
                    )}
                </div>
                <div className="info-row-item">
                    <div className="label-group"><span>Время доставки</span><strong>{order.deliveryTime || '3 сентября, 18:00 - 20:00'}</strong></div>
                    {isEditable && (
                        <span className="chevron-right clickable" onClick={() => setIsTimeOpen(true)}>›</span>
                    )}
                </div>
                <div className="info-row-item">
                    <div className="label-group"><span>Способ оплаты</span><strong>•••• 2636 <span className="visa-badge">VISA</span></strong></div>
                    {isEditable && (
                        <span className="chevron-right clickable" onClick={() => setIsPaymentOpen(true)}>›</span>
                    )}
                </div>
            </div>

            {/* Состав заказа */}
            <div className="order-content-section">
                <h3 className="section-subtitle">Состав заказа</h3>
                <div className="composition-list">
                    <div className="product-item">
                        <div className="prod-img">🍎</div>
                        <div className="prod-info">
                            <p className="prod-name">Абрикосы, вес</p>
                            <div className="prod-weight-group">
                                <span className="weight-old">0,5 кг</span>
                                <span className="weight-arrow">
                                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                                        <path d="M11.9773 5.60225L15.7727 9L12.7727 12.3977M3 9.5625H14.017" stroke="#222" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </span>
                                <span className="weight-current">0,57 кг</span>
                            </div>
                            <div className="prod-price">2 600 ₸</div>
                        </div>
                    </div>
                </div>

                <h3 className="section-subtitle">Акционные товары</h3>
                <div className="product-item promo">
                    <div className="prod-img">🍎</div>
                    <div className="prod-info">
                        <p className="prod-name">Абрикосы, вес</p>
                        <div className="prod-weight-group">
                            <span className="weight-old">0,5 кг</span>
                            <span className="weight-arrow">→</span>
                            <span className="weight-current">0,57 кг</span>
                        </div>
                        <div className="prod-price-group">
                            <span className="price-old">240 ₸</span>
                            <span className="price-arrow">→</span>
                            <span className="price-current">1 ₸</span>
                        </div>
                    </div>
                </div>

                {['Собран', 'Доставляется', 'Завершен'].includes(order.status) && (
                    <>
                        <h3 className="section-subtitle">Нет в наличии</h3>
                        <div className="product-item disabled">
                            <div className="prod-img grey">📦</div>
                            <div className="prod-info">
                                <p className="prod-name">Абрикосы, вес</p>
                                <span className="prod-weight">0,57 кг</span>
                                <div className="prod-price">1 ₸</div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Финансовый блок */}
            <div className="price-calculation-block">
                <div className="calc-row">
                    <span>Сумма заказа</span>
                    <span>{orderBlock.totalAmount?.toLocaleString()} ₸</span>
                </div>
                <div className="calc-row">
                    <span>Доставка</span>
                    <span>{orderBlock.deliveryFee?.toLocaleString()} ₸</span>
                </div>

                {order.discountAmount > 0 && (
                    <div className="calc-row discount-row">
                        <div className="label-group">
                            <span className="calc-label">Скидка</span>
                            {orderBlock.promoCode && (
                                <span className="calc-sublabel">По промокоду {orderBlock.promoCode}</span>
                            )}
                        </div>
                        <span className="calc-value">-{orderBlock.discountAmount?.toLocaleString()} ₸</span>
                    </div>
                )}

                {orderBlock.bonusesUsed > 0 && (
                    <div className="calc-row discount">
                        <span>Оплачено бонусами</span>
                        <span>-{orderBlock.bonusesUsed?.toLocaleString()} ₸</span>
                    </div>
                )}
                <div className="calc-row-total">
                    <strong>Итого</strong>
                    <div className="total-price-group">
                        <span className="old-total">
                            {(orderBlock.totalAmount + orderBlock.deliveryFee)?.toLocaleString()} ₸
                        </span>
                        <span className="new-total">
                            {orderBlock.finalPrice?.toLocaleString()} ₸
                        </span>
                    </div>
                </div>
            </div>

            <div className="details-footer-actions">
                {renderActionButtons()}
            </div>

            {/* Модальные окна */}
            {isLocationOpen && <LocationModal onClose={() => setIsLocationOpen(false)} />}
            {isTimeOpen && <DeliveryTimeModal onClose={() => setIsTimeOpen(false)} />}
            {isPaymentOpen && <PaymentMethodModal onClose={() => setIsPaymentOpen(false)} />}
            {isReturnModalOpen && (
                <ReturnOrderModal
                    orderNumber={orderBlock.number}
                    items={orderBlock.items}
                    onClose={() => setIsReturnModalOpen(false)}
                />
            )}
        </div>
    );
};

export default OrderDetails;