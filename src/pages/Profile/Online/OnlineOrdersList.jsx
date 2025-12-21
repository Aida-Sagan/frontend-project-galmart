import React, { useState } from 'react';
import './styles/OnlineOrders.css';

// Импорт картинок
import apricotImg from '../../../assets/items/fruits_png.png';
import flourImg from '../../../assets/items/item.png';
import bowlImg from '../../../assets/items/kitchen.png';
import juiceImg from '../../../assets/items/juice.png';
import glassesImg from '../../../assets/items/item_3.png';

const OnlineOrdersList = () => {
    const [view, setView] = useState('list'); // 'list' | 'details'
    const [selectedOrder, setSelectedOrder] = useState(null);

    const statusConfig = {
        'Не оплачен': { steps: 0, color: '#902067', desc: 'Для оформления заказа необходимо произвести оплату', action: 'Оплатить заказ' },
        'Оформлен': { steps: 1, color: '#902067', desc: 'Что-то забыли? Вы можете дополнить заказ, пока он не передан на сборку', action: 'Дополнить заказ' },
        'На сборке': { steps: 2, color: '#902067', desc: 'Вы можете добавить что-то к заказу, написав менеджеру', action: 'В чат с менеджером' },
        'Собран': { steps: 3, color: '#902067', desc: 'Ваш заказ собран, скоро передадим курьеру', action: 'В чат с менеджером' },
        'Доставляется': { steps: 4, color: '#902067', desc: 'Ваш заказ привезёт Мираз', action: 'Связаться с курьером' },
        'Ожидает оценки': { steps: 5, color: '#902067', desc: 'Ваш заказ доставлен. Пожалуйста, оцените нашу работу', action: 'Оценить заказ' },
        'Завершен': { steps: 5, color: '#222', desc: 'Ваш заказ завершен', action: 'Подробнее о заказе' },
        'Отменен': { steps: 0, color: '#7A7A7A', desc: 'Ваш заказ отменен', action: 'Подробнее о заказе' }
    };

    const mockOrders = [
        { id: 1, number: '01100018957', total: 18048, bonuses: 180, status: 'Не оплачен', isHistory: false },
        { id: 2, number: '01100018958', total: 12500, bonuses: 125, status: 'Оформлен', isHistory: false },
        { id: 3, number: '01100018959', total: 18048, bonuses: 180, status: 'Завершен', isHistory: true },
        { id: 4, number: '01100018960', total: 18048, bonuses: 180, status: 'Отменен', isHistory: true }
    ];

    const renderProgressBar = (currentStatus) => {
        const activeSteps = statusConfig[currentStatus]?.steps || 0;
        return (
            <div className="progress-bars-container">
                {[1, 2, 3, 4, 5].map((step) => (
                    <div key={step} className={`step-bar ${step <= activeSteps ? 'active' : ''}`} />
                ))}
            </div>
        );
    };

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
        setView('details');
    };

    // --- ДЕТАЛЬНАЯ СТРАНИЦА ---
    if (view === 'details' && selectedOrder) {
        const config = statusConfig[selectedOrder.status];
        return (
            <div className="order-details-wrapper">
                <button className="back-navigation" onClick={() => setView('list')}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M15 18L9 12L15 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    Вернуться к заказам
                </button>

                <h2 className="detail-order-number">Заказ №{selectedOrder.number}</h2>

                <div className="order-card-detail">
                    <h2 className="card-status-text" style={{ color: config.color }}>{selectedOrder.status}</h2>
                    {renderProgressBar(selectedOrder.status)}
                    <p className="card-description">{config.desc}</p>
                </div>

                <div className="detail-info-blocks">
                    <div className="info-block-row">
                        <span>Адрес доставки</span>
                        <strong>улица Мангилик Ел, 60, кв 25...</strong>
                    </div>
                    <div className="info-block-row">
                        <span>Время доставки</span>
                        <strong>3 сентября, 18:00 - 20:00</strong>
                    </div>
                    <div className="info-block-row">
                        <span>Способ оплаты</span>
                        <strong>•••• 2636 VISA</strong>
                    </div>
                </div>

                {/* Состав заказа (пример) */}
                <div className="order-composition">
                    <h3>Состав заказа</h3>
                    <div className="composition-item">
                        <img src={apricotImg} alt="item" />
                        <div className="item-info">
                            <p>Абрикосы, вес</p>
                            <span>0,5 кг → 0,57 кг</span>
                        </div>
                        <span className="item-price">2 600 ₸</span>
                    </div>
                </div>

                <div className="detail-actions">
                    <button className="btn-primary">Оплатить заказ</button>
                    <button className="btn-outline">Отменить заказ</button>
                </div>
            </div>
        );
    }

    // --- СПИСОК ЗАКАЗОВ ---
    return (
        <div className="online-orders-container">
            <h2 className="main-section-title">Текущие заказы</h2>
            {mockOrders.filter(o => !o.isHistory).map(order => (
                <div key={order.id} className="order-card-v2" onClick={() => handleOrderClick(order)}>
                    <div className="card-row">
                        <span className="order-id">Заказ №{order.number}</span>
                        <span className="order-price-top">{order.total.toLocaleString()} ₸</span>
                    </div>

                    <div className="card-row align-center">
                        <button className="status-action-btn" onClick={(e) => e.stopPropagation()}>
                            {statusConfig[order.status].action}
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2"/></svg>
                        </button>
                        <div className="order-bonuses-row">
                            Бонусы: {order.bonuses} ₸
                            <svg className="bonus-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7A7A7A" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                        </div>
                    </div>

                    <div className="card-row align-end mt-16">
                        <div className="status-info-block">
                            <h3 className="card-status-text">{order.status}</h3>
                            {renderProgressBar(order.status)}
                            <p className="card-description">{statusConfig[order.status].desc}</p>
                        </div>

                        <div className="items-row">
                            <div className="item-thumb"><img src={apricotImg} alt="1" /></div>
                            <div className="item-thumb"><img src={flourImg} alt="2" /></div>
                            <div className="item-thumb"><img src={bowlImg} alt="3" /></div>
                            <div className="item-thumb"><img src={juiceImg} alt="4" /></div>
                            <div className="item-thumb"><img src={glassesImg} alt="5" /></div>
                            <div className="item-more-overlay">
                                <span>Ещё 13<br/>товаров</span>
                            </div>
                        </div>
                    </div>
                </div>
            ))}

            <h2 className="main-section-title mt-40">История заказов</h2>
            {mockOrders.filter(o => o.isHistory).map(order => (
                <div key={order.id} className="order-card-v2 history-card" onClick={() => handleOrderClick(order)}>
                    <div className="card-row">
                        <span className="order-id">Заказ №{order.number}</span>
                        <span className="order-price-top">{order.total.toLocaleString()} ₸</span>
                    </div>
                    <div className="card-row align-end">
                        <h3 className="card-status-text" style={{color: '#222'}}>{order.status}</h3>
                        <div className="items-row">
                            <div className="item-thumb"><img src={apricotImg} alt="1" /></div>
                            <div className="item-more-overlay"><span>+17</span></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OnlineOrdersList;