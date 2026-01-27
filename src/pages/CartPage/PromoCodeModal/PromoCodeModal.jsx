import React, { useState } from 'react';
import './style/PromoCodeModal.css';

const PromoCodeModal = ({ isOpen, onClose, onApply }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!isOpen) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!code.trim()) return;

        setIsLoading(true);
        setError(null);

        try {
            await onApply(code);
            setCode('');
            onClose();
        } catch (err) {
            console.error("Promo error:", err);

            let errorMessage = "Произошла ошибка при применении промокода";

            if (err.response) {
                const status = err.response.status;
                const detail = err.response.data?.detail || "";

                if (status === 404) {
                    errorMessage = "Промокод не найден";
                } else if (status === 400) {
                    errorMessage = "Неверный формат промокода или срок истек";
                } else if (status === 403) {
                    errorMessage = "Этот промокод недоступен для вас";
                } else if (status === 429) {
                    errorMessage = "Слишком много попыток. Попробуйте позже";
                }
                // 2. Если сервер прислал специфичный текст на английском, можно перехватить его
                else if (typeof detail === 'string') {
                    if (detail.toLowerCase().includes('exist')) {
                        errorMessage = "Такого промокода не существует";
                    } else if (detail.toLowerCase().includes('expired')) {
                        errorMessage = "Срок действия промокода истек";
                    } else if (detail.toLowerCase().includes('limit')) {
                        errorMessage = "Превышен лимит использования";
                    } else {
                        // Если ошибка неизвестная, но есть текст - показываем его (или оставляем дефолтную)
                        // errorMessage = detail;
                    }
                }
            } else if (err.message === "Network Error") {
                errorMessage = "Нет соединения с интернетом";
            }

            setError(errorMessage);
            // -----------------------------------------

        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content promo-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Промокод</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="promo-form">
                    <div className="input-wrapper-promocode">
                        <input
                            type="text"
                            placeholder="Введите промокод"
                            value={code}
                            onChange={(e) => {
                                setCode(e.target.value);
                                setError(null);
                            }}
                            className={`promo-input ${error ? 'error' : ''}`}
                        />
                    </div>

                    {error && <div className="promo-error">{error}</div>}

                    <button
                        type="submit"
                        className="modal-btn secondary apply-btn"
                        disabled={!code.trim() || isLoading}
                    >
                        {isLoading ? 'Применяем...' : 'Применить'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PromoCodeModal;