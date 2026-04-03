import React, { useState, useEffect } from 'react';
import { Formik, Form } from 'formik';
import DatePicker, { registerLocale } from 'react-datepicker';
import { useNavigate } from 'react-router-dom';
import { HiOutlineCalendar } from 'react-icons/hi';
import 'react-datepicker/dist/react-datepicker.css';
import './style/RegistrationForm.css';

import { InputText, Button } from '../ui';
import AddressModal from '../AddressModal/AddressModal';
import { ru } from 'date-fns/locale';

import { authStore } from '../../stores/authStore';
import { completeRegistrationApi } from '../../endpoint-service/services/authService';

export default function RegistrationForm() {
    const navigate = useNavigate();

    const [isModalOpen, setModalOpen] = useState(false);

    const { token, isNewUser, completeRegistration } = authStore;
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
                const errors: any = {};
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

                    const apiData = {
                        'name': values.firstName,
                        'surname': values.lastName,
                        'birthday': formattedBirthDate,
                        'address': values.address,
                    };

                    await completeRegistrationApi(apiData);

                    completeRegistration();
                    navigate('/');

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
                    <Form className="registration-form">
                        <InputText
                            name="firstName"
                            value={values.firstName}
                            onChange={(val) => setFieldValue('firstName', val)}
                            label="Имя"
                            placeholder="Введите имя"
                            errorText={touched.firstName && errors.firstName ? errors.firstName : undefined}
                        />

                        <InputText
                            name="lastName"
                            value={values.lastName}
                            onChange={(val) => setFieldValue('lastName', val)}
                            label="Фамилия"
                            placeholder="Введите фамилию"
                            errorText={touched.lastName && errors.lastName ? errors.lastName : undefined}
                        />

                        <div className="date-picker-wrapper relative">
                            {/* @ts-ignore - selectsMultiple not needed for single date */}
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

                        <InputText
                            name="address"
                            value={values.address}
                            onChange={() => {}}
                            label="Адрес доставки"
                            placeholder="Выберите адрес"
                            errorText={touched.address && errors.address ? errors.address : undefined}
                            readOnly
                            onClick={() => setModalOpen(true)}
                        />

                        <Button type="submit" disabled={!isValid || isSubmitting} variant="filled" fullWidth>
                            {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>
                        <Button type="button" variant="outlined" fullWidth onClick={() => navigate('/')}>
                            Вернуться на сайт
                        </Button>
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