import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';
import 'react-datepicker/dist/react-datepicker.css';
import './style/RegistrationForm.css';
import AddressModal from '../AddressModal/AddressModal.jsx';

import { useAuth } from '../../context/AuthContext';
import { completeRegistrationApi } from '../../api/services/authService';

export default function RegistrationForm() {
    const navigate = useNavigate();
    const [isModalOpen, setModalOpen] = useState(false);

    const { tempAuthData, completeRegistration } = useAuth();

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
                // Если нет временных данных, прерываем выполнение
                if (!tempAuthData) {
                    setFieldError('firstName', 'Ошибка аутентификации. Пожалуйста, начните сначала.');
                    setSubmitting(false);
                    return;
                }

                try {
                    // Подготавливаем данные в формате, который ожидает API
                    const apiData = {
                        first_name: values.firstName,
                        last_name: values.lastName,
                        // Форматируем дату в YYYY-MM-DD
                        birth_date: values.birthDate ? values.birthDate.toISOString().split('T')[0] : null,
                        address: values.address,
                        phone: tempAuthData.phone, // Телефон берем из временных данных
                    };

                    // Вызываем API, передавая данные и временный токен
                    const response = await completeRegistrationApi(apiData, tempAuthData.access_token);

                    // Завершаем процесс, передавая в контекст НОВЫЕ, постоянные токены из ответа
                    completeRegistration(response.data.access, response.data.refresh);

                } catch (error) {
                    // В случае ошибки от сервера, показываем ее пользователю
                    setFieldError('firstName', error.message || 'Произошла ошибка при регистрации');
                } finally {
                    setSubmitting(false);
                }
            }}
        >
            {({ values, setFieldValue, touched, errors, isValid, isSubmitting }) => (
                <>
                    <Form className="w-full max-w-md space-y-4">
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
                        onSelectAddress={(selectedAddress) => {
                            setFieldValue('address', selectedAddress, true);
                            setModalOpen(false);
                        }}
                    />
                </>
            )}
        </Formik>
    );
}

