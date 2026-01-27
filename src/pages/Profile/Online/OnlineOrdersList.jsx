import React, { useState, useEffect } from 'react';
import './styles/OnlineOrders.css';
import OrderDetails from './OrderDetails';
import apricotImg from '../../../assets/items/fruits_png.png';
import { getOnlineOrdersData } from '../../../api/services/ordersService.js';

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

const OnlineOrdersList = () => {
    const [view, setView] = useState('list');
    const [selectedOrder, setSelectedOrder] = useState(null);

    const [orders, setOrders] = useState({ active: [], history: [], all: [] });
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');


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

                const allMapped = (data.all || []).map(order => ({
                    ...order,
                    status: STATUS_MAP[order.status] || order.status
                }));

                const formattedData = {
                    active: allMapped.filter(o => !historyNames.includes(o.status)),
                    history: allMapped.filter(o => historyNames.includes(o.status)),
                    all: allMapped
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

    const filterOrders = (orderList) => {
        return orderList.filter(order => {
            const num = (order.order_number || order.number || '').toString();
            return num.toLowerCase().includes(searchQuery.toLowerCase());
        });
    };

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

    const filteredActive = filterOrders(orders.active);
    const filteredHistory = filterOrders(orders.history);

    return (
        <div className="online-orders-container">
            {orders.active.length > 0 && (
                <div className="orders-header-row">
                    <h2 className="main-section-title">Мои онлайн заказы</h2>

                    <div className="search-container-v2">
                        <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="search-icon-v2"
                        >
                            <path d="M10.0625 1.83252C14.6058 1.83256 18.2891 5.51574 18.2891 10.0591C18.289 12.0765 17.5596 13.9233 16.3545 15.354L19.9629 18.9624C20.2381 19.2378 20.2382 19.6842 19.9629 19.9595C19.6876 20.2348 19.2412 20.2347 18.9658 19.9595L15.3584 16.3521C13.9277 17.5572 12.08 18.2856 10.0625 18.2856C5.51915 18.2856 1.83597 14.6024 1.83594 10.0591C1.83594 5.51571 5.51913 1.83252 10.0625 1.83252ZM10.0625 3.24268C6.29799 3.24268 3.24609 6.29458 3.24609 10.0591C3.24613 13.8236 6.29802 16.8755 10.0625 16.8755C11.9481 16.8755 13.6539 16.1106 14.8887 14.8726C16.1192 13.6388 16.8789 11.9382 16.8789 10.0591C16.8789 6.2946 13.827 3.24271 10.0625 3.24268Z" fill="#7A7A7A"/>
                        </svg>
                        <input
                            type="text"
                            className="search-input-v2"
                            placeholder="Искать заказ"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            )}
            {filteredActive.length > 0 ? (
                filteredActive.map(order => renderOrderCard(order, statusConfig, handleOrderClick))
            ) : searchQuery && orders.active.length > 0 ? (
                <p className="no-results">Активных заказов не найдено</p>
            ) : null}

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