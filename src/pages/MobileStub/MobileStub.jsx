import React from 'react';
import './styles/MobileStub.css';
import phonePreview from '../../assets/phone-mobile.png';
import logo from '../../assets/galmart-icon-phone.png';

const MobileStub = ({ onContinue }) => {
    return (
        <div className="mobile-stub-overlay">
            <div className="mobile-stub-top">
                <div className="phone-mockup">
                    <img src={phonePreview} alt="App Preview" />
                </div>
            </div>

            <div className="mobile-stub-content">
                <div className="stub-logo-badge">
                    <img src={logo} alt="galmart logo" />
                </div>

                <div className="stub-brand-name">galmart</div>

                <p className="stub-text">
                    Заказывайте продукты ещё удобнее и быстрее в нашем приложении!
                </p>

                <div className="stub-buttons">
                    <button className="btn-install">Установить приложение</button>
                    <button className="btn-web-version" onClick={onContinue}>
                        Перейти в мобильную версию
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MobileStub;