import React, { useState, useCallback } from 'react';
import Loader from '../../../components/Loader/Loader.jsx';
import { applyPromocode } from '../../../api/services/profileService.js';
import './styles/PromocodesList.css';

const CopyIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.4 20H9.6C9.26863 20 9 19.7314 9 19.4V9.6C9 9.26863 9.26863 9 9.6 9H19.4C19.7314 9 20 9.26863 20 9.6V19.4C20 19.7314 19.7314 20 19.4 20Z" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 9V4.6C15 4.26863 14.7314 4 14.4 4H4.6C4.26863 4 4 4.26863 4 4.6V14.4C4 14.7314 4.26863 15 4.6 15H9" stroke="#222222" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

const mockInfluencerPromocodes = [
    {
        id: 1,
        title: 'Промокод инфлюенсера',
        description: 'Промокод инфлюенсера adinka92 активен с 01.02.2025 - 15.02.2025 г. Промокод даёт скидку в - 1000 тенге.',
        code: 'SRGIE'
    },
    {
        id: 2,
        title: 'Промокод инфлюенсера',
        description: 'Промокод инфлюенсера adinka92 активен с 01.02.2025 - 15.02.2025 г. Промокод даёт скидку в - 1000 тенге.',
        code: 'JHGFR'
    }
];

const PromocodesList = ({ promocodesData, isLoading, error }) => {
    const [newPromoCode, setNewPromoCode] = useState('');
    const [copyStatus, setCopyStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // const influencerPromocodes = promocodesData?.favorites || mockInfluencerPromocodes;
    const influencerPromocodes =
        (promocodesData?.favorites && promocodesData.favorites.length > 0)
            ? promocodesData.favorites
            : mockInfluencerPromocodes;

    const handleCopy = useCallback(async (code, id) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopyStatus(id);
            setTimeout(() => setCopyStatus(null), 2000);
        } catch (err) {
            console.error('Не удалось скопировать текст:', err);
        }
    }, []);

    const handleAddPromoCode = async (e) => {
        e.preventDefault();
        const code = newPromoCode.trim();
        if (!code) return;

        setIsSubmitting(true);
        try {
            await applyPromocode(code);
            alert('Промокод успешно применен!');
            setNewPromoCode('');


            window.location.reload();
        } catch (err) {
            const message = err.response?.data?.message || 'Ошибка при активации промокода';
            alert(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <Loader />;

    if (error) {
        return <p className="error-message">Ошибка при загрузке данных: {error}</p>;
    }

    return (
        <div className="promocodes-list-wrapper">
            <h2 className="content-title">Промокоды</h2>

            {/* Блок 1: Новый промокод */}
            <section className="new-promocode-section">
                <h3 className="section-title-new-promocode">Новый промокод</h3>
                <form onSubmit={handleAddPromoCode} className="new-promocode-form">
                    <div className="form-group promocode-input-wrapper">
                        <input
                            type="text"
                            placeholder="Введите промокод"
                            value={newPromoCode}
                            onChange={(e) => setNewPromoCode(e.target.value)}
                            className="form-input"
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn-add-promocode"
                        disabled={!newPromoCode.trim() || isSubmitting}
                    >
                        {isSubmitting ? '...' : 'Добавить'}
                    </button>
                </form>
            </section>

            {/* Блоки 2 & 3: Промокоды инфлюенсеров */}
            <div className="influencer-promocodes-grid">
                {influencerPromocodes.map(promo => (
                    <div key={promo.id} className="promocode-card">
                        <h3 className="card-title">{promo.title || 'Промокод'}</h3>
                        <p className="card-description-new-promo">{promo.description}</p>

                        <div className="promocode-code-wrapper">
                            <span className="promocode-code">{promo.code}</span>
                            <button
                                className="copy-btn"
                                onClick={() => handleCopy(promo.code, promo.id)}
                            >
                                <CopyIcon />
                                {copyStatus === promo.id && <span className="copy-tooltip">Скопировано!</span>}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {influencerPromocodes.length === 0 && (
                <p className="no-promocodes-message">У вас пока нет активных промокодов.</p>
            )}
        </div>
    );
};

export default PromocodesList;