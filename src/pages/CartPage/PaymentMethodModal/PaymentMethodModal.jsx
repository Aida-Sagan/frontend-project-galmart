import React, { useState } from 'react';
import { ReactComponent as VisaIcon } from '../../../assets/svg/visa.svg';
import { ReactComponent as MastercardIcon } from '../../../assets/svg/mastercard.svg';

import './style/PaymentMethodModal.css';

const PaymentMethodModal = ({
                                isOpen,
                                onClose,
                                selectedMethodId,
                                onSelect,
                                cards = [],
                                onDeleteCard,
                                onAddCard
                            }) => {
    const [cardToDelete, setCardToDelete] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    if (!isOpen) return null;

    const handleDeleteClick = (e, card) => {
        e.stopPropagation();
        setErrorMessage('');
        setCardToDelete(card);
    };

    const confirmDelete = async () => {
        if (cardToDelete) {
            try {

                await onDeleteCard(cardToDelete.id);
                setCardToDelete(null);
                setErrorMessage('');
            } catch (error) {
                const msg = error.response?.data?.message || "Произошла ошибка при удалении";
                setErrorMessage(msg);
            }
        }
    };

    const cancelDelete = () => {
        setCardToDelete(null);
        setErrorMessage('');
    };

    const formattedCards = Array.isArray(cards) ? cards.map(card => {
        const lastFour = card.name ? card.name.slice(-4) : '0000';
        return {
            id: card.id,
            name: `•••• ${lastFour}`,
            icon: (card.icon || 'visa').toLowerCase()
        };
    }) : [];

    const allMethods = [...formattedCards];

    return (
        <div className="modal-overlay" onClick={onClose}>
            {!cardToDelete && (
                <div className="modal-content payment-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Способ оплаты</h2>
                        <button className="close-btn" onClick={onClose}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                    </div>

                    <div className="payment-list">
                        {allMethods.map(method => (
                            <div
                                key={method.id}
                                className="payment-row"
                                onClick={() => onSelect(method.id)}
                            >
                                <div className="payment-left">
                                    <div className={`radio-circle ${selectedMethodId === method.id ? 'active' : ''}`}>
                                        {selectedMethodId === method.id && <div className="radio-dot" />}
                                    </div>
                                    <span className="payment-name">{method.name}</span>
                                    <div className={`card-icon ${method.icon}`}>
                                        {method.icon === 'visa' ? <VisaIcon width="32" height="20" /> : <MastercardIcon width="32" height="20" />}
                                    </div>
                                </div>
                                <button className="delete-card-btn" onClick={(e) => handleDeleteClick(e, method)}>
                                    <svg width="20" height="20" viewBox="0 0 28 28" fill="none"><path d="M22.4717 10.3516C22.5553 9.87576 23.0086 9.55818 23.4844 9.6416C23.9602 9.72527 24.2788 10.1785 24.1953 10.6543L21.8672 23.8916C21.5975 25.4256 20.2655 26.5448 18.708 26.5449H9.29199C7.73449 26.5448 6.40252 25.4256 6.13281 23.8916L3.80469 10.6543C3.72121 10.1785 4.03979 9.72527 4.51562 9.6416C4.99142 9.55817 5.44465 9.87576 5.52832 10.3516L7.85547 23.5889C7.97806 24.2861 8.58412 24.7948 9.29199 24.7949H18.708C19.4158 24.7948 20.022 24.2861 20.1445 23.5889L22.4717 10.3516ZM15.6045 1.46094C17.3763 1.46111 18.8125 2.89812 18.8125 4.66992V6.12793H24.5C24.9832 6.12793 25.375 6.51968 25.375 7.00293C25.375 7.48618 24.9832 7.87793 24.5 7.87793H3.5C3.01675 7.87793 2.625 7.48618 2.625 7.00293C2.625 6.51968 3.01675 6.12793 3.5 6.12793H9.1875V4.66992C9.1875 2.89812 10.6237 1.46111 12.3955 1.46094H15.6045ZM12.3955 3.21094C11.5902 3.21111 10.9375 3.86461 10.9375 4.66992V6.12793H17.0625V4.66992C17.0625 3.86461 16.4098 3.21111 15.6045 3.21094H12.3955Z" fill="#222222"/></svg>
                                </button>
                            </div>
                        ))}
                    </div>

                    <button className="save-btn" onClick={onClose}>Сохранить</button>
                    <button className="add-card-btn" onClick={onAddCard}>Добавить новую карту</button>
                </div>
            )}

            {cardToDelete && (
                <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
                    <div className="modal-header">
                        <h2>Удаление карты</h2>
                        <button className="close-btn" onClick={cancelDelete}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                    </div>

                    <p className="confirm-text">
                        Вы действительно хотите удалить <br/> карту
                        <span className="card-number-highlight">{cardToDelete.name}?</span>
                    </p>

                    {errorMessage && (
                        <div className="error-message-block">
                            {errorMessage}
                        </div>
                    )}

                    <div className="confirm-actions">
                        <button className="modal-btn primary" onClick={cancelDelete}>Нет</button>
                        <button className="modal-btn secondary-outline" onClick={confirmDelete}>Да, удалить карту</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentMethodModal;