
import React from 'react';
import deleteIcon from '../../assets/svg/delete.svg';
import './style/QuantityControl.css';

const QuantityControl = ({
                             quantity,
                             onQuantityChange,
                             isMaxed,
                             showRemoveInsteadOfMinus,
                             isWeight
                         }) => {

    const step = isWeight ? 0.1 : 1;
    const displayQuantity = isWeight ? quantity.toFixed(1) : Math.round(quantity);

    const handleMinus = () => {
        const newQuantity = quantity - step;
        onQuantityChange(Math.max(0, newQuantity));
    };

    const handlePlus = () => {
        const newQuantity = quantity + step;
        onQuantityChange(newQuantity);
    };

    return (
        <div className="quantity-control">
            <button
                onClick={handleMinus}
                disabled={!showRemoveInsteadOfMinus && quantity <= step}
                className={`control-button minus ${showRemoveInsteadOfMinus ? 'remove-button' : ''}`}
            >
                {showRemoveInsteadOfMinus ? <img src={deleteIcon} alt="Удалить" /> :
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.7744 6.88184C17.1144 6.94161 17.342 7.26551 17.2822 7.60547L15.6201 17.0605C15.4275
                         18.1563 14.4748 18.9551 13.3623 18.9551H6.6377C5.52513 18.9551 4.57254 18.1563 4.37988
                          17.0605L2.71777 7.60547C2.658 7.26551 2.88562 6.94161 3.22559 6.88184C3.56532 6.82234
                          3.88937 7.04897 3.94922 7.38867L5.61133 16.8438C5.6989 17.3418 6.13201 17.7051 6.6377
                          17.7051H13.3623C13.8679 17.7051 14.3011 17.3418 14.3887 16.8438L16.0508 7.38867C16.1106
                           7.04897 16.4347 6.82234 16.7744 6.88184ZM11.1455 1.03906C12.4111 1.03906 13.4373 2.06458
                           13.4375 3.33008V4.37207H17.5C17.8452 4.37207 18.125 4.65189 18.125 4.99707C18.125 5.34225
                           17.8452 5.62207 17.5 5.62207H2.5C2.15482 5.62207 1.875 5.34225 1.875 4.99707C1.875 4.65189
                           2.15482 4.37207 2.5 4.37207H6.5625V3.33008C6.56268 2.06457 7.58895 1.03906 8.85449
                            1.03906H11.1455ZM8.85449 2.28906C8.2793 2.28906 7.81268 2.75493 7.8125
                            3.33008V4.37207H12.1875V3.33008C12.1873 2.75492 11.7207 2.28906 11.1455 2.28906H8.85449Z"
                              fill="#222222"/>
                    </svg>

                }
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