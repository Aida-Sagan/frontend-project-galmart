import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Loader from '../../../components/Loader/Loader.jsx';
import './styles/Notifications.css';
import { fetchNotificationsCount, fetchNotificationsData } from '../../../api/services/notificationService.js';

const SettingsIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C11.6667 2 11.3333 2.16667 11 2.5C10.6667 2.83333 10.5 3.16667 10.5 3.5V4C10.5 4.33333 10.6667 4.66667 11 5C11.3333 5.33333 11.6667 5.5 12 5.5C12.3333 5.5 12.6667 5.33333 13 5C13.3333 4.66667 13.5 4.33333 13.5 4V3.5C13.5 3.16667 13.3333 2.83333 13 2.5C12.6667 2.16667 12.3333 2 12 2ZM19 12C19 11.6667 18.8333 11.3333 18.5 11C18.1667 10.6667 17.8333 10.5 17.5 10.5H17C16.6667 10.5 16.3333 10.6667 16 11C15.6667 11.3333 15.5 11.6667 15.5 12C15.5 12.3333 15.6667 12.6667 16 13C16.3333 13.3333 16.6667 13.5 17 13.5H17.5C17.8333 13.5 18.1667 13.3333 18.5 13C18.8333 12.6667 19 12.3333 19 12ZM5 12C5 12.3333 5.16667 12.6667 5.5 13C5.83333 13.3333 6.16667 13.5 6.5 13.5H7C7.33333 13.5 7.66667 13.3333 8 13C8.33333 12.6667 8.5 12.3333 8.5 12C8.5 11.6667 8.33333 11.3333 8 11C7.66667 10.6667 7.33333 10.5 7 10.5H6.5C6.16667 10.5 5.83333 10.6667 5.5 11C5.16667 11.3333 5 11.6667 5 12ZM12 19C12 19.3333 11.8333 19.6667 11.5 20C11.1667 20.3333 10.8333 20.5 10.5 20.5H10C9.66667 20.5 9.33333 20.3333 9 20C8.66667 19.6667 8.5 19.3333 8.5 19V18.5C8.5 18.1667 8.66667 17.8333 9 17.5C9.33333 17.1667 9.66667 17 10 17H10.5C10.8333 17 11.1667 17.1667 11.5 17.5C11.8333 17.8333 12 18.5V19ZM16 16C16 16.3333 15.8333 16.6667 15.5 17C15.1667 17.3333 14.8333 17.5 14.5 17.5H14C13.6667 17.5 13.3333 17.3333 13 17C12.6667 16.6667 12.5 16.3333 12.5 16V15.5C12.5 15.1667 12.6667 14.8333 13 14.5C13.3333 14.1667 13.6667 14 14 14H14.5C14.8333 14 15.1667 14.1667 15.5 14.5C15.8333 14.8333 16 15.1667 16 15.5V16Z" fill="#222222"/>
    </svg>
);

