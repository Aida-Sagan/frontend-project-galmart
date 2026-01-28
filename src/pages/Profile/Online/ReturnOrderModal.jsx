import React, { useState } from 'react';
import { orderReturn } from '../../../api/services/ordersService.js';
import './styles/ReturnOrderModal.css';

const ReturnOrderModal = ({ orderNumber, items, onClose, orderId }) => {
    const [requestType, setRequestType] = useState('return'); // 'return' | 'replace'
    const [selectedItems, setSelectedItems] = useState({});
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const displayItems = items || [];

    const toggleItem = (id) => {
        const newSelected = { ...selectedItems };
        if (newSelected[id]) {
            delete newSelected[id];
        } else {
            newSelected[id] = 1;
        }
        setSelectedItems(newSelected);
    };

    const updateQuantity = (id, delta, type) => {
        if (type === 'weight' || !selectedItems[id]) return;

        const originalItem = displayItems.find(item => item.id === id);
        const maxAvailable = originalItem ? originalItem.quantity : 1;

        const currentQty = selectedItems[id] || 1;
        const newQty = currentQty + delta;

        if (newQty >= 1 && newQty <= maxAvailable) {
            setSelectedItems({ ...selectedItems, [id]: newQty });
        }
    };

    const words = comment.trim().split(/\s+/).filter(word => word.length > 0);
    const isFormValid =
        Object.keys(selectedItems).length > 0 &&
        words.length >= 4 &&
        photos.length > 0 &&
        !isSubmitted &&
        !isSuccess;

    const handlePhotoUpload = (e) => {
        if (e.target.files && e.target.files[0] && photos.length < 3) {
            setPhotos([...photos, URL.createObjectURL(e.target.files[0])]);
        }
    };

    const handleSubmit = async () => {
        if (!isFormValid) return;

        setIsSubmitted(true);

        // Формируем массив товаров для API
        const formattedItems = Object.keys(selectedItems).map(id => ({
            id: parseInt(id),
            quantity: selectedItems[id]
        }));

        const payload = {
            type: requestType,
            items: formattedItems,
            comment: comment,
            photos: photos
        };

        try {
            await orderReturn(orderId, payload);
            setIsSuccess(true);

            setTimeout(() => {
                onClose();
            }, 2000);
        } catch (error) {
            console.error("Ошибка при отправке заявки:", error);
            alert("Не удалось отправить заявку. Попробуйте позже.");
        } finally {
            setIsSubmitted(false);
        }
    };


    return (
        <div className="modal-overlay">
            <div className="return-modal-container">
                <div className="return-modal-header">
                    <h2>Заказ №{orderNumber}</h2>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                <div className="return-modal-content">
                    {/* Тип заявки */}
                    <div className="request-type-selector">
                        <div className={`type-option ${requestType === 'return' ? 'active' : ''}`} onClick={() => setRequestType('return')}>
                            <div className="option-text">
                                <strong style={{color: requestType === 'return' ? '#222222' : '#7A7A7A'}}>Возврат товаров</strong>
                                <span>Выберите, если хотите вернуть средства за товары</span>
                            </div>
                            <div className="radio-circle"></div>
                        </div>
                        <div className="divider-line"></div>
                        <div className={`type-option ${requestType === 'replace' ? 'active' : ''}`} onClick={() => setRequestType('replace')}>
                            <div className="option-text">
                                <strong style={{color: requestType === 'replace' ? '#222222' : '#7A7A7A'}}>Замена товаров</strong>
                                <span>Выберите, если хотите заменить товары</span>
                            </div>
                            <div className="radio-circle"></div>
                        </div>
                    </div>

                    {/* Список товаров */}
                    <div className="return-items-list">
                        {displayItems.map(item => {
                            const isSelected = !!selectedItems[item.id];
                            return (
                                <div key={item.id} className={`return-item-row ${isSelected ? 'selected' : 'dimmed'}`}>
                                    <div className="checkbox-wrapper" onClick={() => toggleItem(item.id)}>
                                        <div className={`custom-checkbox ${isSelected ? 'checked' : ''}`}></div>
                                    </div>
                                    <div className="item-img-box">
                                        <img src={item.photos?.[0]} alt={item.title} style={{width: '100%', borderRadius: '4px'}} />
                                    </div>
                                    <div className="item-info-main">
                                        <p>{item.title}</p>
                                        <div className="quantity-controls">
                                            <button
                                                disabled={item.unit_code === 'kg' || !isSelected}
                                                onClick={() => updateQuantity(item.id, -1, item.unit_code === 'kg' ? 'weight' : 'unit')}
                                            >−</button>
                                            <span>{isSelected ? selectedItems[item.id] : 1} {item.unit}</span>
                                            <button
                                                disabled={item.unit_code === 'kg' || !isSelected}
                                                onClick={() => updateQuantity(item.id, 1, item.unit_code === 'kg' ? 'weight' : 'unit')}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Фото */}
                    <div className="photo-upload-section">
                        <h3>Добавьте фото</h3>
                        <p>Обязательно приложите фото товаров, которые хотите вернуть или заменить</p>
                        <div className="photo-grid">
                            <label className="upload-box" style={{backgroundColor: photos.length >= 3 ? '#DBDBDB' : '#B54A92'}}>
                                <input type="file" hidden onChange={handlePhotoUpload} disabled={photos.length >= 3}/>
                                <svg width="29" height="29" viewBox="0 0 29 29" fill="none">
                                    <path d="M22.959 18.4268C23.4592 18.427 23.8651 18.8328 23.8652 19.333V22.0518H26.584C27.0842 22.052 27.4901 22.4578 27.4902 22.958C27.4902 23.4584 27.0843 23.864 26.584 23.8643H23.8652V26.583C23.8652 27.0834 23.4593 27.489 22.959 27.4893C22.4585 27.4893 22.0527 27.0835 22.0527 26.583V23.8643H19.334C18.8335 23.8643 18.4277 23.4585 18.4277 22.958C18.4279 22.4576 18.8336 22.0518 19.334 22.0518H22.0527V19.333C22.0529 18.8326 22.4586 18.4268 22.959 18.4268Z" fill="#FBFBFB"/>
                                    <path d="M24.6504 2.71875C25.5511 2.71886 26.281 3.44895 26.2812 4.34961V15.708C26.2812 16.2085 25.8755 16.6143 25.375 16.6143C24.8746 16.6142 24.4688 16.2085 24.4688 15.708V4.53125H4.53125V17.958L11.7266 14.875C11.9608 14.7747 12.227 14.7783 12.459 14.8838L19.1045 17.9043C19.56 18.1115 19.7618 18.6489 19.5547 19.1045C19.3475 19.56 18.8101 19.7608 18.3545 19.5537L12.0732 16.6992L4.53125 19.9307V24.4688H15.709C16.2093 24.469 16.6152 24.8746 16.6152 25.375C16.6152 25.8754 16.2093 26.281 15.709 26.2812H4.35059C3.4498 26.2812 2.71896 25.5511 2.71875 24.6504V4.34961C2.71896 3.44887 3.4498 2.71875 4.35059 2.71875H24.6504ZM19.334 6.34375C21.169 6.344 22.6562 7.83195 22.6562 9.66699C22.6561 11.5019 21.1689 12.989 19.334 12.9893C17.4989 12.9893 16.0109 11.502 16.0107 9.66699C16.0107 7.8318 17.4988 6.34375 19.334 6.34375ZM19.334 8.15625C18.4998 8.15625 17.8232 8.83281 17.8232 9.66699C17.8234 10.501 18.4999 11.1768 19.334 11.1768C20.1678 11.1765 20.8436 10.5009 20.8438 9.66699C20.8438 8.83297 20.1679 8.1565 19.334 8.15625Z" fill="#FBFBFB"/>
                                </svg>
                            </label>
                            {photos.map((p, i) => (
                                <div key={i} className="photo-preview-item">
                                    <img src={p} alt="uploaded" />
                                </div>
                            ))}
                            {[...Array(Math.max(0, 3 - photos.length))].map((_, i) => (
                                <div key={i} className="photo-placeholder"></div>
                            ))}
                        </div>
                    </div>

                    {/* Комментарий */}
                    <div className="comment-section">
                        <h3>Оставьте комментарий</h3>
                        <p>Это поле обязательно для заполнения</p>
                        <textarea
                            placeholder="здесь минимум 4 слова, поле расширяется бесконечно"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                        />
                    </div>
                </div>

                <div className="return-modal-footer">
                    <button
                        className="btn-submit-request"
                        disabled={!isFormValid}
                        onClick={handleSubmit}
                        style={{ backgroundColor: isFormValid ? '#902067' : '#DBDBDB' }}
                    >
                        {isSubmitted ? 'Отправка...' : isSuccess ? 'Заявка отправлена' : 'Отправить заявку'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ReturnOrderModal;