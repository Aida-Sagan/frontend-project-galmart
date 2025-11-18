// Общий контейнер для Состав заказа, Акционные, Нет в наличии
// components/CartSection/ItemsBlock.jsx

import React from 'react';

const ItemsBlock = ({ title, children, className }) => {
    return (
        <div className={`items-block ${className || ''}`}>
            <h2>{title}</h2>
            <div className="items-list">
                {children}
            </div>
        </div>
    );
};

export default ItemsBlock;