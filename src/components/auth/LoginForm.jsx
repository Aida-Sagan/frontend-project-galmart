import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import { IMaskInput } from 'react-imask';
import { X } from 'lucide-react';
import { sendLoginCode } from '../../api/services/authService.js';
import { useAuth } from '../../context/AuthContext';

import './style/LoginForm.css';

export default function LoginForm({ agreeTerms }) {
    const navigate = useNavigate();

    const { setLoginPhone } = useAuth();
    return (
        <div className="login-form-container">
            <Formik
                initialValues={{ phone: '' }}
                validate={(values) => {
                    const errors = {};
                    const unmaskedValue = values.phone.replace(/\D/g, '');
                    if (!values.phone) {
                        errors.phone = 'Введите номер телефона';
                    } else if (!/^7\d{10}$/.test(unmaskedValue)) {
                        errors.phone = 'Неверный формат. Введите 10 цифр после +7.';
                    }
                    return errors;
                }}
                validateOnMount
                onSubmit={async (values, { setSubmitting, setFieldError }) => {
                    try {
                        const unmaskedValue = values.phone.replace(/\D/g, '');
                        await sendLoginCode(unmaskedValue); // Вызываем API

                        setLoginPhone(values.phone);
                        navigate('/verify');
                    } catch (error) {
                        setFieldError('phone', 'Не удалось отправить код. Попробуйте позже.', error);
                    } finally {
                        setSubmitting(false);
                    }
                }}
            >
                {({ isValid, setFieldValue, values, isSubmitting }) => (                    <Form className="login-form">
                        <div className="field-wrapper">
                            <IMaskInput
                                name="phone"
                                mask="+7 (000) 000-00-00"
                                value={values.phone}
                                onAccept={(value) => setFieldValue('phone', value)}
                                placeholder="+7 (___) ___-__-__"
                                className="custom-input"
                                inputMode="numeric"
                            />
                            {values.phone && (
                                <button
                                    type="button"
                                    className="clear-btn"
                                    onClick={() => setFieldValue('phone', '')}
                                    aria-label="Очистить поле"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>
                        <ErrorMessage name="phone" component="div" className="error-text" />

                        <button
                            type="submit"
                            disabled={!isValid || !agreeTerms || isSubmitting}
                            className="btn-get-code"
                        >
                            {isSubmitting ? 'Отправка...' : 'Получить код по SMS'}
                        </button>

                        <button
                            type="button"
                            className="btn-back-to-home"
                            onClick={() => navigate('/')}
                        >
                            Вернуться на сайт
                        </button>
                    </Form>
                )}
            </Formik>
        </div>
    );
}

