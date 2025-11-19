import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';
import 'react-datepicker/dist/react-datepicker.css';
import './style/RegistrationForm.css';
import AddressModal from '../AddressModal/AddressModal.jsx';
import { ru } from 'date-fns/locale';

import { useAuth } from '../../context/AuthContext';
import { completeRegistrationApi } from '../../api/services/authService';

export default function RegistrationForm() {
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);

    const { token, isNewUser, completeRegistration } = useAuth();
    registerLocale('ru', ru);

    useEffect(() => {
        if (!token || !isNewUser) {
            navigate('/', { replace: true });
        }
    }, [token, isNewUser, navigate]);

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
                if (!token) {
                    setFieldError('firstName', 'Ошибка аутентификации. Пожалуйста, начните сначала.');
                    setSubmitting(false);
                    return;
                }

                try {
                    let formattedBirthDate = null;
                    if (values.birthDate) {
                        const date = values.birthDate;
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        formattedBirthDate = `${day}.${month}.${year}`;
                    }

                    // Передача полей в формате, ожидаемом бэкендом: name, surname, birthday (DD.MM.YYYY)
                    const apiData = {
                        'name': values.firstName,
                        'surname': values.lastName,
                        'birthday': formattedBirthDate,
                        'address': values.address,
                    };

                    // Предполагается, что в authService.js метод изменен на POST
                    await completeRegistrationApi(apiData, token);

                    completeRegistration();

                } catch (error) {
                    if (error.message) {
                        setFieldError('firstName', error.message);
                    } else {
                        setFieldError('firstName', 'Произошла ошибка при регистрации');
                    }
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
                        tempAuthToken={token}
                        isRegistrationMode={true}
                    />
                </>
            )}
        </Formik>
    );
}