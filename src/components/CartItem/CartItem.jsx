import React from 'react';
import QuantityControl from './QuantityControl';
import { useCart } from '../../context/CartContext';

import '../../assets/svg/cart.svg';
import './style/CartItem.css';

const CartItem = ({ item, isPromo, isOutOfStock }) => {
    const { updateCartItemQuantity } = useCart();

    const {
        id,
        title,
        unit_price: price,
        unit,
        unit_value,
        count: quantity,
        inventory: maxAvailable,
        is_weight: isWeight = false,
        time_slot: timeSlot = null,
        photos = [],
    } = item;

    const maxQuantity = maxAvailable;
    const showRemaining = isOutOfStock && maxAvailable > 0;

    const totalCost = (price || 0) * quantity;
    const imageUrl = photos[0];

    const handleQuantityChange = (newQuantity) => {
        updateCartItemQuantity(id, newQuantity);
    };

    if (price === undefined) {
        return (
            <div className={`cart-item loading-item ${isOutOfStock ? 'out-of-stock' : ''} ${isPromo ? 'promo' : ''}`}>
                <div className="item-details">
                    <div className="item-name">{title || 'Загрузка данных товара...'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`cart-item ${isOutOfStock ? 'out-of-stock' : ''} ${isPromo ? 'promo' : ''}`}>
            <div className="cart-item-image-container">
                <div className="cart-item-image">
                    <img src={imageUrl} alt={title} />

                    {isOutOfStock && (
                        <div className="out-of-stock-overlay">
                            <span className="out-of-stock-label">
                                Нет <br/> в наличии
                            </span>
                        </div>
                    )}
                </div>
            </div>


            <div className="item-details">
                <div className="item-name">{title}</div>
                <div className="item-price-unit">{price.toLocaleString('ru-RU')} ₸ / {unit_value} {unit}</div>

                <QuantityControl
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    maxQuantity={maxQuantity || Infinity}
                    isMaxed={quantity >= (maxQuantity || Infinity)}
                    isWeight={isWeight}
                />

                {isPromo && <div className="gift-tag">Подарок</div>}
            </div>

            {!isPromo && (
                <div className="item-actions">
                    {showRemaining && (
                        <span className="item-remaining">Остаток: {maxAvailable} {isWeight ? 'кг' : 'шт'}</span>
                    )}

                    {timeSlot && <span className="item-timeslot">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9.99707 1.03906C14.9446 1.03906 18.9551 5.04952 18.9551 9.99707C18.9551 14.9446 14.9446 18.9551 9.99707 18.9551C5.04952 18.9551 1.03906 14.9446 1.03906 9.99707C1.03906 5.04952 5.04952 1.03906 9.99707 1.03906ZM9.99707 2.28906C5.73988 2.28906 2.28906 5.73988 2.28906 9.99707C2.28906 14.2543 5.73988 17.7051 9.99707 17.7051C14.2543 17.7051 17.7051 14.2543 17.7051 9.99707C17.7051 5.73988 14.2543 2.28906 9.99707 2.28906ZM9.99707 4.37207C10.3422 4.37207 10.6221 4.65189 10.6221 4.99707V9.37207H14.9971C15.3422 9.37207 15.6221 9.65189 15.6221 9.99707C15.6221 10.3422 15.3422 10.6221 14.9971 10.6221H9.99707C9.65189 10.6221 9.37207 10.3422 9.37207 9.99707V4.99707C9.37207 4.65189 9.65189 4.37207 9.99707 4.37207Z" fill="#FF6A6A"/>
                        </svg>
                        {timeSlot}</span>}

                    <div className="item-total-price">
                        {totalCost.toLocaleString('ru-RU')} ₸
                    </div>
                </div>
            )}

            <button
                className="remove-item"
                onClick={() => updateCartItemQuantity(id, 0)}
                title="Удалить товар"
            >
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M5.18581 5.18919C5.42989 4.94511 5.82561 4.94511 6.06969 5.18919L9.99662 9.11612L13.9235 5.18919C14.1676 4.94511 14.5633 4.94511 14.8074 5.18919C15.0515 5.43327 15.0515 5.829 14.8074 6.07307L10.8805 10L14.8074 13.9269C15.0515 14.171 15.0515 14.5667 14.8074 14.8108C14.5633 15.0549 14.1676 15.0549 13.9235 14.8108L9.99662 10.8839L6.06969 14.8108C5.82561 15.0549 5.42989 15.0549 5.18581 14.8108C4.94173 14.5667 4.94173 14.171 5.18581 13.9269L9.11273 10L5.18581 6.07307C4.94173 5.829 4.94173 5.43327 5.18581 5.18919Z" fill="#7A7A7A"/>
                </svg>

            </button>
        </div>
    );
};

export default CartItem;