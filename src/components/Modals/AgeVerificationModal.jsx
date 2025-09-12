import React from 'react';
import './style/AgeVerificationModal.css';

const AgeVerificationModal = ({ isOpen, onConfirm, onDecline }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="age-modal-overlay">
            <div className="age-modal-content">
                <button className="age-modal-close-btn" onClick={onDecline}>&times;</button>
                <h2>Вам уже исполнился 21 год?</h2>
                <p>
                    В данном разделе размещены товары для лиц, достигших 21 года.
                    Пожалуйста, подтвердите ваш возраст для продолжения просмотра.
                </p>
                <div className="age-modal-actions">
                    <button className="age-modal-btn primary" onClick={onConfirm}>
                        Да, мне есть 21 год
                    </button>
                    <button className="age-modal-btn secondary" onClick={onDecline}>
                        Нет
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgeVerificationModal;