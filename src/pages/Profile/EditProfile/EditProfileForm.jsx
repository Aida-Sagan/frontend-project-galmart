import React, { useState, useRef, useEffect } from 'react';
import { editUserInfo } from '../../../api/services/profileService.js';
import Loader from '../../../components/Loader/Loader.jsx';
import { useProfile } from '../../../context/ProfileContext.jsx';
import './styles/EditProfileForm.css';


const convertDateToInputFormat = (dateString) => {
    if (!dateString) return '';

    const cleanDate = dateString.split('T')[0].trim();
    const parts = cleanDate.split('.');

    if (parts.length === 3) {
        const day = parts[0];
        const month = parts[1];
        const year = parts[2];

        return `${year}-${month}-${day}`;
    }
    return '';
};

const convertDateToApiFormat = (dateString) => {
    if (!dateString) return '';

    const parts = dateString.split('-');

    if (parts.length === 3) {
        const [year, month, day] = parts;
        return `${day}.${month}.${year}`;
    }

    return dateString;
};


const EditProfileForm = ({ initialData, onClose }) => {
    const { fetchUserProfile } = useProfile();
    const dateInputRef = useRef(null);

    const [formData, setFormData] = useState({
        name: initialData.name || '',
        surname: initialData.surname || initialData.lastname || '',
        birthday: convertDateToInputFormat(initialData.birthday),
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setFormData({
            name: initialData.name || '',
            surname: initialData.surname || initialData.lastname || '',
            birthday: convertDateToInputFormat(initialData.birthday),
        });
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const apiBirthday = convertDateToApiFormat(formData.birthday);

        const updateBody = {
            name: formData.name,
            lastname: formData.surname,
            birthday: apiBirthday,
            phone: initialData.phone,
        };
        console.log("Отправляемые данные (updateBody):", updateBody);
        console.log("Формат birthday (API):", typeof apiBirthday, apiBirthday);
        try {
            await editUserInfo(updateBody);
            await fetchUserProfile();
            onClose();
        } catch (err) {
            let errorMessage = 'Не удалось сохранить изменения.';

            if (err.response && err.response.data && err.response.data.message) {
                const match = err.response.data.message.match(/string='([^']+)'/);
                errorMessage = match ? match[1] : err.response.data.message;
            }

            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCalendarClick = () => {
        if (dateInputRef.current) {
            if (dateInputRef.current.showPicker) {
                dateInputRef.current.showPicker();
            } else {
                dateInputRef.current.focus();
                dateInputRef.current.click();
            }
        }
    };

    return (
        <div className="edit-profile-form-container">
            <h2 className="form-title">Личные данные</h2>

            {loading && <Loader />}
            {error && <p className="form-error">Ошибка: {error}</p>}

            <div className="block-edit">
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="name" className="visually-hidden">Имя</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Имя"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="surname" className="visually-hidden">Фамилия</label>
                        <input
                            type="text"
                            id="surname"
                            name="surname"
                            value={formData.surname}
                            onChange={handleChange}
                            placeholder="Фамилия"
                        />
                    </div>

                    <div className="input-group">
                        <label htmlFor="birthday" className="visually-hidden">Дата рождения</label>
                        <input
                            ref={dateInputRef}
                            type="date"
                            id="birthday"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                            placeholder="Дата рождения"
                        />
                        <svg
                            className="calendar-icon"
                            onClick={handleCalendarClick}
                            width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 1.25C7.41421 1.25 7.75 1.58579 7.75 2V6C7.75 6.41421 7.41421 6.75 7 6.75C6.58579 6.75 6.25 6.41421 6.25 6V4.75H5C4.30964 4.75 3.75 5.30964 3.75 6V9.25H20.25V6C20.25 5.30964 19.6904 4.75 19 4.75H18.5C18.0858 4.75 17.75 4.41421 17.75 4C17.75 3.58579 18.0858 3.25 18.5 3.25H19C20.5188 3.25 21.75 4.48122 21.75 6V19C21.75 20.5188 20.5188 21.75 19 21.75H5C3.48122 21.75 2.25 20.5188 2.25 19V6C2.25 4.48122 3.48122 3.25 5 3.25H6.25V2C6.25 1.58579 6.58579 1.25 7 1.25ZM3.75 19C3.75 19.6904 4.30964 20.25 5 20.25H19C19.6904 20.25 20.25 19.6904 20.25 19V10.75H3.75V19ZM15 1.25C15.4142 1.25 15.75 1.58579 15.75 2V6C15.75 6.41421 15.4142 6.75 15 6.75C14.5858 6.75 14.25 6.41421 14.25 6V4.75H10.5C10.0858 4.75 9.75 4.41421 9.75 4C9.75 3.58579 10.0858 3.25 10.5 3.25H14.25V2C14.25 1.58579 14.5858 1.25 15 1.25Z" fill="#222222"/>
                        </svg>
                    </div>

                    <div className="input-group disabled">
                        <label htmlFor="phone">Номер телефона</label>
                        <input
                            type="text"
                            id="phone"
                            value={initialData.phone || '+7 705 600 43 07'}
                            disabled
                        />
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12C1.25 6.06294 6.06294 1.25 12 1.25ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 17.1086 6.89137 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM11.4521 16.4971C11.7292 16.1892 12.2038 16.1644 12.5117 16.4414C12.8196 16.7185 12.8445 17.1931 12.5674 17.501L12.5576 17.5117C12.2805 17.8196 11.8059 17.8445 11.498 17.5674C11.1905 17.2903 11.1656 16.8166 11.4424 16.5088L11.4521 16.4971ZM12 6.25C12.4142 6.25 12.75 6.58579 12.75 7V13C12.75 13.4142 12.4142 13.75 12 13.75C11.5858 13.75 11.25 13.4142 11.25 13V7C11.25 6.58579 11.5858 6.25 12 6.25Z" fill="#7A7A7A"/>
                        </svg>
                    </div>
                    <div className="help-text">
                        Для изменения номера телефона обратитесь в колл-центр
                    </div>

                    <button
                        type="submit"
                        className="save-button"
                        disabled={loading}
                    >
                        Сохранить изменения
                    </button>

                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;