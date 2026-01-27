import React, { useState, useEffect } from 'react';
import LocationModal from '../../../components/AddressModal/LocationModal.jsx';
import DeliveryTimeModal from '../../../pages/CartPage/DeliveryTimeModal/DeliveryTimeModal.jsx';
import PaymentMethodModal from '../../../pages/CartPage/PaymentMethodModal/PaymentMethodModal.jsx';
import ReturnOrderModal from './ReturnOrderModal.jsx';
import OrderReview from './OrderReview.jsx';
import OrderFailureModal from '../../CartPage/OrderFailureModal';
import { getOrderDetails, changeOrder } from '../../../api/services/ordersService.js';
import { useCart } from '../../../context/CartContext';


const STATUS_MAP = {
    'new': 'Не оплачен',
    'payed': 'Оформлен',
    'prepare': 'На сборке',
    'ready': 'Собран',
    'deliver': 'Доставляется',
    'need_review': 'Ожидает оценки',
    'completed': 'Завершен',
    'canceled': 'Отменен',
    'courier_cancel': 'Отменен курьером',
    'full_return': 'Полный возврат',
    'part_return': 'Частичный возврат'
};

const OrderDetails = ({ order, config, onBack }) => {
    const { setOrderApi } = useCart();

    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const [isTimeOpen, setIsTimeOpen] = useState(false);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isShowReview, setIsShowReview] = useState(false);

    const [fullOrderData, setFullOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);

    const [isOrderFailureModalOpen, setIsOrderFailureModalOpen] = useState(false);
    const [orderFailureMessage, setOrderFailureMessage] = useState('');

    const displayData = fullOrderData || order;
    const isCanceled = displayData.status === 'canceled' || displayData.status === 'Отменен';
    const isEditable = displayData.status === 'Не оплачен' && !isCanceled;

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const data = await getOrderDetails(order.id);
                const mappedData = {
                    ...data,
                    status: STATUS_MAP[data.status] || data.status
                };
                setFullOrderData(mappedData);
            } catch (error) {
                console.error("Ошибка при загрузке деталей заказа:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [order.id]);

    const handlePayment = () => {
        const orderDetails = {
            order_id: displayData.id,
            paymentMethodId: displayData.payment_method_id || null,
        };

        setOrderApi(orderDetails).catch(error => {
            const message = error?.response?.data?.message || error.message || "Произошла ошибка при оплате заказа.";
            setOrderFailureMessage(message);
            setIsOrderFailureModalOpen(true);
        });
    };


    const handleCancelOrder = async () => {
        try {
            await changeOrder(displayData.id, 'cancel');
            setIsCancelConfirmOpen(false);
            const updatedData = await getOrderDetails(order.id);
            setFullOrderData(updatedData);
            // eslint-disable-next-line no-unused-vars
        } catch (e) {
            alert("Не удалось отменить заказ");
        }
    };

    const handleReviewSubmit = async (reviewData) => {
        try {
            console.log("Отзыв отправлен:", reviewData);
            setIsShowReview(false);
        } catch (e) {
            alert("Ошибка при отправке отзыва");
        }
    };

    // const getStatusInfo = () => {
    //     if (isCanceled) return { title: 'Отменен', desc: 'Ваш заказ отменен', color: '#222222' };
    //
    //     if (displayData.return_request) {
    //         const r = displayData.return_request;
    //         if (r.status === 'pending') return { title: 'Завершен', desc: 'Ваша заявка на возврат/замену в обработке', color: '#222' };
    //         if (r.status === 'approved') return { title: 'Завершен', desc: 'Ваша заявка на возврат/замену одобрена', color: '#222' };
    //         if (r.status === 'rejected') return { title: 'Завершен', desc: 'Ваша заявка на возврат/замену отклонена', color: '#222' };
    //     }
    //
    //     return {
    //         title: displayData.status === 'payed' ? 'Оплачен' : displayData.status,
    //         desc: config.desc,
    //         color: config.color
    //     };
    // };

    const getStatusInfo = () => {
        if (isCanceled || displayData.status === 'Отменен') {
            return { title: 'Отменен', desc: 'Ваш заказ отменен', color: '#222222' };
        }

        // Обработка возвратов
        const historyStatuses = ['Завершен', 'Полный возврат', 'Частичный возврат'];
        if (historyStatuses.includes(displayData.status)) {
            return { title: displayData.status, desc: config.desc, color: '#222' };
        }

        return {
            title: displayData.status,
            desc: config.desc,
            color: config.color
        };
    };

    const statusInfo = getStatusInfo();

    const getReplacementText = (type) => {
        const types = {
            'replace_after_call': 'Позвонить и заменить',
            'replace_without_call': 'Заменить без звонка',
            'do_not_replace': 'Не заменять'
        };
        return types[type] || 'Позвонить и заменить';
    };

    const getDeliveryPrefText = (pref) => {
        const prefs = {
            'on_time': 'В указанное время',
            'as_soon_as_possible': 'Как можно быстрее'
        };
        return prefs[pref] || 'В указанное время';
    };

    const renderCardInfo = () => {
        const cardName = displayData.card?.name;
        if (!cardName) return 'Карта не привязана';

        const digitsOnly = cardName.replace(/\D/g, '');
        const lastFour = digitsOnly.slice(-4);

        const isVisa = cardName.toLowerCase().includes('visa');
        const isMastercard = cardName.toLowerCase().includes('mastercard');

        return (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isVisa && <img src="/src/assets/svg/visa.svg" alt="Visa" style={{ width: '24px', height: 'auto' }} />}
                {isMastercard && <img src="/src/assets/svg/mastercard.svg" alt="Mastercard" style={{ width: '24px', height: 'auto' }} />}
                <span>•••• {lastFour}</span>
            </div>
        );
    };

    const renderActionButtons = () => {
        const status = displayData.status;

        if (status === 'Не оплачен') {
            return (
                <>
                    <button className="btn-primary-large" onClick={handlePayment}>Оплатить заказ</button>
                    <button className="btn-outline-cancel" onClick={() => setIsCancelConfirmOpen(true)}>Отменить заказ</button>
                </>
            );
        }

        if (['На сборке', 'Собран'].includes(status)) {
            const messageCount = displayData.unread_count || 0;

            return (
                <button
                    className="btn-primary-large"
                    style={{
                        backgroundColor: '#902067',
                        position: 'relative',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px'
                    }}
                    onClick={() => {
                        const phone = displayData.manager_phone?.replace(/\D/g, '');
                        if (phone) {
                            window.open(`https://wa.me/${phone}`, '_blank');
                        }
                    }}
                >
                    В чат с менеджером

                    {messageCount > 0 && (
                        <span style={{
                            backgroundColor: '#C6D600',
                            color: '#000',
                            borderRadius: '50%',
                            padding: '2px 8px',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            minWidth: '20px',
                            textAlign: 'center'
                        }}>
                    {messageCount}
                </span>
                    )}
                </button>
            );
        }

        if (status === 'Оформлен') {
            return (
                <button className="btn-outline-cancel" onClick={() => setIsCancelConfirmOpen(true)} style={{ width: '100%' }}>
                    Отменить заказ
                </button>
            );
        }

        if (status === 'Доставляется') {
            return (
                <button
                    className="btn-primary-large"
                    onClick={() => {
                        const phone = displayData.manager_phone;
                        if (phone) {
                            window.open(`https://wa.me/${phone.replace(/\D/g, '')}`, '_blank');
                        } else {
                            console.warn("Phone number is missing");
                        }
                    }}
                >
                    Связаться с курьером
                </button>
            );
        }

        if (status === 'Ожидает оценки') {
            return (
                <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <button className="btn-outline-cancel" style={{ flex: 1, borderColor: '#902067', color: '#902067' }}
                            onClick={() => setIsReturnModalOpen(true)}>
                        Возврат/замену
                    </button>
                    <button className="btn-primary-large" style={{ flex: 1 }} onClick={() => setIsShowReview(true)}>
                        Оценить
                    </button>
                </div>
            );
        }
        return null;
    };

    if (isShowReview) {
        return <OrderReview onBack={() => setIsShowReview(false)} onSubmit={handleReviewSubmit} />;
    }

    if (loading && !fullOrderData) {
        return <div className="order-details-wrapper">Загрузка данных заказа...</div>;
    }

    return (
        <div className="order-details-wrapper">
            <div className="details-nav-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <button className="back-navigation" onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M8.53033 7.46967C8.82322 7.76256 8.82322 8.23744 8.53033 8.53033L5.81066 11.25H20.5C20.9142 11.25 21.25 11.5858 21.25 12C21.25 12.4142 20.9142 12.75 20.5 12.75H5.81066L8.53033 15.4697C8.82322 15.7626 8.82322 16.2374 8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967Z" fill="#222222"/>
                    </svg>
                </button>

                <div
                    className="receipt-link"
                    onClick={() => displayData.check_url && window.open(displayData.check_url, '_blank')}
                    style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '16px', fontWeight: '500' }}
                >
                    <span>Чек</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.252 1.25C16.6098 1.25013 16.953 1.39245 17.2061 1.64551L20.3545 4.79395C20.6076 5.04701 20.7499 5.39018 20.75 5.74805V21.4004C20.7498 22.1457 20.1457 22.7498 19.4004 22.75H4.59961C3.85433 22.7498 3.25021 22.1457 3.25 21.4004V2.59961C3.25021 1.85433 3.85434 1.25021 4.59961 1.25H16.252ZM4.75 21.25H19.25V6.75H16.5996C15.8543 6.74979 15.2502 6.14567 15.25 5.40039V2.75H4.75V21.25ZM16 17.25C16.4142 17.25 16.75 17.5858 16.75 18C16.75 18.4142 16.4142 18.75 16 18.75H8C7.58579 18.75 7.25 18.4142 7.25 18C7.25 17.5858 7.58579 17.25 8 17.25H16ZM12 13.25C12.4142 13.25 12.75 13.5858 12.75 14C12.75 14.4142 12.4142 14.75 12 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H12ZM16 9.25C16.4142 9.25 16.75 9.58579 16.75 10C16.75 10.4142 16.4142 10.75 16 10.75H8C7.58579 10.75 7.25 10.4142 7.25 10C7.25 9.58579 7.58579 9.25 8 9.25H16ZM16.75 5.25H18.6895L16.75 3.31055V5.25Z" fill="#222222"/>
                    </svg>
                </div>
            </div>

            <h2 className="detail-order-number">Заказ №{displayData.order_number}</h2>

            <div className="order-status-card-bg">
                <h2 className="card-status-text" style={{ color: statusInfo.color }}>{statusInfo.title}</h2>
                {!isCanceled && (
                    <div className="progress-bars-container">
                        {[1, 2, 3, 4, 5].map((step) => (
                            <div key={step} className={`step-bar ${step <= config.steps ? 'active' : ''}`} />
                        ))}
                    </div>
                )}
                <p className="status-info-description">{statusInfo.desc}</p>
            </div>

            <div className="detail-info-blocks">
                <div className="info-row-item">
                    <div className="label-group">
                        <span>Адрес доставки</span>
                        <strong>{displayData.address?.full_address || 'Не указан'}</strong>
                    </div>
                    {isEditable && <span className="chevron-right clickable" onClick={() => setIsLocationOpen(true)}>›</span>}
                </div>

                <div className="info-row-item">
                    <div className="label-group">
                        <span>Время доставки</span>
                        <strong>{displayData.delivery_label || 'Не указано'}</strong>
                    </div>
                    {isEditable && <span className="chevron-right clickable" onClick={() => setIsTimeOpen(true)}>›</span>}
                </div>

                <div className="info-row-item">
                    <div className="label-group">
                        <span>Способ оплаты</span>
                        <strong>{renderCardInfo()}</strong>
                    </div>
                    {isEditable && <span className="chevron-right clickable" onClick={() => setIsPaymentOpen(true)}>›</span>}
                </div>
            </div>

            <div className="order-content-section">
                <h3 className="section-subtitle">Состав заказа</h3>
                <div className="composition-list">
                    {displayData.items?.map((item, idx) => (
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
                    ))}
                </div>

                {displayData.unavailable_items?.length > 0 && (
                    <div style={{ marginTop: '24px' }}>
                        <h3 className="section-subtitle">Нет в наличии</h3>
                        <div className="composition-list">
                            {displayData.unavailable_items?.map((item, idx) => (
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
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <div className="detail-info-blocks">
                <div className="info-row-item">
                    <div className="label-group">
                        <span>Замена товаров</span>
                        <strong>{getReplacementText(displayData.replace_items)}</strong>
                    </div>
                </div>
                <div className="info-row-item">
                    <div className="label-group">
                        <span>Пожелания по доставке</span>
                        <strong>{getDeliveryPrefText(displayData.delivery_time_preferences)}</strong>
                    </div>
                </div>
            </div>

            <div className="price-calculation-block">
                <div className="calc-row">
                    <span>Сумма заказа</span>
                    <span>{displayData.items_original_total?.toLocaleString()} {displayData.currency}</span>
                </div>
                <div className="calc-row">
                    <span>Доставка</span>
                    <span>{displayData.delivery_price?.toLocaleString()} {displayData.currency}</span>
                </div>

                {displayData.total_discount > 0 && (
                    <div className="calc-row discount-row">
                        <div className="label-group">
                            <span className="calc-label">Скидка</span>
                            {displayData.promocode && <span className="calc-sublabel">По промокоду {displayData.promocode}</span>}
                        </div>
                        <span className="calc-value">-{displayData.total_discount?.toLocaleString()} {displayData.currency}</span>
                    </div>
                )}

                {displayData.bonuses_used > 0 && (
                    <div className="calc-row discount">
                        <span>Оплачено бонусами</span>
                        <span>-{displayData.bonuses_used?.toLocaleString()} {displayData.currency}</span>
                    </div>
                )}

                <div className="calc-row-total">
                    <strong>Итого</strong>
                    <div className="total-price-group">
                        {displayData.initial_total > displayData.total && (
                            <span className="old-total" style={{textDecoration: 'line-through', marginRight: '8px', color: '#999'}}>
                                {displayData.initial_total?.toLocaleString()} {displayData.currency}
                            </span>
                        )}
                        <span className="new-total">
                            {displayData.total?.toLocaleString()} {displayData.currency}
                        </span>
                    </div>
                </div>
            </div>

            <div className="details-footer-actions">
                {renderActionButtons()}
            </div>

            {/* Модалки */}
            <OrderFailureModal
                isOpen={isOrderFailureModalOpen}
                onClose={() => setIsOrderFailureModalOpen(false)}
                errorMessage={orderFailureMessage}
            />

            {isCancelConfirmOpen && (
                <div className="modal-overlay-cancel">
                    <div className="cancel-confirm-modal">
                        <span className="modal-close-icon" onClick={() => setIsCancelConfirmOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#222" strokeWidth="2" strokeLinecap="round"/></svg>
                        </span>
                        <h3 className="cancel-modal-title">Отменить заказ?</h3>
                        <p className="cancel-modal-text">Вы действительно хотите отменить заказ? В случае отмены он не сохранится</p>
                        <div className="cancel-modal-actions">
                            <button className="btn-primary-large" onClick={() => setIsCancelConfirmOpen(false)}>Нет, вернуться к оплате</button>
                            <button className="btn-outline-cancel" onClick={handleCancelOrder}>Да, отменить заказ</button>
                        </div>
                    </div>
                </div>
            )}
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