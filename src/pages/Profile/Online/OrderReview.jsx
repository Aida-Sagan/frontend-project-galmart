import React, { useState } from 'react';
import './styles/OrderReview.css';

const OrderReview = ({ onBack, onSubmit }) => {
    const [ratings, setRatings] = useState({
        assortment: 0,
        quality: 0,
        delivery: 0
    });
    const [comment, setComment] = useState('');
    const [photos, setPhotos] = useState([]);

    const categories = [
        { id: 'assortment', label: 'Ассортимент', sub: 'Нашли ли вы всё, что искали?' },
        { id: 'quality', label: 'Качество продуктов', sub: 'Довольны ли вы качеством продукции?' },
        { id: 'delivery', label: 'Доставка', sub: 'Был ли курьер вежлив?' }
    ];

    const handleRate = (catId, value) => {
        setRatings(prev => ({ ...prev, [catId]: value }));
    };

    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        setPhotos(prev => [...prev, ...files].slice(0, 3));
    };

    return (
        <div className="order-review-container">
            <button className="back-navigation" onClick={onBack}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
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
                            {[1, 2, 3, 4, 5].map((star) => (
                                <span
                                    key={star}
                                    className={`star-icon ${ratings[cat.id] >= star ? 'filled' : ''}`}
                                    onClick={() => handleRate(cat.id, star)}
                                >
                                    <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.8638 5.18061C18.8328 5.19888 18.8003 5.22798 18.7725 5.28391L14.6598 13.5682C14.4864 13.9174 14.1527 14.1593 13.7669 14.2154L4.56959 15.552C4.35566 15.5831 4.28982 15.8303 4.42887 15.9649L11.0828 22.4088C11.3649 22.682 11.4937 23.0768 11.4269 23.4637L9.85658 32.5673C9.84611 32.628 9.85522 32.6687 9.86851 32.6994C9.88381 32.7346 9.91215 32.7721 9.95432 32.8025C9.99648 32.833 10.0426 32.8493 10.0843 32.8531C10.1213 32.8566 10.1668 32.8518 10.2246 32.8216L18.4492 28.5211C18.7939 28.3408 19.205 28.3408 19.5497 28.5211L27.7744 32.8216C27.8322 32.8518 27.8777 32.8566 27.9146 32.8531C27.9564 32.8493 28.0025 32.833 28.0446 32.8025C28.0868 32.7721 28.1151 32.7346 28.1304 32.6994C28.1437 32.6687 28.1528 32.628 28.1424 32.5673L26.572 23.4637C26.5053 23.0768 26.6341 22.682 26.9161 22.4088L33.5701 15.9649C33.7091 15.8303 33.6433 15.5831 33.4294 15.552L24.232 14.2154C23.8462 14.1593 23.5125 13.9174 23.3392 13.5682L19.2264 5.28391C19.1987 5.22798 19.1662 5.19888 19.1352 5.18061C19.0999 5.15982 19.0529 5.14575 18.9995 5.14575C18.9461 5.14575 18.899 5.15982 18.8638 5.18061ZM16.6452 4.22783C17.6097 2.28506 20.3892 2.28506 21.3537 4.22783L25.1896 11.9546L33.7709 13.2017C35.9171 13.5136 36.7919 16.1509 35.2223 17.671L29.0191 23.6784L30.4828 32.1636C30.8543 34.3173 28.5875 35.9268 26.6739 34.9263L18.9995 30.9134L11.325 34.9263C9.41147 35.9268 7.14463 34.3173 7.51615 32.1636L8.97983 23.6784L2.77663 17.671C1.20701 16.1509 2.08182 13.5136 4.22802 13.2017L12.8093 11.9546L16.6452 4.22783Z" fill="#902067"/>
                                    </svg>

                                </span>
                            ))}
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
                            <input type="file" hidden multiple accept="image/*" onChange={handlePhotoChange} />
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
                    />
                </div>
            </div>

            <button
                className="submit-review-btn"
                onClick={() => onSubmit({ ratings, comment })}
            >
                Отправить оценку
            </button>
        </div>
    );
};

export default OrderReview;