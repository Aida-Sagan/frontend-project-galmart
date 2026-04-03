import React from 'react';

import phoneImage from '../../assets/qr/mobile.png';
import qr from '../../assets/qr/qr.png';
import appStore from '../../assets/qr/appstore.png';
import googlePlay from '../../assets/qr/google_pay.png';

import './style/qrPromo.css';


const QrPromo = () => {
    return (
        <div className="qr-promo">
            <div className="qr-promo__left">
                <div className="phone-container">
                    <img src={phoneImage} alt="Phone" className="qr-promo__phone" />
                    <div className="phone-content">
                        <img src={qr} alt="QR Code" className="qr-code" />
                        <p className="qr-promo__caption">
                            Сканируйте QR-код<br />
                            чтобы скачать приложение
                        </p>
                    </div>
                </div>
            </div>

            <div className="qr-promo__right">
                <h2 className="qr-promo__title">galmart всегда рядом</h2>
                <p className="qr-promo__description">
                    Заказывайте продукты, готовую еду и товары для дома — быстро, удобно и с заботой.
                    Мы всё аккуратно соберём, надёжно упакуем и доставим точно в срок.
                </p>
                <p className="qr-promo__description">
                    А ещё — дарим бонусы за покупки: обменивайте их на скидки, любимые блюда и приятные сюрпризы.
                </p>

                <div className="qr-promo__apps">
                    <img src={appStore} alt="App Store" />
                    <img src={googlePlay} alt="Google Play" />
                </div>
            </div>
        </div>
    );
};

export default QrPromo;
