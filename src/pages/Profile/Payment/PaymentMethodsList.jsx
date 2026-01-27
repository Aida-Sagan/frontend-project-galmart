import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader/Loader.jsx';
import { deleteSavedCard, attachNewCard } from '../../../api/services/cartService.js';
import { ReactComponent as VisaIcon } from '../../../assets/svg/visa.svg';
import { ReactComponent as MastercardIcon } from '../../../assets/svg/mastercard.svg';
import './styles/PaymentMethods.css';

const DeleteIcon = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.4521 7.57324C18.8261 7.63899 19.0764 7.99521 19.0107 8.36914L17.1816 18.7695C16.9698 19.9748 15.9229 20.8544 14.6992 20.8545H7.30078C6.07706 20.8544 5.03027 19.9748 4.81836 18.7695L2.98926 8.36914C2.92355 7.99521 3.17392 7.63899 3.54785 7.57324C3.92168 7.50762 4.27792 7.75707 4.34375 8.13086L6.17285 18.5322C6.26935 19.0798 6.74477 19.4794 7.30078 19.4795H14.6992C15.2552 19.4794 15.7307 19.0798 15.8271 18.5322L17.6562 8.13086C17.7221 7.75708 18.0783 7.50762 18.4521 7.57324ZM12.2607 1.14551C13.6528 1.14568 14.7812 2.27489 14.7812 3.66699V4.8125H19.25C19.6297 4.8125 19.9375 5.1203 19.9375 5.5C19.9375 5.8797 19.6297 6.1875 19.25 6.1875H2.75C2.3703 6.1875 2.0625 5.8797 2.0625 5.5C2.0625 5.1203 2.3703 4.8125 2.75 4.8125H7.21875V3.66699C7.21875 2.27488 8.34719 1.14568 9.73926 1.14551H12.2607ZM9.73926 2.52051C9.10658 2.52068 8.59375 3.03427 8.59375 3.66699V4.8125H13.4062V3.66699C13.4062 3.03427 12.8934 2.52068 12.2607 2.52051H9.73926Z" fill="#222222"/>
    </svg>

);

const DeleteCardModal = ({ isOpen, card, onConfirm, onCancel }) => {
    if (!isOpen || !card) return null;
    const displayNum = card.name ? card.name.split('...').pop() : '';

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h3>Удаление карты</h3>
                    <button className="close-btn" onClick={onCancel}>
                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M8.30276 8.30271C8.69329 7.91218 9.32645 7.91218 9.71698 8.30271L16.0001 14.5858L22.2831 8.30271C22.6737 7.91218 23.3068 7.91218 23.6973 8.30271C24.0879 8.69323 24.0879 9.3264 23.6973 9.71692L17.4143 16L23.6973 22.2831C24.0879 22.6736 24.0879 23.3068 23.6973 23.6973C23.3068 24.0878 22.6737 24.0878 22.2831 23.6973L16.0001 17.4142L9.71698 23.6973C9.32645 24.0878 8.69329 24.0878 8.30276 23.6973C7.91224 23.3068 7.91224 22.6736 8.30276 22.2831L14.5858 16L8.30276 9.71692C7.91224 9.3264 7.91224 8.69323 8.30276 8.30271Z" fill="#7A7A7A"/>
                        </svg>

                    </button>
                </div>
                <p className="logout-modal-text">Вы действительно хотите удалить карту .... {displayNum}?</p>
                <div className="logout-modal-actions">
                    <button className="btn-primary-large" onClick={onConfirm}>Да, удалить карту</button>
                    <button className="btn-outline-cancel" onClick={onCancel}>Нет</button>
                </div>
            </div>
        </div>
    );
};

const PaymentMethodsList = ({ cardsData, isLoading, refreshCards }) => {
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
            const url = await attachNewCard();

            if (url) {
                window.location.href = url;
            } else {
                alert("Не удалось получить ссылку для привязки карты");
            }
        } catch (e) {
            console.error("Error adding card:", e);
            alert("Ошибка при попытке добавить карту");
        } finally {
            setIsRedirecting(false);
        }
    };

    const formatCardName = (name) => {
        if (!name) return "";
        const lastDigits = name.includes('...')
            ? name.split('...').pop()
            : name.slice(-4);
        return `.... ${lastDigits}`;
    };



    const handleConfirmDelete = async () => {
        if (cardToDelete) {
            try {
                await deleteSavedCard(cardToDelete.id);
                if (refreshCards) refreshCards();
                setIsModalOpen(false);
                setCardToDelete(null);
            } catch (err) {

                const errorMessage = err.response?.data?.message || 'Не удалось удалить карту';
                alert(errorMessage);


                setIsModalOpen(false);
                setCardToDelete(null);
            }
        }
    };
    if (isLoading || isRedirecting) return <Loader />;

    return (
        <div className="payment-methods-section">
            <h2 className="content-title-payment">Способы оплаты</h2>

            {paymentCards.length === 0 ? (
                <div className="no-cards-message">
                    <p>У вас пока нет сохраненных карт.</p>
                </div>
            ) : (
                <div className="payment-cards-list">
                    {paymentCards.map(card => (
                        <div key={card.id} className="payment-card-row">
                            <div className="card-info-left">
                                <div className={`radio-indicator ${card.is_favorite ? 'active' : ''}`}>
                                    {card.is_favorite && <div className="radio-dot" />}
                                </div>
                                <span className="card-number-text">
                                    {formatCardName(card.name)}
                                </span>
                                {card.icon === 'VISA' ? (
                                    <VisaIcon />
                                ) : (
                                    <MastercardIcon />
                                )}
                            </div>
                            <button className="delete-icon-btn" onClick={() => { setCardToDelete(card); setIsModalOpen(true); }}>
                                <DeleteIcon />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <button className="add-card-full-btn" onClick={handleAddCard}>
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