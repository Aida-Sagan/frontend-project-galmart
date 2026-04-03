import { useState } from 'react';
import LoginForm from '../../components/auth/LoginForm';
import LoginPromo from '../../components/auth/LoginPromo';
import { Checkbox } from '../../components/ui';
import '../../styles/LoginPage.css';
import galmartIcon from '../../assets/svg/galmart_icon.svg';

export default function LoginPage() {
    const [receiveOffers, setReceiveOffers] = useState(false);
    const [agreeTerms, setAgreeTerms] = useState(true);


    return (
        <div className="registration-wrapper">
            <div className="registration-form-block">
                <div className="login-content-wrapper">
                    <div className="block-login">
                        <img src={galmartIcon} alt="Galmart Icon" className="registration-logo" />
                        <div className="block-login-text">
                            <h2 className="registration-title">Вход</h2>
                            <div className="block-registration-description">
                                <p className="registration-description">
                                    Введите номер телефона, чтобы войти или зарегистрироваться
                                </p>
                            </div>
                        </div>
                    </div>
                    <LoginForm agreeTerms={agreeTerms} />

                    <div className="checkboxes">
                        <Checkbox
                            checked={receiveOffers}
                            onChange={setReceiveOffers}
                            label={
                                <span className="text-public-checkbox">
                                    Да, я хочу получать рекламные предложения и новости.
                                </span>
                            }
                        />

                        <Checkbox
                            checked={agreeTerms}
                            onChange={setAgreeTerms}
                            required
                            label={
                                <span className="text-public-checkbox">
                                    Я соглашаюсь с <a href="#" target="_blank" className="public-offer-link">Публичной офертой и
                                    Политикой конфиденциальности</a>.
                                </span>
                            }
                        />
                    </div>
                </div>
            </div>

            <LoginPromo />
        </div>
    )
}
