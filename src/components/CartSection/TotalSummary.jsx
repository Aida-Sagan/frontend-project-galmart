
import React from 'react';
import './styles/TotalSummary.css';

const TotalSummary = ({ orderTotal, deliveryCost, finalTotal, onCheckboxChange, isReady }) => {
    return (
        <div className="total-summary-block checkout-block">
            <h2 className="montserrat-font">Сумма к оплате</h2>
            <div className="summary-row montserrat-font">
                <span>Сумма заказа</span>
                <span>{orderTotal.toLocaleString('ru-RU')} ₸</span>
            </div>
            <div className="summary-row montserrat-font">
                <span>Доставка</span>
                <span>{deliveryCost.toLocaleString('ru-RU')} ₸</span>
            </div>
            <div className="summary-row total-row montserrat-font">
                <span>Итого</span>
                <strong>{finalTotal.toLocaleString('ru-RU')} ₸</strong>
            </div>

            <div className="weight-checkbox">
                <input
                    type="checkbox"
                    id="weight-confirm"
                    onChange={onCheckboxChange}
                />
                <label htmlFor="weight-confirm" className="montserrat-font">
                    Я подтверждаю, что сумма заказа может измениться из-за наличия весового товара в моем заказе
                </label>
            </div>

            <button
                className="pay-button montserrat-font"
                disabled={!isReady}
            >
                Оплатить {finalTotal.toLocaleString('ru-RU')} ₸
            </button>
        </div>
    );
};

export default TotalSummary;