import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader/Loader.jsx';
import { deleteSavedCard, attachNewCard } from '../../../api/services/cartService.js';
import './styles/PaymentMethods.css';

const DeleteIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.75 3C12.75 2.58579 12.4142 2.25 12 2.25C11.5858 2.25 11.25 2.58579 11.25 3V3.5H4.5C4.08579 3.5 3.75 3.83579 3.75 4.25C3.75 4.66421 4.08579 5 4.5 5H19.5C19.9142 5 20.25 4.66421 20.25 4.25C20.25 3.83579 19.9142 3.5 19.5 3.5H12.75V3ZM5.25 6.5V19.75C5.25 20.6784 6.00761 21.436 6.93604 21.436H17.064C17.9924 21.436 18.75 20.6784 18.75 19.75V6.5H17.25V19.75C17.25 19.8328 17.1828 19.9 17.1001 19.9H6.89989C6.81719 19.9 6.75 19.8328 6.75 19.75V6.5H5.25ZM11.25 8.5C11.25 8.08579 11.5858 7.75 12 7.75C12.4142 7.75 12.75 8.08579 12.75 8.5V16.5C12.75 16.9142 12.4142 17.25 12 17.25C11.5858 17.25 11.25 16.9142 11.25 16.5V8.5Z" fill="#222222"/>
    </svg>
);

const DeleteCardModal = ({ isOpen, card, onConfirm, onCancel }) => {
    if (!isOpen || !card) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Удаление карты</h3>
                    <button className="close-btn" onClick={onCancel}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M18 6L6 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M6 6L18 18" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>
                <p>Вы действительно хотите удалить карту .... {card.number}?</p>
                <div className="modal-actions">
                    <button className="btn btn-cancel" onClick={onCancel}>Нет</button>
                    <button className="btn btn-confirm" onClick={onConfirm}>Да, удалить карту</button>
                </div>
            </div>
        </div>
    );
};

const PaymentMethodsList = ({ cardsData, isLoading, error, refreshCards }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const paymentCards = Array.isArray(cardsData) ? cardsData : [];

    useEffect(() => {
        if (refreshCards) refreshCards();
    }, []);

    const handleAddCard = async () => {
        try {
            setIsRedirecting(true);
            const response = await attachNewCard();

            const redirectUrl = response?.data?.url || response?.url;

            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                alert('Не удалось получить ссылку для привязки карты. Проверьте ответ API.');
            }
        } catch (err) {
            alert('Ошибка при подготовке привязки карты');
        } finally {
            setIsRedirecting(false);
        }
    };

    const handleDeleteClick = (card, event) => {
        if (event) event.stopPropagation();
        setCardToDelete(card);
        setIsModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (cardToDelete) {
            try {
                await deleteSavedCard(cardToDelete.id);
                if (refreshCards) refreshCards();
            } catch (err) {
                alert('Не удалось удалить карту');
            }
        }
        setIsModalOpen(false);
        setCardToDelete(null);
    };

    if (isLoading || isRedirecting) return <Loader />;
    if (error) return <p className="error-message">{error}</p>;

    return (
        <div className="payment-methods-section">
            <h2 className="content-title">Способы оплаты</h2>

            {paymentCards.length === 0 ? (
                <div className="no-cards-message">
                    <p>У вас пока нет сохраненных карт.</p>
                </div>
            ) : (
                <div className="payment-cards-list">
                    {paymentCards.map(card => (
                        <div
                            key={card.id}
                            className={`payment-card-item ${card.isMain ? 'main-card' : ''}`}
                        >
                            <div className="card-info">
                                <span className={`main-indicator ${card.isMain ? 'main' : 'default'}`}>
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="#902067" strokeWidth="1.5" fill="white" />
                                        {card.isMain && <circle cx="12" cy="12" r="6" fill="#902067" />}
                                        {card.isMain && <circle cx="12" cy="12" r="2.5" fill="white" />}
                                    </svg>
                                </span>
                                <span className="card-number">.... {card.number}</span>
                                <span className="card-type-label">{card.type}</span>
                            </div>
                            <button
                                className="delete-card-btn"
                                onClick={(e) => handleDeleteClick(card, e)}
                            >
                                <DeleteIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button className="add-card-btn" onClick={handleAddCard}>
                Добавить новую карту
            </button>

            <DeleteCardModal
                isOpen={isModalOpen}
                card={cardToDelete}
                onConfirm={handleConfirmDelete}
                onCancel={() => setIsModalOpen(false)}
            />
        </div>
    );
};

export default PaymentMethodsList;