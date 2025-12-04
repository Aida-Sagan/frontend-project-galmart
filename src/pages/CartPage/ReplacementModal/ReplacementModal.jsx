import React, { useState, useEffect } from 'react';
import './style/ReplacementModal.css';

const ReplacementModal = ({ isOpen, onClose, initialValue, onSave }) => {

    const [selectedAction, setSelectedAction] = useState('call');

    useEffect(() => {
        if (isOpen) {
            if (initialValue === 'Позвонить и заменить') setSelectedAction('call');
            else if (initialValue === 'Не звонить и заменить') setSelectedAction('replace');
            else if (initialValue === 'Не заменять') setSelectedAction('remove');
            else setSelectedAction('call');
        }
    }, [isOpen, initialValue]);

    if (!isOpen) return null;

    const handleSave = () => {
        let textValue = 'Позвонить и заменить';
        if (selectedAction === 'replace') textValue = 'Не звонить и заменить';
        if (selectedAction === 'remove') textValue = 'Не заменять';

        onSave(textValue);
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content replacement-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Замена товаров</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>

                <div className="replacement-body">
                    {/* Опция 1: Позвонить и заменить */}
                    <div
                        className={`replacement-row ${selectedAction === 'call' ? 'active' : ''}`}
                        onClick={() => setSelectedAction('call')}
                    >
                        <div className="replacement-info">
                            <span className="replacement-title">Позвонить и заменить</span>
                            <span className="replacement-subtitle">Мы свяжемся с вами и предложим замену отсутствующих товаров</span>
                        </div>
                        <div className={`radio-circle ${selectedAction === 'call' ? 'active' : ''}`}>
                            {selectedAction === 'call' && <div className="radio-dot" />}
                        </div>
                    </div>

                    <div className="replacement-divider"></div>

                    {/* Опция 2: Не звонить и заменить */}
                    <div
                        className={`replacement-row ${selectedAction === 'replace' ? 'active' : ''}`}
                        onClick={() => setSelectedAction('replace')}
                    >
                        <div className="replacement-info">
                            <span className="replacement-title">Не звонить и заменить</span>
                            <span className="replacement-subtitle">Мы заменим товары без звонка и согласования</span>
                        </div>
                        <div className={`radio-circle ${selectedAction === 'replace' ? 'active' : ''}`}>
                            {selectedAction === 'replace' && <div className="radio-dot" />}
                        </div>
                    </div>

                    <div className="replacement-divider"></div>

                    {/* Опция 3: Не заменять */}
                    <div
                        className={`replacement-row ${selectedAction === 'remove' ? 'active' : ''}`}
                        onClick={() => setSelectedAction('remove')}
                    >
                        <div className="replacement-info">
                            <span className="replacement-title">Не заменять</span>
                            <span className="replacement-subtitle">Мы удалим товары из заказа без замены и сделаем возврат средств</span>
                        </div>
                        <div className={`radio-circle ${selectedAction === 'remove' ? 'active' : ''}`}>
                            {selectedAction === 'remove' && <div className="radio-dot" />}
                        </div>
                    </div>
                </div>

                <button className="replacement-save-btn" onClick={handleSave}>
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default ReplacementModal;