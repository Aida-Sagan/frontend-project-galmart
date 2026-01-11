import React, { useState } from 'react';
import './styles/OnlineOrders.css';
import OrderDetails from './OrderDetails';
import apricotImg from '../../../assets/items/fruits_png.png';

const OnlineOrdersList = () => {
    const [view, setView] = useState('list');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statusConfig = {

        'Не оплачен': { steps: 0, color: '#902067', desc: 'Для оформления заказа необходимо произвести оплату', action: 'Оплатить заказ' },
        'Оформлен': {
            steps: 1,
            color: '#902067',
            variants: {
                selfEdit: {
                    desc: 'Что-то забыли? Вы можете дополнить заказ, пока он не передан на сборку',
                    action: 'Дополнить заказ'
                },
                viaManager: {
                    desc: 'Вы можете добавить что-то к заказу, написав менеджеру',
                    action: 'В чат с менеджером'
                }
            }
        },
        'На сборке': { steps: 2, color: '#902067', desc: 'Вы можете добавить что-то к заказу, написав менеджеру', action: 'В чат с менеджером' },
        'Собран': { steps: 3, color: '#902067', desc: 'Ваш заказ собран, скоро передадим курьеру', action: 'В чат с менеджером' },
        'Доставляется': { steps: 4, color: '#902067', desc: 'Ваш заказ привезёт Мираз', action: 'Связаться с курьером' },
        'Ожидает оценки': { steps: 5, color: '#902067', desc: 'Ваш заказ доставлен. Пожалуйста, оцените нашу работу', action: 'Оценить работу' },

        // ИСТОРИЯ
        'Завершен': { steps: 5, color: '#222', desc: 'Ваш заказ завершен', action: 'Подробнее о заказе' },
        'Отменен': { steps: 0, color: '#222', desc: 'Ваш заказ отменен', action: 'Подробнее о заказе' },
        'Отменен курьером': { steps: 0, color: '#222', desc: 'Ваш заказ отменен курьером', action: 'Подробнее о заказе' },
        'Полный возврат': { steps: 0, color: '#222', desc: 'По вашему заказу произведен полный возврат', action: 'Подробнее о заказе' },
        'Частичный возврат': { steps: 0, color: '#222', desc: 'По вашему заказу произведен частичный возврат', action: 'Подробнее о заказе' }
    };

    const mockOrders = [
        { id: 1, number: '01100018957', total: 18048, bonuses: 180, status: 'Не оплачен', isHistory: false },
        // Вариант Оформлен №1 (самостоятельно)
        { id: 2, number: '01100018958', total: 18048, bonuses: 180, status: 'Оформлен', isHistory: false, canEditSelf: true },
        // Вариант Оформлен №2 (через менеджера)
        { id: 12, number: '01100018959', total: 18048, bonuses: 180, status: 'Оформлен', isHistory: false, canEditSelf: false },
        { id: 3, number: '01100018960', total: 18048, bonuses: 180, status: 'На сборке', isHistory: false },
        { id: 4, number: '01100018961', total: 18048, bonuses: 180, status: 'Собран', isHistory: false },
        { id: 5, number: '01100018962', total: 18048, bonuses: 180, status: 'Доставляется', isHistory: false },
        { id: 6, number: '01100018963', total: 18048, bonuses: 180, status: 'Ожидает оценки', isHistory: false },
        { id: 7, number: '01100018964', total: 18048, bonuses: 180, status: 'Завершен', isHistory: true },
        { id: 8, number: '01100018965', total: 18048, bonuses: 180, status: 'Отменен', isHistory: true },
        { id: 9, number: '01100018966', total: 18048, bonuses: 180, status: 'Отменен курьером', isHistory: true },
        { id: 10, number: '01100018967', total: 18048, bonuses: 180, status: 'Полный возврат', isHistory: true },
        { id: 11, number: '01100018968', total: 18048, bonuses: 180, status: 'Частичный возврат', isHistory: true }
    ];

    const currentOrders = mockOrders.filter(o => !o.isHistory);
    const historyOrders = mockOrders.filter(o => o.isHistory);

    const handleOrderClick = (order) => {
        let finalConfig = statusConfig[order.status];
        if (order.status === 'Оформлен') {
            const variant = order.canEditSelf ? finalConfig.variants.selfEdit : finalConfig.variants.viaManager;
            finalConfig = { ...finalConfig, ...variant };
        }

        setSelectedOrder(order);
        setView('details');
    };

    if (view === 'details' && selectedOrder) {
        let currentConfig = statusConfig[selectedOrder.status];
        if (selectedOrder.status === 'Оформлен') {
            const variant = selectedOrder.canEditSelf ? currentConfig.variants.selfEdit : currentConfig.variants.viaManager;
            currentConfig = { ...currentConfig, ...variant };
        }
        return <OrderDetails order={selectedOrder} config={currentConfig} onBack={() => setView('list')} />;
    }

    if (mockOrders.length === 0) {
        return <div className="empty-state-full">Пока у вас нет заказов</div>;
    }

    return (
        <div className="online-orders-container">
            {currentOrders.length > 0 && (
                <>
                    <h2 className="main-section-title">Мои онлайн заказы</h2>
                    {currentOrders.map(order => renderOrderCard(order, statusConfig, handleOrderClick))}
                </>
            )}

            {historyOrders.length > 0 && (
                <>
                    <h2 className="main-section-title mt-40">История заказов</h2>
                    {historyOrders.map(order => renderOrderCard(order, statusConfig, handleOrderClick, true))}
                </>
            )}
        </div>
    );
};

const renderOrderCard = (order, statusConfig, onOrderClick, isHistory = false) => {
    let config = statusConfig[order.status];

    // Логика выбора трактовки для "Оформлен"
    if (order.status === 'Оформлен') {
        const variant = order.canEditSelf ? config.variants.selfEdit : config.variants.viaManager;
        config = { ...config, ...variant };
    }

    return (
        <div key={order.id} className={`order-card-v2 ${isHistory ? 'history-card' : ''}`} onClick={() => onOrderClick(order)}>
            <div className="card-row">
                <span className="order-id">Заказ №{order.number}</span>
                <span className="order-price-top">{order.total.toLocaleString()} ₸</span>
            </div>

            <div className="card-row align-center">
                <button className="status-action-btn" onClick={(e) => e.stopPropagation()}>
                    {config.action}
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/></svg>
                </button>
                <div className="order-bonuses-row">
                    Бонусы: {order.bonuses} ₸
                    <svg className="bonus-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                </div>
            </div>

            <div className="card-row align-end mt-16">
                <div className="status-info-block">
                    <h3 className="card-status-text" style={{ color: config.color }}>{order.status}</h3>
                    {!isHistory && (
                        <div className="progress-bars-container">
                            {[1, 2, 3, 4, 5].map((step) => (
                                <div key={step} className={`step-bar ${step <= config.steps ? 'active' : ''}`} />
                            ))}
                        </div>
                    )}
                    <p className="card-description">{config.desc}</p>
                </div>
                <div className="items-row">
                    <div className="item-thumb"><img src={apricotImg} alt="1" /></div>
                    <div className="item-thumb"><img src={apricotImg} alt="1" /></div>
                    <div className="item-thumb"><img src={apricotImg} alt="1" /></div>
                    <div className="item-more-overlay"><span>Ещё 13<br/>товаров</span></div>
                </div>
            </div>
        </div>
    );
};

export default OnlineOrdersList;