const NotificationContent = ({ initialTab = 'orders', onOrderSelect }) => {
    const [activeSubTab, setActiveSubTab] = useState(initialTab);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

    const [notificationCounts, setNotificationCounts] = useState({ orders: 0, bonuses: 0, news: 0 });
    const [currentNotificationData, setCurrentNotificationData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    // Отслеживаем, какие табы были открыты в этой сессии
    const [viewedTabs, setViewedTabs] = useState(new Set());

    useEffect(() => {
        const loadCounts = async () => {
            try {
                const counts = await fetchNotificationsCount();
                setNotificationCounts(counts);
            } catch (err) {
                console.error("Ошибка загрузки счетчиков:", err);
            }
        };
        loadCounts();
    }, []);

    const loadNotificationData = useCallback(async (tabId) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchNotificationsData(tabId);
            setCurrentNotificationData(data);
            // Помечаем вкладку как просмотренную
            setViewedTabs(prev => new Set(prev).add(tabId));
        } catch (err) {
            setError('Не удалось загрузить уведомления.');
            setCurrentNotificationData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        loadNotificationData(activeSubTab);
    }, [activeSubTab, loadNotificationData]);

    const subTabs = useMemo(() => [
        { id: 'orders', title: 'Заказы', count: notificationCounts.orders },
        { id: 'bonuses', title: 'Бонусы', count: notificationCounts.bonuses },
        { id: 'news', title: 'Новости', count: notificationCounts.news },
    ], [notificationCounts]);

    const handleTabClick = (id) => {
        if (id !== activeSubTab) {
            setActiveSubTab(id);
        }
    };

    const handleNotificationClick = (item) => {
        // Если тип уведомления - заказ, вызываем переход
        if (item.target_type === 'order' && item.target_value && onOrderSelect) {
            onOrderSelect(item.target_value);
        }
    };

    const SettingsModal = ({ isOpen, onClose }) => {
        if (!isOpen) return null;
        const [isAllowed, setIsAllowed] = useState(true);

        return (
            <div className="modal-overlay">
                <div className="modal-content">
                    <div className="modal-header">
                        <h3>Настройки</h3>
                        <button className="close-btn" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                    <div className="settings-row">
                        <div className="settings-text">
                            <h4>Разрешить уведомления</h4>
                            <p>Только полезные уведомления про акции и скидки. Сообщения о заказах приходят всегда.</p>
                        </div>
                        <label className="toggle-switch">
                            <input type="checkbox" checked={isAllowed} onChange={() => setIsAllowed(!isAllowed)} />
                            <span className="slider round"></span>
                        </label>
                    </div>
                </div>
            </div>
        );
    };

    const renderNotificationList = () => {
        if (isLoading) return <Loader />;
        if (error) return <p className="error-message">{error}</p>;

        if (currentNotificationData.length === 0) {
            const tab = subTabs.find(t => t.id === activeSubTab);
            return (
                <div className="no-data-message-container">
                    <h2 className="content-title">
                        {tab.id === 'bonuses' ? 'Пока у вас нет бонусов' : 'Пока нет уведомлений'}
                    </h2>
                    <p>
                        {tab.id === 'bonuses'
                            ? 'Чтобы получать бонусы, совершайте покупки в интернет-магазине и в супермаркетах galmart'
                            : 'Новые уведомления появятся здесь.'}
                    </p>
                </div>
            );
        }

        return currentNotificationData.map(item => {
            const isReadInSession = viewedTabs.has(activeSubTab);
            const isUnread = !item.is_readed && !isReadInSession;

            return (
                <div
                    key={item.id}
                    className={`notification-card-v2 ${isUnread ? 'unread' : 'read'}`}
                    onClick={() => handleNotificationClick(item)}
                >
                    <div className="card-content-left">
                        <span className="notif-date">{item.created_date}</span>
                        <h3 className="notif-title">{item.title}</h3>
                        <p className="notif-text">{item.text}</p>
                    </div>
                    <div className="card-arrow-right">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M9 18L15 12L9 6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </div>
                </div>
            );
        });
    };

    return (
        <div className="notifications-page">
            <div className="page-header">
                <h1 className="content-title">Уведомления</h1>
                <button className="settings-text-btn" onClick={() => setIsSettingsModalOpen(true)}>
                    Настройки <SettingsIcon />
                </button>
            </div>

            <div className="notification-subtabs">
                {subTabs.map(tab => {
                    const showBadge = tab.count > 0 && activeSubTab !== tab.id;
                    return (
                        <div
                            key={tab.id}
                            className={`notif-chip-v2 ${activeSubTab === tab.id ? 'active' : ''}`}
                            onClick={() => handleTabClick(tab.id)}
                        >
                            <span>{tab.title}</span>
                            {showBadge && <span className="notif-badge">{tab.count}</span>}
                        </div>
                    );
                })}
            </div>

            <div className="notification-list">
                {renderNotificationList()}
            </div>

            <SettingsModal
                isOpen={isSettingsModalOpen}
                onClose={() => setIsSettingsModalOpen(false)}
            />
        </div>
    );
};

export default NotificationContent;