const OrderSuccessModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="modal-overlay success-overlay" onClick={onClose}>
            <div className="modal-content success-modal" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6L18 18" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
                <h2 className="success-title">Заказ оформлен</h2>
                <p className="success-text">
                    Спасибо за заказ!<br />
                    Скоро передадим на сборку
                </p>
                <div className="success-actions">
                    <Link to="/profile/orders/online" className="modal-btn primary-large">К заказам</Link>
                    <Link to="/" className="modal-btn outline-large">На главную</Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;