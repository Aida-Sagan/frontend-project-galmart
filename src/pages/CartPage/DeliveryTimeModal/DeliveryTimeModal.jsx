import React, { useState, useEffect } from 'react';
import { getDeliveryTimes, setDeliveryTime } from '../../../api/services/cartService';
import './style/DeliveryTimeModal.css';

const formatTabLabel = (title, dateStr) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);

    const dayMonth = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });

    if (title) return `${title}, ${dayMonth}`;
    return dayMonth;
};

const DeliveryTimeModal = ({ isOpen, onClose, onSaveSuccess }) => {
    const [datesData, setDatesData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeDateIndex, setActiveDateIndex] = useState(0);
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setLoading(true);
            getDeliveryTimes()
                .then(response => {
                    const daysList = response.data || [];
                    setDatesData(daysList);


                    for (let i = 0; i < daysList.length; i++) {
                        const day = daysList[i];
                        const firstAvailableSlot = day.times.find(t => t.available);

                        if (firstAvailableSlot) {
                            setActiveDateIndex(i);
                            setSelectedSlot({
                                date: day.date,
                                time: firstAvailableSlot.time
                            });
                            break;
                        }
                    }
                })
                .catch(err => console.error("Ошибка загрузки времени:", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen]);

    const handleSave = async () => {
        if (!selectedSlot) return;
        setIsSaving(true);
        try {
            await setDeliveryTime(selectedSlot.date, selectedSlot.time);
            if (onSaveSuccess) onSaveSuccess();
            onClose();
        } catch (error) {
            console.error(error);
            alert("Не удалось сохранить время");
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    const currentDayData = datesData[activeDateIndex];

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-delivery-time" onClick={e => e.stopPropagation()}>
                <div className="delivery-modal-header">
                    <h2>Время доставки</h2>
                    <button className="modal-close-btn" onClick={onClose}>&times;</button>
                </div>

                {loading ? (
                    <div style={{padding: '40px', textAlign: 'center'}}>Загрузка...</div>
                ) : (
                    <>
                        <div className="date-tabs-container">
                            {datesData.map((dayItem, index) => (
                                <button
                                    key={dayItem.date}
                                    className={`date-tab ${activeDateIndex === index ? 'active' : ''}`}
                                    onClick={() => setActiveDateIndex(index)}
                                >
                                    {formatTabLabel(dayItem.title, dayItem.date)}
                                </button>
                            ))}
                        </div>

                        <div className="time-slots-list">
                            {currentDayData && currentDayData.times && currentDayData.times.length > 0 ? (
                                currentDayData.times.map((slotItem, idx) => {
                                    const isSelected = selectedSlot?.date === currentDayData.date && selectedSlot?.time === slotItem.time;
                                    const isAvailable = slotItem.available;

                                    return (
                                        <div
                                            key={idx}
                                            className={`time-slot-item ${isSelected ? 'selected' : ''} ${!isAvailable ? 'disabled' : ''}`}
                                            onClick={() => {
                                                if (isAvailable) {
                                                    setSelectedSlot({ date: currentDayData.date, time: slotItem.time });
                                                }
                                            }}
                                        >
                                            <span className="time-slot-label">{slotItem.time}</span>

                                            {isAvailable && <div className="custom-radio"></div>}
                                        </div>
                                    )
                                })
                            ) : (
                                <div className="no-slots-message">
                                    <h3>Нет доступных слотов</h3>
                                    <p>К сожалению, на данный момент нет доступных слотов для доставки на этот день</p>
                                </div>
                            )}
                        </div>

                        <button
                            className="delivery-save-btn"
                            onClick={handleSave}
                            disabled={isSaving || !selectedSlot}
                        >
                            {isSaving ? 'Сохранение...' : 'Сохранить'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default DeliveryTimeModal;