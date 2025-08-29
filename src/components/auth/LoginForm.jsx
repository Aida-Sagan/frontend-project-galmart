import { useNavigate } from 'react-router-dom';
import { Formik, Form, ErrorMessage } from 'formik';
import { IMaskInput } from 'react-imask';
import './style/LoginForm.css';

export default function LoginForm({ agreeTerms }) {
    const navigate = useNavigate();

    return (
        <div className="login-form-container">
            <Formik
                initialValues={{ phone: '' }}
                validate={(values) => {
                    const errors = {};
                    const kzPhoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

                    if (!values.phone) {
                        errors.phone = 'Введите номер телефона';
                    } else if (!kzPhoneRegex.test(values.phone.trim())) {
                        errors.phone = 'Неверный формат.';
                    }

                    return errors;
                }}
                validateOnMount
                onSubmit={(values) => {
                    console.log('Отправка номера:', values.phone);
                    // navigate('/profile');
                }}
            >
                {({ isValid, setFieldValue, values }) => (
                    <Form className="w-full max-w-sm space-y-4">
                        <div className="field-wrapper">
                            <IMaskInput
                                name="phone"
                                mask="+7 (000) 000-00-00"
                                value={values.phone}
                                onAccept={(value) => setFieldValue('phone', value)}
                                placeholder="+7 (000) 000-00-00"
                                className="custom-input"
                                inputMode="numeric"
                            />
                            <ErrorMessage name="phone" component="div" className="error-text" />
                        </div>

                        <button
                            type="submit"
                            disabled={!isValid || !agreeTerms}
                            className="btn-get-code"
                        >
                            Получить код по SMS
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
