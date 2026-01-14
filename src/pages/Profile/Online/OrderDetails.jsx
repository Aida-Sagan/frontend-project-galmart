import React, { useState, useEffect } from 'react'; // Добавлен useEffect
import LocationModal from '../../../components/AddressModal/LocationModal.jsx';
import DeliveryTimeModal from '../../../pages/CartPage/DeliveryTimeModal/DeliveryTimeModal.jsx';
import PaymentMethodModal from '../../../pages/CartPage/PaymentMethodModal/PaymentMethodModal.jsx';
import ReturnOrderModal from './ReturnOrderModal.jsx';
import { getOrderDetails } from '../../../api/services/ordersService.js'; // Импорт сервиса

const OrderDetails = ({ order, config, onBack }) => {
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);

    // Новое состояние для детальных данных
    const [fullOrderData, setFullOrderData] = useState(null);
    const [loading, setLoading] = useState(true);

    const isEditable = order.status === 'Не оплачен';

    // Загрузка детальной информации по ID заказа
    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getOrderDetails(order.id);
                setFullOrderData(data);
            } catch (error) {
                console.error("Ошибка при загрузке деталей заказа:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [order.id]);

    // Объединяем данные из списка и детальные данные
    // Используем order_number, total и date из базового объекта, если детальные еще грузятся
    const displayData = fullOrderData || order;

    const renderActionButtons = () => {
        const status = displayData.status;
        if (status === 'Не оплачен') {
            return (
                <>
                    <button className="btn-primary-large">Оплатить заказ</button>
                    <button className="btn-outline-cancel">Отменить заказ</button>
                </>
            );
        }
        if (status === 'Оформлен') {
            return <button className="btn-outline-cancel">Отменить заказ</button>;
        }
        if (['На сборке', 'Собран'].includes(status)) {
            return (
                <button className="btn-primary-large chat-btn-main">
                    В чат с менеджером <span className="msg-badge">1</span>
                </button>
            );
        }
        if (status === 'Доставляется') {
            return <button className="btn-primary-large">Связаться с курьером</button>;
        }
        if (status === 'Ожидает оценки') {
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

    if (loading && !fullOrderData) {
        return <div className="order-details-wrapper">Загрузка данных заказа...</div>;
    }

    return (
        <div className="order-details-wrapper">
            <div className="details-nav-header">
                <button className="back-navigation" onClick={onBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.53033 7.46967C8.82322 7.76256 8.82322 8.23744 8.53033 8.53033L5.81066 11.25H20.5C20.9142 11.25 21.25 11.5858 21.25 12C21.25 12.4142 20.9142 12.75 20.5 12.75H5.81066L8.53033 15.4697C8.82322 15.7626 8.82322 16.2374 8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967Z" fill="#222222"/>
                    </svg>
                    Вернуться к заказам
                </button>
                {(displayData.status === 'Собран' || displayData.status === 'Доставляется' || displayData.isHistory) && (
                    <div className="receipt-link-top">Чек <span className="receipt-icon">
                         <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M16.252 1.25C16.6098 1.25013 16.953 1.39245 17.2061 1.64551L20.3545 4.79395C20.6076 5.04701 20.7499 5.39018 20.75 5.74805V21.4004C20.7498 22.1457 20.1457 22.7498 19.4004 22.75H4.59961C3.85433 22.7498 3.25021 22.1457 3.25 21.4004V2.59961C3.25021 1.85433 3.85434 1.25021 4.59961 1.25H16.252ZM4.75 21.25H19.25V6.75H16.5996C15.8543 6.74979 15.2502 6.14567 15.25 5.40039V2.75H4.75V21.25ZM16 17.25C16.4142 17.25 16.75 17.5858 16.75 18C16.75 18.4142 16.4142 18.75 16 18.75H8C7.58579 18.75 7.25 18.4142 7.25 18C7.25 17.5858 7.58579 17.25 8 17.25H16ZM12 13.25C12.4142 13.25 12.75 13.5858 12.75 14C12.75 14.4142 12.4142 14.75 12 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H12ZM16 9.25C16.4142 9.25 16.75 9.58579 16.75 10C16.75 10.4142 16.4142 10.75 16 10.75H8C7.58579 10.75 7.25 10.4142 7.25 10C7.25 9.58579 7.58579 9.25 8 9.25H16ZM16.75 5.25H18.6895L16.75 3.31055V5.25Z" fill="#222222"/>
                        </svg>
                    </span></div>
                )}
            </div>

            <h2 className="detail-order-number">Заказ №{displayData.order_number || displayData.number}</h2>

            <div className="order-status-card-bg">
                <h2 className="card-status-text" style={{ color: config.color }}>{displayData.status}</h2>
                <div className="progress-bars-container">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div key={step} className={`step-bar ${step <= config.steps ? 'active' : ''}`} />
                    ))}
                </div>
                <p className="card-description">{config.desc}</p>
            </div>

            <div className="detail-info-blocks">
                <div className="info-row-item">
                    <div className="label-group">
                        <span>Адрес доставки</span>
                        <strong>{displayData.address?.full_address || displayData.address || 'Загрузка...'}</strong>
                    </div>
                    {isEditable && (
                        <span className="chevron-right clickable" onClick={() => setIsLocationOpen(true)}>›</span>
                    )}
                </div>
                <div className="info-row-item">
                    <div className="label-group">
                        <span>Время доставки</span>
                        <strong>{displayData.date || displayData.deliveryTime}</strong>
                    </div>
                    {isEditable && (
                        <span className="chevron-right clickable" onClick={() => setIsTimeOpen(true)}>›</span>
                    )}
                </div>
                <div className="info-row-item">
                    <div className="label-group">
                        <span>Способ оплаты</span>
                        <strong>{displayData.card?.name || '•••• 0000'}</strong>
                    </div>
                    {isEditable && (
                        <span className="chevron-right clickable" onClick={() => setIsPaymentOpen(true)}>›</span>
                    )}
                </div>
            </div>

            {/* Состав заказа (верстка не меняется, данные берутся из fullOrderData если есть) */}
            <div className="order-content-section">
                <h3 className="section-subtitle">Состав заказа</h3>
                <div className="composition-list">
                    {fullOrderData?.items?.map((item, idx) => (
                        <div className="product-item" key={idx}>
                            <div className="prod-img">
                                <img src={item.photos?.[0]} alt="" style={{width: '100%', borderRadius: '8px'}} />
                            </div>
                            <div className="prod-info">
                                <p className="prod-name">{item.title}</p>
                                <div className="prod-weight-group">
                                    <span className="weight-current">{item.quantity}</span>
                                </div>
                                <div className="prod-price">{item.total_price} {displayData.currency}</div>
                            </div>
                        </div>
                    )) || <p>Загрузка товаров...</p>}
                </div>
            </div>

            <div className="price-calculation-block">
                <div className="calc-row">
                    <span>Сумма заказа</span>
                    <span>{displayData.items_price?.toLocaleString() || displayData.total?.toLocaleString()} {displayData.currency}</span>
                </div>
                <div className="calc-row">
                    <span>Доставка</span>
                    <span>{displayData.delivery_price?.toLocaleString() || '0'} {displayData.currency}</span>
                </div>

                {displayData.applied_promocode?.discountAmount > 0 && (
                    <div className="calc-row discount-row">
                        <div className="label-group">
                            <span className="calc-label">Скидка</span>
                            <span className="calc-sublabel">По промокоду {displayData.applied_promocode.code}</span>
                        </div>
                        <span className="calc-value">-{displayData.applied_promocode.discountAmount.toLocaleString()} {displayData.currency}</span>
                    </div>
                )}

                {displayData.bonuses?.spent > 0 && (
                    <div className="calc-row discount">
                        <span>Оплачено бонусами</span>
                        <span>-{displayData.bonuses.spent.toLocaleString()} {displayData.currency}</span>
                    </div>
                )}

                <div className="calc-row-total">
                    <strong>Итого</strong>
                    <div className="total-price-group">
                        <span className="new-total">
                            {displayData.total?.toLocaleString()} {displayData.currency}
                        </span>
                    </div>
                </div>
            </div>

            <div className="details-footer-actions">
                {renderActionButtons()}
            </div>

            {isLocationOpen && <LocationModal onClose={() => setIsLocationOpen(false)} />}
            {isTimeOpen && <DeliveryTimeModal onClose={() => setIsTimeOpen(false)} />}
            {isPaymentOpen && <PaymentMethodModal onClose={() => setIsPaymentOpen(false)} />}
            {isReturnModalOpen && (
                <ReturnOrderModal
                    orderNumber={displayData.order_number}
                    items={displayData.items}
                    onClose={() => setIsReturnModalOpen(false)}
                />
            )}
        </div>
    );
};

export default OrderDetails;