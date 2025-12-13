import { useProfile } from '../../context/ProfileContext';
import EditProfileForm from '../Profile/EditProfile/EditProfileForm.jsx';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/Container/Container';
import Loader from '../../components/Loader/Loader.jsx';
import './styles/ProfilePage.css';
import {
    getOfflineOrdersData,
    getUserPaymentsCards,
    getUserAddresses,
    getCheckRegisterPageData,
    getAllPromocodes,
    getContactsPageData,
    getQuestionsPageData
} from '../../api/services/profileService.js';
import OfflinePurchasesList from './Offline/OfflinePurchasesList.jsx';
import MyAddresses from './MyAdresses/MyAddresses.jsx';
import CheckRegistrationForm from './CheckRegistration/CheckRegistrationForm.jsx';


const EditIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M24.0517 10.4351C25.3046 9.18221 25.3046 7.1508 24.0517 5.89787L22.4018 4.24795C21.1488 2.99502 19.1174 2.99502 17.8645 4.24795L4.91956 17.1929C4.38686 17.7256 4.0586 18.4288 3.99231 19.1792L3.70988 22.3763C3.59805 23.6422 4.65742 24.7016 5.92328 24.5898L9.12044 24.3073C9.87087 24.241 10.574 23.9128 11.1067 23.3801L24.0517 10.4351ZM22.8142 7.13531C23.3838 7.70482 23.3838 8.62819 22.8142 9.1977L21.7063 10.3056L17.994 6.59333L19.1019 5.48539C19.6714 4.91588 20.5948 4.91588 21.1643 5.48539L22.8142 7.13531ZM16.7566 7.83077L20.4689 11.5431L9.86931 22.1426C9.62717 22.3848 9.30755 22.534 8.96644 22.5641L5.76929 22.8465C5.58845 22.8625 5.43712 22.7112 5.45309 22.5303L5.73552 19.3332C5.76566 18.9921 5.91486 18.6725 6.157 18.4303L16.7566 7.83077Z" fill="#902067"/>
    </svg>

);

const OrderStatusIndicator = () => {
    let color = '#222';
    let label = 'В процессе';
    const status = arguments[0].status; // Получение статуса из аргументов

    if (status === 'Завершен') {
        color = '#10B981';
        label = 'Завершен';
    } else if (status === 'Отменен') {
        color = '#EF4444';
        label = 'Отменен';
    } else if (status === 'На сборке' || status === 'Собран') {
        color = '#F59E0B';
        label = status;
    } else if (status === 'Не оплачен') {
        color = '#EF4444';
        label = 'Не оплачен';
    }

    return (
        <span className="order-status-indicator" style={{ color: color, borderColor: color }}>
            {label}
        </span>
    );
};

