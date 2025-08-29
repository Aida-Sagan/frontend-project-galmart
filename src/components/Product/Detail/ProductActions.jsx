import React, { useState } from 'react';
import '../style/ProductActions.css';

const ProductActions = ({ product }) => {
    const [quantity, setQuantity] = useState(0);
    const addedToCart = quantity > 0;

    const handleAddToCart = () => {
        if (!addedToCart) {
            setQuantity(1);
        }
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        setQuantity(prev => (prev > 1 ? prev - 1 : 0));
    };

    const finalPrice = product.unit_price * quantity;

    return (
        <div className="actions-container">
            <div className="price-info">
                {product.old_unit_price > 0 && (
                    <span className="old-price">{product.old_unit_price} {product.currency}</span>
                )}
                <span className="current-price">{product.unit_price} {product.currency}</span>
                <span className="unit-label">/ 1 шт</span>
            </div>
            <div className="controls-design">
                <div className="price-display-large">
                    {product.unit_price} {product.currency}
                </div>
                <button
                    className={`add-to-cart-btn-item ${addedToCart ? 'expanded' : ''}`}
                    onClick={handleAddToCart}
                >
                    {addedToCart ? (
                        <>
                            <span className="minus" onClick={handleDecrement}>-</span>
                            <div className="cart-info">
                                <span className="price-in-cart">{finalPrice} {product.currency}</span>
                                <span className="quantity-in-cart">{quantity} шт</span>
                            </div>
                            <span className="plus" onClick={handleIncrement}>+</span>
                        </>
                    ) : (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M18 7.875C18.6213 7.875 19.125 8.37868 19.125 9V16.875H27C27.6213 16.875 28.125 17.3787 28.125 18C28.125 18.6213 27.6213 19.125 27 19.125H19.125V27C19.125 27.6213 18.6213 28.125 18 28.125C17.3787 28.125 16.875 27.6213 16.875 27V19.125H9C8.37868 19.125 7.875 18.6213 7.875 18C7.875 17.3787 8.37868 16.875 9 16.875H16.875V9C16.875 8.37868 17.3787 7.875 18 7.875Z" fill="#FBFBFB"/>
                        </svg>

                    )}
                </button>
                <button className="favorite-button-design">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" stroke="#902067" strokeWidth="2" fill="none"/>
                    </svg>
                </button>
            </div>
            <div className="info-message">
                <p>Вес товара может незначительно измениться. Итоговая цена будет указана в чеке</p>
            </div>
        </div>
    );
};

export default ProductActions;
