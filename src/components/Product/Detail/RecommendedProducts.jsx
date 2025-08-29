import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import  '../style/RecommendedProducts.css';


const RecommendedProductCard = ({ item, currentSectionId }) => {
    const [quantity, setQuantity] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const addedToCart = quantity > 0;

    const handleAddToCart = (e) => {
        if (!addedToCart) {
            e.preventDefault();
            setQuantity(1);
        }
    };

    const handleIncrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(prev => (prev > 1 ? prev - 1 : 0));
    };

    const toggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsFavorite(prev => !prev);
    };

    const getTotalPrice = () => {
        return (item.unit_price * quantity).toLocaleString('ru-RU');
    };

    return (
        <Link to={`/product/${currentSectionId}/${item.id}`} className="product-item-card">
            <div className="item-image-container">
                <img src={item.photos?.[0] || 'https://placehold.co/200x200/F5F5F5/222222?text=Product'} alt={item.title} />
                <button
                    className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                    onClick={toggleFavorite}
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill={isFavorite ? "#902067" : "none"} xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke={isFavorite ? "#902067" : "#902067"} strokeWidth="2"/>
                    </svg>
                </button>
            </div>
            <div className="item-details-area">
                <div className="item-description-wrapper">
                    <p className="item-name">{item.title}</p>
                </div>
                <p className="item-price-label">{item.unit_price} {item.currency}</p>
                <button
                    className={`add-item-button ${addedToCart ? 'expanded' : ''}`}
                    onClick={handleAddToCart}
                >
                    {addedToCart ? (
                        <>
                            <span className="minus" onClick={handleDecrement}>-</span>
                            <div className="cart-info-recommendations">
                                <span className="price-in-cart">{getTotalPrice()} {item.currency}</span>
                                <span className="quantity-in-cart">{quantity} шт</span>
                            </div>
                            <span className="plus" onClick={handleIncrement}>+</span>
                        </>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                        </svg>
                    )}
                </button>
            </div>
        </Link>
    );
};

const RecommendedProducts = ({ items, currentSectionId }) => {
    if (!items || items.length === 0) {
        return null;
    }

    return (
        <section className="section-recommendation">
            <div className="recommendation-heading">
                <h2>С этим товаром покупают</h2>
                <Link to={`/catalog/${currentSectionId}`} className="link-more-products">Смотреть больше</Link>
            </div>
            <div className="recommendation-grid">
                {items.map(item => (
                    <RecommendedProductCard key={item.id} item={item} currentSectionId={currentSectionId} />
                ))}
            </div>
        </section>
    );
};

export default RecommendedProducts;
