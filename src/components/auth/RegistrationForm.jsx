// src/components/RegistrationForm.jsx

import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useNavigate, useLocation } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';
import 'react-datepicker/dist/react-datepicker.css';
import './style/RegistrationForm.css';
import AddressModal from '../AddressModal/AddressModal.jsx';
import { ru } from 'date-fns/locale';

import { useAuth } from '../../context/AuthContext';
import { completeRegistrationApi } from '../../api/services/authService';

export default function RegistrationForm() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isModalOpen, setModalOpen] = useState(false);

    // tempAuthData содержит { phone, access_token, refresh_token }
    const { tempAuthData, completeRegistration } = useAuth();
    registerLocale('ru', ru);

    useEffect(() => {
        if (!tempAuthData) {
            navigate('/login');
        }
    }, [tempAuthData, navigate]);

    return (
        <Formik
            initialValues={{
                firstName: '',
                lastName: '',
                birthDate: null,
                address: ''
            }}
            validate={(values) => {
                const errors = {};
                if (!values.firstName) errors.firstName = 'Это поле необходимо заполнить';
                if (!values.lastName) errors.lastName = 'Это поле необходимо заполнить';
                if (!values.address) errors.address = 'Пожалуйста, выберите адрес доставки';
                return errors;
            }}
            validateOnMount
            onSubmit={async (values, { setSubmitting, setFieldError }) => {
                if (!tempAuthData) {
                    setFieldError('firstName', 'Ошибка аутентификации. Пожалуйста, начните сначала.');
                    setSubmitting(false);
                    return;
                }

                try {
                    const apiData = {
                        first_name: values.name,
                        last_name: values.lastname,
                        birth_date: values.birthday ? values.birthday.toISOString().split('T')[0] : null,
                        address: values.address,
                        phone: tempAuthData.phone,
                    };

                    const response = await completeRegistrationApi(apiData, tempAuthData.access_token);

                    if (response.access && response.refresh) {
                        completeRegistration(response.access, response.refresh);
                    } else if (response.data && response.data.access && response.data.refresh) {
                        completeRegistration(response.data.access, response.data.refresh);
                    } else {
                        console.warn("API не вернул постоянные токены. Перенаправление на вход.");

                    }

                    // Навигация на предыдущую страницу
                    const previousPath = location.state?.from || '/';
                    navigate(previousPath, { replace: true });

                } catch (error) {
                    setFieldError('firstName', error.message || 'Произошла ошибка при регистрации');
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ values, setFieldValue, touched, errors, isValid, isSubmitting }) => (
                <>
                    <Form className="w-full max-w-md space-y-4">
                        {/* ... (поля формы без изменений) ... */}
                        <div className="field-wrapper">
                            <Field
                                type="text"
                                name="firstName"
                                placeholder="Имя"
                                className={`custom-input ${
                                    touched.firstName && errors.firstName ? 'input-error' : ''
                                }`}
                            />
                            <ErrorMessage
                                name="firstName"
                                component="div"
                                className="error-text"
                            />
                        </div>

                        <div className="field-wrapper">
                            <Field
                                type="text"
                                name="lastName"
                                placeholder="Фамилия"
                                className={`custom-input ${
                                    touched.lastName && errors.lastName ? 'input-error' : ''
                                }`}
                            />
                            <ErrorMessage
                                name="lastName"
                                component="div"
                                className="error-text"
                            />
                        </div>

                        <div className="date-picker-wrapper relative">
                            <DatePicker
                                selected={values.birthDate}
                                onChange={(date) => setFieldValue('birthDate', date)}
                                placeholderText="Дата рождения"
                                dateFormat="dd.MM.yyyy"
                                className="custom-date-input"
                                maxDate={new Date()}
                                showYearDropdown
                                scrollableYearDropdown
                                locale="ru"
                            />
                            <HiOutlineCalendar className="calendar-icon" />
                        </div>
                        <p className="helper-text">
                            Введите дату и мы сделаем вам подарок в ваш день рождения
                        </p>

                        <div className="field-wrapper">
                            <Field
                                type="text"
                                name="address"
                                placeholder="Адрес доставки"
                                className={`custom-input ${
                                    touched.address && errors.address ? 'input-error' : ''
                                }`}
                                onClick={() => setModalOpen(true)}
                                readOnly
                            />
                            <ErrorMessage name="address" component="div" className="error-text" />
                        </div>

                        <button type="submit" disabled={!isValid || isSubmitting} className="btn-register">
                            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                        </button>
                        <button type="button" className="btn-back-to-home" onClick={() => navigate('/')}>
                            Вернуться на сайт
                        </button>
                    </Form>

                    <AddressModal
                        isOpen={isModalOpen}
                        onClose={() => setModalOpen(false)}
                        onSave={(selectedAddress) => {
                            setFieldValue('address', selectedAddress, true);
                            setModalOpen(false);
                        }}
                        tempAuthToken={tempAuthData?.access_token}
                        isRegistrationMode={true}
                    />
                </>
            )}
        </Formik>
    );
}