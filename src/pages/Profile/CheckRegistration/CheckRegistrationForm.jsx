import React, { useState, useMemo } from 'react';
import Loader from '../../../components/Loader/Loader.jsx';
import CustomDropdown from './CustomActionDropdown.jsx';
import { registerCheck } from '../../../api/services/profileService.js';
import InputMask from 'react-input-mask';
import './styles/CheckRegistrationForm.css';

const AddImageIcon = () => (
    <svg width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.959 18.4268C23.4592 18.427 23.8651 18.8328 23.8652 19.333V22.0518H26.584C27.0842 22.052 27.4901 22.4578 27.4902 22.958C27.4902 23.4584 27.0843 23.864 26.584 23.8643H23.8652V26.583C23.8652 27.0834 23.4593 27.489 22.959 27.4893C22.4585 27.4893 22.0527 27.0835 22.0527 26.583V23.8643H19.334C18.8335 23.8643 18.4277 23.4585 18.4277 22.958C18.4279 22.4576 18.8336 22.0518 19.334 22.0518H22.0527V19.333C22.0529 18.8326 22.4586 18.4268 22.959 18.4268ZM24.6504 2.71875C25.5511 2.71886 26.281 3.44895 26.2812 4.34961V15.708C26.2812 16.2085 25.8755 16.6143 25.375 16.6143C24.8746 16.6142 24.4688 16.2085 24.4688 15.708V4.53125H4.53125V17.958L11.7266 14.875C11.9608 14.7747 12.227 14.7783 12.459 14.8838L19.1045 17.9043C19.56 18.1115 19.7618 18.6489 19.5547 19.1045C19.3475 19.56 18.8101 19.7608 18.3545 19.5537L12.0732 16.6992L4.53125 19.9307V24.4688H15.709C16.2093 24.469 16.6152 24.8746 16.6152 25.375C16.6152 25.8754 16.2093 26.281 15.709 26.2812H4.35059C3.4498 26.2812 2.71896 25.5511 2.71875 24.6504V4.34961C2.71896 3.44887 3.4498 2.71875 4.35059 2.71875H24.6504ZM19.334 6.34375C21.169 6.344 22.6562 7.83195 22.6562 9.66699C22.6561 11.5019 21.1689 12.989 19.334 12.9893C17.4989 12.9893 16.0109 11.502 16.0107 9.66699C16.0107 7.8318 17.4988 6.34375 19.334 6.34375ZM19.334 8.15625C18.4998 8.15625 17.8232 8.83281 17.8232 9.66699C17.8234 10.501 18.4999 11.1768 19.334 11.1768C20.1678 11.1765 20.8436 10.5009 20.8438 9.66699C20.8438 8.83297 20.1679 8.1565 19.334 8.15625Z" fill="#FBFBFB"/>
    </svg>
);

const StatusModal = ({ isOpen, onClose, type, message }) => {
    if (!isOpen) return null;
    return (
        <div className="g-modal-backdrop">
            <div className="g-status-card">
                <button className="g-close-icon" onClick={onClose}>&times;</button>
                <div className="g-modal-content-area">
                    <p className="g-status-text">{message}</p>
                    <button
                        className={`g-confirm-btn ${type === 'success' ? 'g-btn-success' : 'g-btn-error'}`}
                        onClick={onClose}
                    >
                        Понятно
                    </button>
                </div>
            </div>
        </div>
    );
};

