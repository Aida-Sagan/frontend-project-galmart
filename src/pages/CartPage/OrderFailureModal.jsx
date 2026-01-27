import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style/OrderFailureModal.css';

const OrderFailureModal = ({
                               isOpen,
                               onClose,
                               onGoToOrders,
                               errorMessage = "Произошла ошибка при оплате заказа. Пожалуйста, попробуйте снова. Заказ будет передан на сборку после оплаты"
                           }) => {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleGoToOrders = () => {
        if (onGoToOrders) onGoToOrders();
        navigate('/profile');
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content order-failure-modal" onClick={e => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>

                <h2>Не удалось оформить заказ</h2>

                <p className="failure-text">
                    {errorMessage}
                </p>

                <button className="modal-btn primary-action" onClick={handleGoToOrders}>
                    К заказам
                </button>
            </div>
        </div>
    );
};

export default OrderFailureModal;