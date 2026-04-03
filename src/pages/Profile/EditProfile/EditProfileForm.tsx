import React, { useState, useRef, useEffect } from 'react';
import { editUserInfo } from '../../../endpoint-service/services/profileService';
import Loader from '../../../components/Loader/Loader';
import { profileStore } from '../../../stores/profileStore';
import { InputText, Button } from '../../../components/ui';
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
    const { fetchUserProfile } = profileStore;
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
                        <InputText
                            name="name"
                            value={formData.name}
                            onChange={(val) => setFormData({ ...formData, name: val })}
                            label="Имя"
                            placeholder="Введите имя"
                        />
                    </div>

                    <div className="input-group">
                        <InputText
                            name="surname"
                            value={formData.surname}
                            onChange={(val) => setFormData({ ...formData, surname: val })}
                            label="Фамилия"
                            placeholder="Введите фамилию"
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
                        <InputText
                            value={initialData.phone || '+7 705 600 43 07'}
                            onChange={() => {}}
                            label="Номер телефона"
                            disabled
                        />
                    </div>
                    <div className="help-text">
                        Для изменения номера телефона обратитесь в колл-центр
                    </div>

                    <Button
                        type="submit"
                        variant="filled"
                        fullWidth
                        disabled={loading}
                    >
                        Сохранить изменения
                    </Button>

                </form>
            </div>
        </div>
    );
};

export default EditProfileForm;