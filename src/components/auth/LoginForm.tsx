import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form } from 'formik';
import { InputPhone, Button } from '../ui';
import { sendLoginCode } from '../../endpoint-service/services/authService';
import { authStore } from '../../stores/authStore';

import './style/LoginForm.css';

export default function LoginForm({ agreeTerms }: { agreeTerms?: boolean }) {
    const navigate = useNavigate();

    return (
        <div className="login-form-container">
            <Formik
                initialValues={{ phone: '+7 ' }}
                validate={(values) => {
                    const errors: any = {};
                    const unmaskedValue = values.phone.replace(/\D/g, '');
                    if (!values.phone) {
                        errors.phone = 'Введите номер телефона';
                    } else if (!/^7\d{10}$/.test(unmaskedValue)) {
                        errors.phone = 'Неверный формат. Введите 10 цифр после +7.';
                    }
                    return errors;
                }}
                validateOnMount
                onSubmit={async (values, { setSubmitting }) => {
                    const unmaskedValue = values.phone.replace(/\D/g, '');

                    try {
                        await sendLoginCode(unmaskedValue);
                    } catch (error) {
                        console.error('Failed to send login code:', error);
                    }

                    authStore.setLoginPhone(values.phone);
                    navigate('/verify', { state: { phoneNumber: values.phone } });
                    setSubmitting(false);
                }}
            >
                {({ isValid, setFieldValue, values, isSubmitting, errors, touched }) => (
                    <Form className="login-form">
                        <div className="field-wrapper">
                            <InputPhone
                                name="phone"
                                value={values.phone}
                                onChange={(val) => setFieldValue('phone', val)}
                                country="KZ"
                                errorText={touched.phone && errors.phone ? errors.phone : undefined}
                                autoFocus
                            />
                        </div>

                        <div className="buttons-group">
                            <Button
                                type="submit"
                                disabled={!isValid || !agreeTerms || isSubmitting}
                                variant="filled"
                                fullWidth
                            >
                                {isSubmitting ? 'Отправка...' : 'Получить код по SMS'}
                            </Button>

                            <Button
                                type="button"
                                variant="outlined"
                                fullWidth
                                onClick={() => navigate('/')}
                            >
                                Вернуться на сайт
                            </Button>
                        </div>
                    </Form>
                )}
            </Formik>
        </div>
    );
}