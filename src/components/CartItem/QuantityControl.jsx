import React from 'react';
import deleteIcon from '../../assets/svg/delete.svg';
import './style/QuantityControl.css';

const QuantityControl = ({
                             quantity,
                             onQuantityChange,
                             isMaxed,
                             isWeight
                         }) => {

    const step = isWeight ? 0.1 : 1;
    const displayQuantity = isWeight ? quantity.toFixed(1) : Math.round(quantity);
    const isRemoveAction = quantity <= step;

    const handleAction = () => {
        if (isRemoveAction) {
            onQuantityChange(0);
        } else {
            const newQuantity = quantity - step;
            onQuantityChange(Math.max(step, newQuantity));
        }
    };

    const handlePlus = () => {
        const newQuantity = quantity + step;
        onQuantityChange(newQuantity);
    };

    return (
        <div className="quantity-control">
            <button
                onClick={handleAction}
                className={`control-button minus ${isRemoveAction ? 'remove-button' : ''}`}
            >
                {/* Если это действие удаления (1 шт), показываем мусорное ведро */}
                {isRemoveAction ? (
                    <img src={deleteIcon} alt="Удалить" />
                ) : (
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd" d="M16.6667 9.16671C17.1269 9.16671 17.5 9.54013 17.5 10C17.5 10.4599 17.1269 10.8333 16.6667 10.8333H3.33333C2.8731 10.8333 2.5 10.4599 2.5 10C2.5 9.54013 2.8731 9.16671 3.33333 9.16671H16.6667Z" fill="#222222"/>
                    </svg>
                )}
            </button>

            <span className="quantity-value">{displayQuantity} {isWeight ? 'кг' : 'шт'}</span>

            <button
                onClick={handlePlus}
                disabled={isMaxed}
                className="control-button plus"
            >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M6 0.375C6.34518 0.375 6.625 0.654822 6.625 1V5.375H11C11.3452 5.375 11.625 5.65482 11.625 6C11.625 6.34518 11.3452 6.625 11 6.625H6.625V11C6.625 11.3452 6.34518 11.625 6 11.625C5.65482 11.625 5.375 11.3452 5.375 11V6.625H1C0.654822 6.625 0.375 6.34518 0.375 6C0.375 5.65482 0.654822 5.375 1 5.375H5.375V1C5.375 0.654822 5.65482 0.375 6 0.375Z" fill="#222222"/>
                </svg>

            </button>
        </div>
    );
};

export default QuantityControl;