import React, { useState, useEffect } from 'react';
import './style/DeliveryPreferencesModal.css';

const DeliveryPreferencesModal = ({ isOpen, onClose, initialData, onSave }) => {
    const [preference, setPreference] = useState('on_time');
    const [leaveAtDoor, setLeaveAtDoor] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setPreference(initialData.deliveryTimePreferences || 'on_time');
            setLeaveAtDoor(initialData.leaveAtDoor || false);
        }
    }, [isOpen, initialData]);

    if (!isOpen) return null;

    const handleSave = () => {
        onSave({
            deliveryTimePreferences: preference,
            leaveAtDoor: leaveAtDoor
        });
        onClose();
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content pref-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2 className="modal-header-title">Пожелания по доставке</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                </div>

                <div className="pref-body">
                    <div
                        className={`pref-row ${preference === 'on_time' ? 'active' : ''}`}
                        onClick={() => setPreference('on_time')}
                    >
                        <div className="pref-info">
                            <span className="pref-title">В указанное время</span>
                            <span className="pref-subtitle">Доставим точно в выбранный вами интервал</span>
                        </div>
                        <div className={`radio-circle ${preference === 'on_time' ? 'active' : ''}`}>
                            {preference === 'on_time' && <div className="radio-dot" />}
                        </div>
                    </div>

                    <div className="pref-divider"></div>

                    <div
                        className={`pref-row ${preference === 'early' ? 'active' : ''}`}
                        onClick={() => setPreference('early')}
                    >
                        <div className="pref-info">
                            <span className="pref-title">По возможности раньше</span>
                            <span className="pref-subtitle">Постараемся привезти пораньше</span>
                        </div>
                        <div className={`radio-circle ${preference === 'early' ? 'active' : ''}`}>
                            {preference === 'early' && <div className="radio-dot" />}
                        </div>
                    </div>

                    <div className="pref-divider"></div>

                    <div
                        className={`pref-row ${leaveAtDoor ? 'active' : ''}`}
                        onClick={() => setLeaveAtDoor(!leaveAtDoor)}
                    >
                        <div className="pref-info">
                            <span className="pref-title">Оставить у двери</span>
                            <span className="pref-subtitle">Оставим у двери и сообщим о доставке</span>
                        </div>
                        <div className={`checkbox-square ${leaveAtDoor ? 'checked' : ''}`}>
                            {leaveAtDoor && (
                                <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                                    <path d="M1 5L4.5 8.5L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                <button className="pref-save-btn" onClick={handleSave}>
                    Сохранить
                </button>
            </div>
        </div>
    );
};

export default DeliveryPreferencesModal;