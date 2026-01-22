import React, { useState, useEffect } from 'react';
import './styles/OnlineOrders.css';
import OrderDetails from './OrderDetails';
import apricotImg from '../../../assets/items/fruits_png.png';
import { getOnlineOrdersData } from '../../../api/services/ordersService.js';

const OnlineOrdersList = () => {
    const [view, setView] = useState('list');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [orders, setOrders] = useState({ active: [], history: [], all: [] });
    const [loading, setLoading] = useState(true);

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
        'Завершен': { steps: 5, color: '#222', desc: 'Ваш заказ завершен', action: 'Подробнее о заказе' },
        'Отменен': { steps: 0, color: '#222', desc: 'Ваш заказ отменен', action: 'Подробнее о заказе' },
        'Отменен курьером': { steps: 0, color: '#222', desc: 'Ваш заказ отменен курьером', action: 'Подробнее о заказе' },
        'Полный возврат': { steps: 0, color: '#222', desc: 'По вашему заказу произведен полный возврат', action: 'Подробнее о заказе' },
        'Частичный возврат': { steps: 0, color: '#222', desc: 'По вашему заказу произведен частичный возврат', action: 'Подробнее о заказе' }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await getOnlineOrdersData();
                const historyNames = ['Завершен', 'Отменен', 'Отменен курьером', 'Полный возврат', 'Частичный возврат'];

                const formattedData = {
                    active: data.all.filter(o => !historyNames.includes(o.status)),
                    history: data.all.filter(o => historyNames.includes(o.status)),
                    all: data.all
                };

                setOrders(formattedData);
            } catch (error) {
                console.error("Ошибка в компоненте OnlineOrdersList:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleOrderClick = (order) => {
        let finalConfig = statusConfig[order.status] || statusConfig['Оформлен'];
        if (order.status === 'Оформлен') {
            const variant = order.canEditSelf ? finalConfig.variants.selfEdit : finalConfig.variants.viaManager;
            finalConfig = { ...finalConfig, ...variant };
        }

        setSelectedOrder(order);
        setView('details');
    };

    if (loading) {
        return <div className="empty-state-full">Загрузка заказов...</div>;
    }

    if (orders.all.length === 0) {
        return <div className="empty-state-full">Пока у вас нет заказов</div>;
    }

    if (view === 'details' && selectedOrder) {
        let currentConfig = statusConfig[selectedOrder.status] || statusConfig['Оформлен'];
        if (selectedOrder.status === 'Оформлен') {
            const variant = selectedOrder.canEditSelf ? currentConfig.variants.selfEdit : currentConfig.variants.viaManager;
            currentConfig = { ...currentConfig, ...variant };
        }
        return <OrderDetails order={selectedOrder} config={currentConfig} onBack={() => window.location.reload()} />;
    }

    return (
        <div className="online-orders-container">
            {orders.active.length > 0 && (
                <>
                    <h2 className="main-section-title">Мои онлайн заказы</h2>
                    {orders.active.map(order => renderOrderCard(order, statusConfig, handleOrderClick))}
                </>
            )}

            {orders.history.length > 0 && (
                <>
                    {orders.active.length === 0 && (
                        <h2 className="main-section-title">История заказов</h2>
                    )}

                    <div className={orders.active.length > 0 ? "mt-40" : ""}>
                        {orders.history.map(order => renderOrderCard(order, statusConfig, handleOrderClick, true))}
                    </div>
                </>
            )}
        </div>
    );
};

const renderOrderCard = (order, statusConfig, onOrderClick, isHistory = false) => {
    let config = statusConfig[order.status] || { steps: 0, color: '#902067', desc: order.status, action: 'Подробнее' };

    if (order.status === 'Оформлен') {
        const variant = order.canEditSelf ? config.variants.selfEdit : config.variants.viaManager;
        config = { ...config, ...variant };
    }

    return (
        <div key={order.id} className={`order-card-v2 ${isHistory ? 'history-card' : ''}`} onClick={() => onOrderClick(order)}>
            <div className="card-row">
                <span className="order-id">Заказ №{order.order_number || order.number}</span>
                <span className="order-price-top">{order.total.toLocaleString()} {order.currency || '₸'}</span>
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