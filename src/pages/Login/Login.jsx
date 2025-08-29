import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import LoginPromo from '../../components/auth/LoginPromo.jsx';
import '../../styles/LoginPage.css';
import galmartIcon from '../../assets/svg/galmart_icon.svg';

export default function LoginPage() {
    const [receiveOffers, setReceiveOffers] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);


    return (
        <div className="registration-wrapper">
            <div className="registration-form-block">
                <div className="block-login">
                    <img src={galmartIcon} alt="Galmart Icon" className="registration-logo" />
                    <h2 className="registration-title">Вход</h2>
                    <div className="block-registration-description">
                        <p className="registration-description">
                            Введите номер телефона, чтобы войти или зарегистрироваться
                        </p>
                    </div>
                </div>
                <LoginForm agreeTerms={agreeTerms} />

                <div className="checkboxes">
                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={receiveOffers}
                            onChange={() => setReceiveOffers(!receiveOffers)}
                        />
                        <span className="custom-checkbox"></span>
                        <p className="text-public-checkbox">
                            Да, я хочу получать рекламные предложения и новости.

                        </p>
                    </label>

                    <label className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={() => setAgreeTerms(!agreeTerms)}
                            required
                        />
                        <span className="custom-checkbox checked"></span>
                       <p className="text-public-checkbox">
                           Я соглашаюсь с <a href="#" target="_blank" className="public-offer-link">Публичной офертой и
                           Политикой конфиденциальности</a>.
                       </p>

                    </label>
                </div>
            </div>

            <LoginPromo />
        </div>
    )
}