const ProfilePage = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const {
        profile: profileData,
        orders,
        bonusBalance: balance,
        isLoading: profileLoading,
        fetchAllProfileData,
        clearProfileState,
        fetchUserProfile
    } = useProfile();

    // --- ИСПРАВЛЕНИЕ 1: Инициализация activeTab из localStorage ---
    const initialTab = localStorage.getItem('profileActiveTab') || 'onlineOrders';
    const [activeTab, setActiveTab] = useState(initialTab);

    const [isEditMode, setIsEditMode] = useState(false);
    const [tabContent, setTabContent] = useState(null);
    const [tabLoading, setTabLoading] = useState(false);
    const [tabError, setTabError] = useState(null);


    const menuItems = useMemo(() => [
        { id: 'onlineOrders', title: 'Мои онлайн заказы', path: '/profile/orders/online' },
        { id: 'offlinePurchases', title: 'Офлайн покупки', path: '/profile/orders/offline' },
        { id: 'paymentMethods', title: 'Способы оплаты', path: '/profile/payment' },
        { id: 'myAddresses', title: 'Мои адреса', path: '/profile/addresses' },
        { id: 'checkRegistration', title: 'Регистрация чека', path: '/profile/check-reg' },
        { id: 'promocodes', title: 'Промокоды', path: '/profile/promocodes' },
        { id: 'contacts', title: 'Контакты', path: '/profile/contacts'},
        { id: 'questions', title: 'Вопросы и ответы', path: '/profile/faq'},
        { id: 'support', title: 'Поддержка', path: '/profile/support', count: 12 },
    ], []);

    const fetcherMap = useMemo(() => ({
        offlinePurchases: getOfflineOrdersData,
        paymentMethods: getUserPaymentsCards,
        myAddresses: getUserAddresses,
        checkRegistration: getCheckRegisterPageData,
        promocodes: getAllPromocodes,
        contacts: getContactsPageData,
        questions: getQuestionsPageData,
    }), []);


    const loadTabContent = useCallback(async (tabId) => {
        if (tabId === 'onlineOrders' || !fetcherMap[tabId]) {
            setTabContent(null);
            setTabLoading(false);
            return;
        }

        setTabLoading(true);
        setTabError(null);

        try {
            const data = await fetcherMap[tabId]();
            setTabContent(data);
        } catch (err) {
            setTabError('Не удалось загрузить данные раздела.');
            setTabContent(null);
        } finally {
            setTabLoading(false);
        }
    }, [fetcherMap]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            clearProfileState();
            return;
        }
        fetchAllProfileData();
    }, [isAuthenticated, navigate, fetchAllProfileData, clearProfileState]);


    useEffect(() => {
        if (activeTab && !isEditMode) {
            loadTabContent(activeTab);
        }
    }, [activeTab, isEditMode, loadTabContent]);

    // --- ИСПРАВЛЕНИЕ 2: Сохранение activeTab в localStorage при изменении ---
    useEffect(() => {
        if (activeTab) {
            localStorage.setItem('profileActiveTab', activeTab);
        }
    }, [activeTab]);


    const handleMenuClick = (id) => {
        setActiveTab(id);
        setIsEditMode(false);
    };

    const handleEditProfileClick = () => {
        setActiveTab(null);
        setIsEditMode(true);
    };

    const handleCloseEditMode = () => {
        setIsEditMode(false);
        const defaultTab = localStorage.getItem('profileActiveTab') || 'onlineOrders';
        setActiveTab(defaultTab);
        fetchUserProfile();
    };


    if (!isAuthenticated || profileLoading || profileData === null) {
        return <Loader />;
    }

    const userName = `${profileData?.name || ''} ${profileData?.surname || ''}`.trim();
    const userPhone = profileData?.phone || ' ';
    const hasOrders = orders && orders.length > 0;
    const balanceAmount = balance?.balance || 0;
    const balanceCurrency = balance?.currency || '₸';


    const renderContent = () => {
        if (isEditMode) {
            return (
                <EditProfileForm
                    initialData={profileData}
                    onClose={handleCloseEditMode}
                />
            );
        }

        if (tabLoading) {
            return <Loader />;
        }

        if (tabError) {
            return <p className="error-message">Ошибка при загрузке данных: {tabError}</p>;
        }

        switch (activeTab) {
            case 'onlineOrders':
                return (
                    <div className="orders-section">
                        <h2 className="content-title">
                            {hasOrders ? 'История заказов' : ' '}
                        </h2>
                        {!hasOrders && (
                            <div className="no-orders-message"> {/* ИСПРАВЛЕНИЕ 3: Заменил <p> на <div> */}
                                <h2 className="content-title">
                                    Пока у вас нет заказов
                                </h2>
                                <p> {/* Используем <p> только для текста */}
                                    Совершайте покупки в приложении и на сайте и здесь появится история ваших заказов
                                </p>
                            </div>
                        )}

                        {hasOrders && (
                            <div className="orders-list">
                                {orders.map(order => (
                                    <div key={order.id} className="order-card">
                                        <div className="order-header">
                                            <span className="order-number">Заказ №{order.number || order.id}</span>
                                            <OrderStatusIndicator status={order.status} />
                                        </div>
                                        <p className="order-status-text">
                                            {order.status_description || `Ваш заказ ${order.status.toLowerCase()}`}
                                        </p>

                                        <div className="order-details">
                                            <span className="order-total">{order.total.toLocaleString()} {order.currency || '₸'}</span>
                                            <span className="order-bonus">Бонусы: {order.bonus_accrual || 0} {order.currency || '₸'}</span>
                                        </div>

                                        <button className="details-link" onClick={() => navigate(`/profile/order/${order.id}`)}>
                                            Подробнее о заказе
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            case 'offlinePurchases':
                return (
                    <OfflinePurchasesList
                        purchases={tabContent}
                        isLoading={tabLoading}
                        error={tabError}
                    />
                );

            case 'myAddresses':
                return (
                    <MyAddresses
                        addresses={tabContent}
                        isLoading={tabLoading}
                        error={tabError}
                        onAddressListChange={() => loadTabContent('myAddresses')}
                    />
                );

            case 'checkRegistration':
                return (
                    <CheckRegistrationForm
                        checkRegistrationData={tabContent}
                        isLoading={tabLoading}
                        error={tabError}
                    />
                );

            case 'paymentMethods':
            case 'promocodes':
            case 'contacts':
            case 'questions':
                return (
                    <div className="data-section">
                        <h2 className="content-title">{menuItems.find(i => i.id === activeTab)?.title}</h2>
                        <pre>{JSON.stringify(tabContent, null, 2)}</pre>
                    </div>
                );
            case 'support':
                return (
                    <div className="content-placeholder">
                        <h2 className="content-title">Поддержка</h2>
                        <p>Раздел поддержки в разработке.</p>
                    </div>
                );
            default:
                return <div className="content-placeholder">Выберите пункт меню или редактируйте профиль.</div>;
        }
    };


    return (
        <Container>
            <div className="profile-page-wrapper">

                <div className="profile-layout">

                    <div className="profile-sidebar">
                        <div className="profile-user-info">
                            <div className="user-name-wrapper">
                                <span className="user-name">{userName}</span>
                                <button className="edit-btn" onClick={handleEditProfileClick}>
                                    <EditIcon />
                                </button>
                            </div>
                            <span className="user-phone">{userPhone}</span>
                        </div>

                        <div className="profile-balance-widget">
                            <span>Мой баланс</span>
                            <span className="balance-amount">
                                {balanceAmount.toLocaleString()} {balanceCurrency}
                            </span>
                        </div>

                        <nav className="profile-nav">
                            {menuItems.map(item => (
                                <div
                                    key={item.id}
                                    className={`nav-item ${activeTab === item.id && !isEditMode ? 'active' : ''}`}
                                    onClick={() => handleMenuClick(item.id)}
                                >
                                    <span className="item-title">{item.title}</span>
                                    {item.count && <span className="item-count">{item.count}</span>}
                                </div>
                            ))}
                            <button onClick={logout} className="nav-item logout-link">
                                Выйти
                            </button>
                        </nav>
                    </div>

                    <div className="profile-content-area">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default ProfilePage;