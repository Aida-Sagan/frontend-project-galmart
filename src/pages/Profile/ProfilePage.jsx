import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useProfile } from '../../context/ProfileContext';
import EditProfileForm from '../Profile/EditProfile/EditProfileForm.jsx';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/Container/Container';
import Loader from '../../components/Loader/Loader.jsx';
import {
    getOfflineOrdersData,
    getUserPaymentsCards,
    getUserAddresses,
    getCheckRegisterPageData,
    getAllPromocodes,
} from '../../api/services/profileService.js';
import OfflinePurchasesList from './Offline/OfflinePurchasesList.jsx';
import MyAddresses from './MyAdresses/MyAddresses.jsx';
import CheckRegistrationForm from './CheckRegistration/CheckRegistrationForm.jsx';
import PromocodesList from './Promocodes/PromocodesList.jsx';
import PaymentMethodsList from './Payment/PaymentMethodsList.jsx';
import NotificationContent from './Notifications/NotificationContent.jsx';
import OnlineOrdersList from './Online/OnlineOrdersList.jsx';
import SupportContent from './Support/SupportContent.jsx';
import './styles/ProfilePage.css';

const EditIcon = () => (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M24.0517 10.4351C25.3046 9.18221 25.3046 7.1508 24.0517 5.89787L22.4018 4.24795C21.1488 2.99502 19.1174 2.99502 17.8645 4.24795L4.91956 17.1929C4.38686 17.7256 4.0586 18.4288 3.99231 19.1792L3.70988 22.3763C3.59805 23.6422 4.65742 24.7016 5.92328 24.5898L9.12044 24.3073C9.87087 24.241 10.574 23.9128 11.1067 23.3801L24.0517 10.4351ZM22.8142 7.13531C23.3838 7.70482 23.3838 8.62819 22.8142 9.1977L21.7063 10.3056L17.994 6.59333L19.1019 5.48539C19.6714 4.91588 20.5948 4.91588 21.1643 5.48539L22.8142 7.13531ZM16.7566 7.83077L20.4689 11.5431L9.86931 22.1426C9.62717 22.3848 9.30755 22.534 8.96644 22.5641L5.76929 22.8465C5.58845 22.8625 5.43712 22.7112 5.45309 22.5303L5.73552 19.3332C5.76566 18.9921 5.91486 18.6725 6.157 18.4303L16.7566 7.83077Z" fill="#902067"/>
    </svg>
);

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

    const initialTab = localStorage.getItem('profileActiveTab') || 'onlineOrders';
    const [activeTab, setActiveTab] = useState(initialTab);
    const [notificationCount, setNotificationCount] = useState(12);

    const [isEditMode, setIsEditMode] = useState(false);
    const [tabContent, setTabContent] = useState(null);
    const [tabLoading, setTabLoading] = useState(false);
    const [tabError, setTabError] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [isMobileContentOpen, setIsMobileContentOpen] = useState(window.innerWidth > 768);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleSelectOrderFromNotify = (orderId) => {
        setActiveTab('onlineOrders');
        setSelectedOrder({ id: orderId });
        setViewMode('details');
        setIsEditMode(false);
        if (window.innerWidth <= 768) {
            setIsMobileContentOpen(true);
        }
    };

    const menuItems = useMemo(() => [
        { id: 'onlineOrders', title: 'Мои онлайн заказы', path: '/profile/orders/online' },
        { id: 'offlinePurchases', title: 'Офлайн покупки', path: '/profile/orders/offline' },
        { id: 'paymentMethods', title: 'Способы оплаты', path: '/profile/payment' },
        { id: 'myAddresses', title: 'Мои адреса', path: '/profile/addresses' },
        { id: 'checkRegistration', title: 'Регистрация чека', path: '/profile/check-reg' },
        { id: 'promocodes', title: 'Промокоды', path: '/profile/promocodes' },
        { id: 'notifications', title: 'Уведомления', path: '/profile/notifications', count: notificationCount },
        { id: 'support', title: 'Поддержка', path: '/profile/support', count: 12 },
    ], [notificationCount]);

    const fetcherMap = useMemo(() => ({
        offlinePurchases: getOfflineOrdersData,
        paymentMethods: getUserPaymentsCards,
        myAddresses: getUserAddresses,
        checkRegistration: getCheckRegisterPageData,
        promocodes: getAllPromocodes,
    }), []);

    const loadTabContent = useCallback(async (tabId) => {
        if (tabId === 'onlineOrders' || tabId === 'notifications' || !fetcherMap[tabId]) {
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

    useEffect(() => {
        if (activeTab) {
            localStorage.setItem('profileActiveTab', activeTab);
        }
    }, [activeTab]);

    const handleMenuClick = (id) => {
        setActiveTab(id);
        setIsEditMode(false);
        setViewMode('list');
        setSelectedOrder(null);
        if (window.innerWidth <= 768) {
            setIsMobileContentOpen(true);
            setTimeout(() => {
                document.querySelector('.profile-content-area')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            setIsMobileContentOpen(true);
        }
        if (id === 'notifications') {
            setNotificationCount(0);
        }
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

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (!isAuthenticated || profileLoading || profileData === null) {
        return <Loader />;
    }

    const userName = `${profileData?.name || ''} ${profileData?.surname || ''}`.trim();
    const userPhone = profileData?.phone || ' ';
    const balanceAmount = balance?.balance || 0;
    const balanceCurrency = balance?.currency || '₸';

    const renderContent = () => {
        if (isEditMode) {
            return <EditProfileForm initialData={profileData} onClose={handleCloseEditMode} />;
        }
        if (tabLoading) return <Loader />;
        if (tabError) return <p className="error-message">{tabError}</p>;

        switch (activeTab) {
            case 'onlineOrders':
                return <OnlineOrdersList />;
            case 'offlinePurchases':
                return <OfflinePurchasesList purchases={tabContent} isLoading={tabLoading} error={tabError} />;
            case 'myAddresses':
                return <MyAddresses addresses={tabContent} isLoading={tabLoading} error={tabError} onAddressListChange={() => loadTabContent('myAddresses')} />;
            case 'checkRegistration':
                return <CheckRegistrationForm checkRegistrationData={tabContent} isLoading={tabLoading} error={tabError} />;
            case 'paymentMethods':
                return <PaymentMethodsList cardsData={tabContent} isLoading={tabLoading} error={tabError} />;
            case 'promocodes':
                return <PromocodesList promocodesData={tabContent} isLoading={tabLoading} error={tabError} />;
            case 'notifications':
                return <NotificationContent initialTab={'orders'} onOrderSelect={handleSelectOrderFromNotify} />;
            case 'support':
                return <SupportContent />;
            default:
                return <div className="content-placeholder">Выберите пункт меню или редактируйте профиль.</div>;
        }
    };

    return (
        <Container>
            <div className={`profile-page-wrapper ${isMobileContentOpen ? 'mobile-content-active' : ''}`}>
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
                                    {item.count > 0 && item.id === 'notifications' && activeTab !== item.id && (
                                        <span className="item-count">{item.count}</span>
                                    )}
                                </div>
                            ))}
                            <button onClick={handleLogoutClick} className="logout-profile-btn">
                                Выйти из профиля
                            </button>
                        </nav>
                    </div>
                    <div className={`profile-content-area ${isMobileContentOpen ? 'visible' : ''}`}>
                        {isMobileContentOpen && window.innerWidth <= 768 && (
                            <button
                                className="mobile-back-btn"
                                onClick={() => {
                                    setIsMobileContentOpen(false);
                                    setViewMode('list');
                                }}
                                style={{
                                    marginBottom: '16px',
                                    border: 'none',
                                    background: '#F5F5F5',
                                    padding: '12px',
                                    borderRadius: '32px',
                                    width: '14%',
                                    textAlign: 'left',
                                    fontWeight: '600',
                                    color: '#902067'
                                }}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M8.53033 7.46967C8.82322 7.76256 8.82322 8.23744 8.53033 8.53033L5.81066 11.25H20.5C20.9142 11.25 21.25 11.5858 21.25 12C21.25 12.4142 20.9142 12.75 20.5 12.75H5.81066L8.53033 15.4697C8.82322 15.7626 8.82322 16.2374 8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967Z" fill="#222222"/>
                                </svg>
                            </button>
                        )}
                        {renderContent()}
                    </div>
                </div>
            </div>
            {isLogoutModalOpen && (
                <div className="modal-overlay" onClick={() => setIsLogoutModalOpen(false)}>
                    <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close-icon" onClick={() => setIsLogoutModalOpen(false)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M18 6L6 18M6 6l12 12" stroke="#222" strokeWidth="2" strokeLinecap="round"/>
                            </svg>
                        </button>
                        <h3 className="logout-modal-title">Выйти из профиля?</h3>
                        <p className="logout-modal-text">Вы действительно хотите выйти из профиля?</p>
                        <div className="logout-modal-actions">
                            <button className="btn-primary-large" onClick={handleLogout}>Выйти</button>
                            <button className="btn-outline-cancel" onClick={() => setIsLogoutModalOpen(false)}>Не выходить</button>
                        </div>
                    </div>
                </div>
            )}
        </Container>
    );
};

export default ProfilePage;