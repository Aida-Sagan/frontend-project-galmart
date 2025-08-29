import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from 'react-datepicker';
import { useNavigate } from 'react-router-dom';

import { HiOutlineCalendar } from 'react-icons/hi';
import 'react-datepicker/dist/react-datepicker.css';
import './style/RegistrationForm.css';

export default function RegistrationForm() {
    const navigate = useNavigate();


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
                return errors;
            }}
            validateOnMount
            onSubmit={(values) => {
                console.log('Submitted:', values);
            }}
        >
            {({ values, setFieldValue, touched, errors, isValid }) => (
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
                        />
                        <HiOutlineCalendar className="calendar-icon" />
                    </div>
                    <p className="helper-text">
                        Введите дату и мы сделаем вам подарок в ваш день рождения
                    </p>

                    <Field
                        type="text"
                        name="address"
                        placeholder="Адрес доставки"
                        className="custom-input"
                    />

                    <button
                        type="submit"
                        disabled={!isValid}
                        className="btn-register"
                    >
                        Зарегистрироваться
                    </button>

                    <button
                        type="button"
                        className="w-full p-4 rounded-full border-2 border-fuchsia-700 text-fuchsia-700 font-medium hover:bg-fuchsia-50 transition btn-back-to-home"
                        onClick={() => navigate('/')}
                    >
                        Вернуться на сайт
                    </button>
                </Form>
            )}
        </Formik>
    );
}
