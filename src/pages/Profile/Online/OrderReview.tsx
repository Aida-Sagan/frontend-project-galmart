import React, { useState } from 'react';
import './styles/OrderReview.css';

const OrderReview = ({ onBack, onSubmit }) => {
    const [ratings, setRatings] = useState({
        1: 0,
        2: 0,
        3: 0
    });
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const categories = [
        { id: 1, label: 'Ассортимент', sub: 'Нашли ли вы всё, что искали?' },
        { id: 2, label: 'Качество продуктов', sub: 'Довольны ли вы качеством продукции?' },
        { id: 3, label: 'Доставка', sub: 'Был ли курьер вежлив?' }
    ];


    const handleRate = (catId, value) => {
        if (isSubmitting) return;
        setRatings(prev => ({ ...prev, [catId]: value }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(prev => [...prev, ...files].slice(0, 3));
    };

    const handleFormSubmit = async () => {
        const hasAllRatings = Object.values(ratings).every(r => r > 0);
        if (!hasAllRatings) {
            alert("Пожалуйста, оцените все категории");
            return;
        }

        setIsSubmitting(true);
        try {
            const payload = {
                stars: [
                    { item: 1, value: ratings[1] },
                    { item: 2, value: ratings[2] },
                    { item: 3, value: ratings[3] }
                ],
                comment: comment
            };

            await onSubmit(payload);
        } catch (error) {
            console.error("Review submit error:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="order-review-container">
            <button className="back-navigation" onClick={onBack} disabled={isSubmitting}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.53033 7.46967C8.82322 7.76256 8.82322 8.23744 8.53033 8.53033L5.81066 11.25H20.5C20.9142 11.25 21.25 11.5858 21.25 12C21.25 12.4142 20.9142 12.75 20.5 12.75H5.81066L8.53033 15.4697C8.82322 15.7626 8.82322 16.2374 8.53033 16.5303C8.23744 16.8232 7.76256 16.8232 7.46967 16.5303L3.46967 12.5303C3.17678 12.2374 3.17678 11.7626 3.46967 11.4697L7.46967 7.46967C7.76256 7.17678 8.23744 7.17678 8.53033 7.46967Z" fill="#222222"/>
                </svg>

                Вернуться к заказу
            </button>

            <h1 className="review-main-title">Оценка заказа</h1>

            <div className="review-sections-list">
                {categories.map((cat) => (
                    <div key={cat.id} className="review-card-item">
                        <div className="review-text-group">
                            <h3 className="review-label">{cat.label}</h3>
                            <p className="review-sublabel">{cat.sub}</p>
                        </div>
                        <div className="star-rating-row">
                            {[1, 2, 3, 4, 5].map((star) => {
                                const isFilled = ratings[cat.id] >= star;

                                return (
                                    <span
                                        key={star}
                                        className={`star-icon ${isFilled ? 'filled' : ''}`}
                                        onClick={() => handleRate(cat.id, star)}
                                        style={{ cursor: 'pointer', display: 'inline-flex', padding: '4px' }}
                                    >
                                        <svg
                                            style={{ pointerEvents: 'none' }}
                                            width="38" height="38"
                                            viewBox="0 0 38 38"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path

                                                fill={isFilled ? "#902067" : "#FBFBFB"}
                                                stroke="#902067"
                                                strokeWidth="1.5"
                                                fillRule="evenodd"
                                                clipRule="evenodd"
                                                d="M18.8638 5.18061C18.8328 5.19888 18.8003 5.22798 18.7725 5.28391L14.6598 13.5682C14.4864 13.9174 14.1527 14.1593 13.7669 14.2154L4.56959 15.552C4.35566 15.5831 4.28982 15.8303 4.42887 15.9649L11.0828 22.4088C11.3649 22.682 11.4937 23.0768 11.4269 23.4637L9.85658 32.5673C9.84611 32.628 9.85522 32.6687 9.86851 32.6994C9.88381 32.7346 9.91215 32.7721 9.95432 32.8025C9.99648 32.833 10.0426 32.8493 10.0843 32.8531C10.1213 32.8566 10.1668 32.8518 10.2246 32.8216L18.4492 28.5221C18.7939 28.3418 19.205 28.3418 19.5497 28.5221L27.7744 32.8226C27.8322 32.8518 27.8777 32.8566 27.9146 32.8531C27.9564 32.8493 28.0025 32.833 28.0446 32.8025C28.0868 32.7721 28.1151 32.7346 28.1304 32.6994C28.1437 32.6687 28.1528 32.628 28.1424 32.5673L26.572 23.4637C26.5053 23.0768 26.6341 22.682 26.9161 22.4088L33.5701 15.9649C33.7091 15.8303 33.6433 15.5831 33.4294 15.552L24.232 14.2154C23.8462 14.1593 23.5125 13.9174 23.3392 13.5682L19.2264 5.28391C19.1987 5.22798 19.1662 5.19888 19.1352 5.18061C19.0999 5.15982 19.0529 5.14575 18.9995 5.14575C18.9461 5.14575 18.899 5.15982 18.8638 5.18061Z"
                                            />
                                        </svg>
                                    </span>
                                );
                            })}
                        </div>
                    </div>
                ))}

                <div className="review-card-item">
                    <div className="review-text-group">
                        <h3 className="review-label">Добавьте фото</h3>
                        <p className="review-sublabel">Если это необходимо</p>
                    </div>
                    <div className="photo-upload-grid">
                        <label className="upload-placeholder main-upload">
                            <input
                                type="file"
                                hidden
                                multiple
                                accept="image/*"
                                onChange={handlePhotoChange}
                                disabled={isSubmitting}
                            />
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                <circle cx="8.5" cy="8.5" r="1.5"/>
                                <polyline points="21 15 16 10 5 21"/>
                                <line x1="16" y1="5" x2="16" y2="11"/>
                                <line x1="13" y1="8" x2="19" y2="8"/>
                            </svg>
                        </label>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="upload-placeholder empty">
                                {photos[i-1] && <span style={{fontSize: '10px'}}>Загружено</span>}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="review-card-item vertical">
                    <h3 className="review-label">Оставьте комментарий</h3>
                    <textarea
                        className="review-textarea"
                        placeholder="..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        disabled={isSubmitting}
                    />
                </div>
            </div>

            <button
                className={`submit-review-btn ${isSubmitting ? 'loading' : ''}`}
                onClick={handleFormSubmit}
                disabled={isSubmitting}
            >
                {isSubmitting ? 'Отправка...' : 'Отправить оценку'}
            </button>
        </div>
    );
};

export default OrderReview;