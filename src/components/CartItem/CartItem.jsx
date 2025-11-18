import React from 'react';
import QuantityControl from './QuantityControl';
import { useCart } from '../../context/CartContext';

import '../../assets/svg/cart.svg';
import './style/CartItem.css';

const CartItem = ({ item, isPromo, isOutOfStock }) => {
    // ИСПРАВЛЕНО: используем правильное имя функции из CartContext
    const { updateCartItemQuantity } = useCart();

    const {
        id,
        name,
        unit_price: price,
        unit_value: unit,
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
        if (newQuantity <= 0) {
            // ИСПРАВЛЕНО: вызываем функцию с правильным именем
            updateCartItemQuantity(id, 0);
        } else {
            // ИСПРАВЛЕНО: вызываем функцию с правильным именем
            updateCartItemQuantity(id, newQuantity);
        }
    };

    if (price === undefined) {
        return (
            <div className={`cart-item loading-item ${isOutOfStock ? 'out-of-stock' : ''} ${isPromo ? 'promo' : ''}`}>
                <div className="item-details">
                    <div className="item-name">{name || 'Загрузка данных товара...'}</div>
                </div>
            </div>
        );
    }

    return (
        <div className={`cart-item ${isOutOfStock ? 'out-of-stock' : ''} ${isPromo ? 'promo' : ''}`}>
            <div className="item-image">
                <img src={imageUrl} alt={name} />
                {isOutOfStock && <span className="not-in-stock-overlay">Нет в наличии</span>}
            </div>

            <div className="item-details">
                <div className="item-name">{name}</div>
                <div className="item-price-unit">{price.toLocaleString('ru-RU')} ₸ / {unit}</div>

                <QuantityControl
                    quantity={quantity}
                    onQuantityChange={handleQuantityChange}
                    maxQuantity={maxQuantity || Infinity}
                    isMaxed={quantity >= (maxQuantity || Infinity)}
                    showRemoveInsteadOfMinus={quantity <= (isWeight ? 0.001 : 1)}
                    isWeight={isWeight}
                />

                {isPromo && <div className="gift-tag">Подарок</div>}
            </div>

            {!isPromo && (
                <div className="item-actions">
                    {showRemaining && (
                        <span className="item-remaining">Остаток: {maxAvailable} {isWeight ? 'кг' : 'шт'}</span>
                    )}

                    {timeSlot && <span className="item-timeslot">⏱️ {timeSlot}</span>}

                    <div className="item-total-price">
                        {totalCost.toLocaleString('ru-RU')} ₸
                    </div>
                </div>
            )}

            <button
                className="remove-item"
                // ИСПРАВЛЕНО: вызываем функцию с правильным именем
                onClick={() => updateCartItemQuantity(id, 0)}
                title="Удалить товар"
            >
            </button>
        </div>
    );
};

export default CartItem;