const CheckRegistrationForm = ({ checkRegistrationData, isLoading, error }) => {
    const [selectedAction, setSelectedAction] = useState(null);
    const [selectedShop, setSelectedShop] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [promoCode, setPromoCode] = useState('');
    const [photoFiles, setPhotoFiles] = useState([null, null, null, null]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: 'success', message: '' });

    const actions = checkRegistrationData?.actions || [];
    const realShops = checkRegistrationData?.real_shops || [];

    const actionDetails = useMemo(() => actions.find(a => a.id === selectedAction), [selectedAction, actions]);
    const actionRequiresFields = useMemo(() => !!selectedAction && actionDetails?.fields?.length > 0, [selectedAction, actionDetails]);
    const actionHasMeetTimes = useMemo(() => actionRequiresFields && actionDetails.fields.some(f => f.meet_times?.length > 0), [actionRequiresFields, actionDetails]);

    const shopsForCheckData = useMemo(() => {
        if (!actionRequiresFields) return [];
        const relevantShopIds = actionDetails.fields.map(field => field.shop_id);
        return realShops.filter(shop => relevantShopIds.includes(shop.id));
    }, [actionRequiresFields, actionDetails, realShops]);

    const availableShopsForAction = useMemo(() => {
        if (!actionHasMeetTimes) return [];
        return actionDetails.fields
            .filter(field => field.meet_times?.length > 0)
            .map(field => ({
                id: field.shop_id,
                name: realShops.find(shop => shop.id === field.shop_id)?.name || field.shop_name,
                meet_times: field.meet_times
            }));
    }, [actionHasMeetTimes, actionDetails, realShops]);

    const availableTimeSlots = useMemo(() => {
        if (!selectedShop) return [];
        return availableShopsForAction.find(s => s.id === selectedShop)?.meet_times || [];
    }, [selectedShop, availableShopsForAction]);

    const resetForm = () => {
        setSelectedAction(null);
        setSelectedShop(null);
        setSelectedTimeSlot(null);
        setPromoCode('');
        setPhotoFiles([null, null, null, null]);
        setFirstName('');
        setLastName('');
        setPhone('');
    };

    const handleRegistrationSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const payload = {
                actions_id: selectedAction ? Number(selectedAction) : null,
                name: firstName,
                second_name: lastName,
                phone: phone.replace(/\D/g, ''),
                code: promoCode,
                meet_time_id: selectedTimeSlot ? Number(selectedTimeSlot) : null,
                photos: photoFiles.filter(f => f !== null).map(f => f.name)
            };

            const response = await registerCheck(payload);

            if (response.status === 201 || response.status === 200) {
                setModalConfig({ isOpen: true, type: 'success', message: 'Чек успешно зарегистрирован!' });
            }
        } catch (err) {
            let errorMsg = 'Ошибка при регистрации';
            const serverData = err.response?.data;
            const serverMsg = serverData?.message || "";

            if (typeof serverData === 'string' && serverData.includes("invalid literal")) {
                errorMsg = "Некорректный формат данных. Убедитесь, что все поля заполнены правильно.";
            } else if (serverMsg.includes("duplicate") || serverMsg.includes("already exists")) {
                errorMsg = `Промокод "${promoCode}" уже зарегистрирован в системе.`;
            } else if (serverMsg) {
                errorMsg = serverMsg;
            }
            setModalConfig({ isOpen: true, type: 'error', message: errorMsg });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading || isSubmitting) return <Loader />;
    if (error) return <p className="error-message">Ошибка при загрузке данных: {error}</p>;

    return (
        <>
            <form onSubmit={handleRegistrationSubmit} className="check-registration-form-wrapper">
                <h2 className="content-title">Регистрация чека</h2>
                <section className="form-section">
                    <p className="section-instruction-title">Выбор акции</p>
                    <div className="form-group">
                        <CustomDropdown
                            value={selectedAction}
                            options={actions.map(a => ({ id: a.id, title: a.title }))}
                            onChange={(id) => { setSelectedAction(id); setSelectedShop(null); setSelectedTimeSlot(null); }}
                            placeholder="Акция"
                        />
                    </div>
                </section>

                <section className="form-section">
                    <p className="section-instruction-title">Личные данные</p>
                    <div className="form-group floating-label">
                        <input type="text" placeholder="Имя" required className="form-input" value={firstName} onChange={e => setFirstName(e.target.value)} />
                        <label>Имя</label>
                    </div>
                    <div className="form-group floating-label">
                        <input type="text" placeholder="Фамилия" required className="form-input" value={lastName} onChange={e => setLastName(e.target.value)} />
                        <label>Фамилия</label>
                    </div>
                    <div className="form-group floating-label">
                        <InputMask
                            mask="+7 (999) 999-99-99"
                            value={phone}
                            onChange={e => setPhone(e.target.value)}
                        >
                            {(inputProps) => (
                                <input
                                    {...inputProps}
                                    type="tel"
                                    id="phone"
                                    placeholder="Номер телефона"
                                    required
                                    className="form-input"
                                />
                            )}
                        </InputMask>
                        <label htmlFor="phone">Номер телефона</label>
                    </div>
                </section>

                {actionRequiresFields && (
                    <section className="form-section">
                        <p className="section-instruction-title">Данные о чеке</p>
                        <div className="form-group floating-label">
                            <input type="text" placeholder="Код" value={promoCode} onChange={e => setPromoCode(e.target.value)} required className="form-input" />
                            <label>Код</label>
                        </div>
                        <div className="form-group">
                            <CustomDropdown
                                value={selectedShop}
                                options={shopsForCheckData.map(shop => ({ id: shop.id, title: shop.name }))}
                                onChange={setSelectedShop}
                                placeholder="Место покупки"
                            />
                        </div>
                    </section>
                )}

                {actionHasMeetTimes && (
                    <section className="form-section">
                        <p className="section-instruction-title">Дополнительно</p>
                        <div className="form-group">
                            <CustomDropdown
                                value={selectedShop}
                                options={availableShopsForAction.map(shop => ({ id: shop.id, title: shop.name }))}
                                onChange={id => { setSelectedShop(id); setSelectedTimeSlot(null); }}
                                placeholder="Место покупки"
                            />
                        </div>
                        <div className="form-group">
                            <CustomDropdown
                                value={selectedTimeSlot}
                                options={availableTimeSlots.map(slot => ({
                                    id: slot.id,
                                    title: `${slot.date} ${slot.time_start}-${slot.time_end}`
                                }))}
                                onChange={setSelectedTimeSlot}
                                placeholder="Время проведения"
                                disabled={!selectedShop}
                            />
                        </div>
                    </section>
                )}

                <button type="submit" className="btn-register-check" disabled={isSubmitting}>Зарегистрировать чек</button>
            </form>

            <StatusModal
                isOpen={modalConfig.isOpen}
                onClose={() => {
                    if (modalConfig.type === 'success') resetForm();
                    setModalConfig(prev => ({ ...prev, isOpen: false }));
                }}
                type={modalConfig.type}
                message={modalConfig.message}
            />
        </>
    );
};

export default CheckRegistrationForm;