import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader/Loader.jsx';
import OfflinePurchaseDetail from './OfflinePurchaseDetail.jsx';
import './styles/OfflinePurchases.css';


const OfflinePurchasesList = ({ purchases, isLoading, error }) => {
    const navigate = useNavigate();
    const [selectedPurchase, setSelectedPurchase] = useState(null);

    // Гарантируем, что работаем с массивом
    const purchasesArray = Array.isArray(purchases) ? purchases : [];

    if (isLoading) return <Loader />;
    if (error) return <p className="error-message">{error}</p>;

    // Проверяем длину нормализованного массива
    if (purchasesArray.length === 0) {
        return (
            <div className="no-purchases-container">
                <div className="no-purchases-card">
                    <p className="no-purchases-title">Пока у вас нет покупок</p>
                    <p className="no-purchases-text">
                        Посещайте наши супермаркеты и здесь появится история ваших покупок
                    </p>
                </div>
            </div>
        );
    }

    const handleDetailClick = (purchase) => {
        setSelectedPurchase(purchase);
    };

    const handleBackClick = () => {
        setSelectedPurchase(null);
    };

    if (selectedPurchase) {
        return (
            <div className="offline-detail-wrapper">
                <button onClick={handleBackClick} className="back-to-list">
                    <span className="arrow-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.53033 7.46967C8.82322 7.76256 8.82322 8.23744 8.53033 8.53033L5.81066 11.25H20.5C20.9142 11.25 21.25 11.5858 21.25 12C21.25 12.4142 20.9142 12.75 20.5 12.75H5.81066L8.53033 15.4697C8.82322 15.7626 8.82322 16.2374 8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967Z" fill="#222222"/>
                        </svg>
                    </span> Вернуться к покупкам
                </button>
                <OfflinePurchaseDetail purchase={selectedPurchase} />
            </div>
        );
    }

    return (
        <div className="purchases-section">
            <h2 className="content-title">История покупок</h2>
            <div className="purchases-list">
                {/* Теперь используем безопасный массив */}
                {purchasesArray.map(purchase => (
                    <div key={purchase.id} className="purchase-card" onClick={() => handleDetailClick(purchase)}>
                        <div className="card-left">
                            <span className="purchase-number">№{purchase.check_number || purchase.id}</span>
                            <span className="purchase-shop">{purchase.shop || 'Офлайн покупка'}</span>
                            <span className="purchase-date">{purchase.date}</span>
                        </div>
                        <div className="card-right">
                            {/* Добавлена доп. проверка на существование total и bonuses, чтобы не упасть при рендере содержимого */}
                            <span className="purchase-total-amount">
                                {purchase.total?.toLocaleString() || 0} {purchase.currency || '₸'}
                            </span>
                            <span className="purchase-bonuses-amount">
                                Бонусы: {purchase.bonuses?.toLocaleString() || 0} {purchase.currency || '₸'}
                            </span>
                            <button className="details-link-btn">
                                Подробнее
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M4.94064 3.19064C4.76979 3.3615 4.76979 3.6385 4.94064 3.80936L8.13128 7L4.94064 10.1906C4.76979 10.3615 4.76979 10.6385 4.94064 10.8094C5.1115 10.9802 5.3885 10.9802 5.55936 10.8094L9.05936 7.30936C9.23021 7.1385 9.23021 6.8615 9.05936 6.69064L5.55936 3.19064C5.3885 3.01979 5.1115 3.01979 4.94064 3.19064Z" fill="#222222"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default OfflinePurchasesList;