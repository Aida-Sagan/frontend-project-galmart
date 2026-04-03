import React from 'react';
import './styles/OfflinePurchases.css';

const OfflinePurchaseDetail = ({ purchase }) => {
    if (!purchase) return null;

    const { check_number, date, used_bonuses, total, paid, currency, discount, items, bonuses } = purchase;
    const orderNumber = check_number || purchase.id || '—';
    const totalAmount = total || 0;
    const paidAmount = paid || 0;
    const discountAmount = discount || 0;
    const usedBonusesAmount = used_bonuses || 0;
    const accruedBonuses = bonuses || 0;
    const sumCheck = paidAmount + usedBonusesAmount;

    return (
        <div className="offline-detail-wrapper">
            <h2 className="detail-number">№{orderNumber}</h2>

            {/* БЛОК 1: ТОВАРЫ */}
            <div className="products-block">
                <div className="detail-section">
                    <h3 className="section-title">Товары</h3>
                    {items && items.map((item, index) => (
                        <div key={index} className="item-row">
                            <div className="item-info">
                                <span className="item-name">{item.name}</span>
                            </div>

                            <div className="item-right-details">
                                <span className="item-price">{item.price.toLocaleString()} {currency || '₸'}</span>
                                <span className="item-amount">{item.amount.toLocaleString()} {item.unit}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* БЛОК 2: ДЕТАЛИ */}
            <div className="details-block">
                <div className="detail-section">
                    <h3 className="section-title">Детали</h3>
                    <div className="detail-row">
                        <span>Дата</span>
                        <span className="detail-value date-value">{date}</span>
                    </div>
                    <div className="detail-row">
                        <span>Оплачено бонусами</span>
                        <span className="detail-value">{usedBonusesAmount.toLocaleString()} {currency || '₸'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Скидка</span>
                        <span className="detail-value">{discountAmount.toLocaleString()} {currency || '₸'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Сумма чека</span>
                        <span className="detail-value">{sumCheck.toLocaleString()} {currency || '₸'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Оплачено</span>
                        <span className="detail-value">{paidAmount.toLocaleString()} {currency || '₸'}</span>
                    </div>
                    <div className="detail-row">
                        <span>Начислено бонусов</span>
                        <span className="detail-value accrued-bonuses">{accruedBonuses.toLocaleString()} {currency || '₸'}</span>
                    </div>
                    <div className="detail-row total-row">
                        <span>Итого</span>
                        <span className="detail-value total-value">{totalAmount.toLocaleString()} {currency || '₸'}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OfflinePurchaseDetail;