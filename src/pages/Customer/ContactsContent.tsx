import React, { useState } from 'react';
import './style/ContactsPage.css';
import { ReactComponent as WhatsappIcon } from '../../assets/svg/whatsapp.svg';
import { ReactComponent as InstagramIcon } from '../../assets/svg/instagram.svg';


const supermarketData = {
    Астана: [
        { title: 'ТРЦ Abu Dhabi Plaza', address: 'ул. Сыганак 60/5', schedule: 'Ежедневно 09:00 - 22:00' },
        { title: 'ЖК Австрийский квартал', address: 'ул. Шамши Калдаяков, 6', schedule: 'Ежедневно 08:00 - 21:45' },
        { title: 'ЖК Ак-булак', address: 'ул. Амман, 21', schedule: 'Ежедневно 08:00 - 22:45' },
        { title: 'ЖК Europe City', address: 'ул. Акмешит, 1 блок 3', schedule: 'Ежедневно 08:00 - 23:45' },
        { title: 'ТРЦ Keruen', address: 'ул. Достык, 9', schedule: 'Ежедневно 09:00 - 23:45', mapPoint: true },
        { title: 'ТРЦ Keruen City', address: 'ш. Коргалжын, 1', schedule: 'Ежедневно 09:00 - 23:45' },
        { title: 'ТРЦ Mega Silk Way', address: 'пр-кт. Кабанбай батыр, 62', schedule: 'Ежедневно 09:00 - 23:45' },
        { title: 'Международный аэропорт Нурсултан Назарбаев', address: 'пр-кт. Кабанбай батыр, 119', schedule: 'Круглосуточно' },
    ],
    Алматы: [],
};


const ContactsPage = () => {
    const [activeCity, setActiveCity] = useState('Астана');

    const addresses = supermarketData[activeCity];

    const AddressItem = ({ title, address, schedule, mapPoint }) => (
        <div className="address-item">
            <div className="address-info">
                <p className="address-title">
                    {title}
                </p>
                <p className="address-details">{address}</p>
                <p className="address-details-schedule">{schedule}</p>
            </div>
            <div className={`location-icon ${mapPoint ? 'location-icon--highlight' : ''}`}>
                <div className="pin-icon"></div>
            </div>
        </div>
    );

    return (
        <div className="contacts-container">
            <h1 className="contacts-title">Контакты</h1>

            <div className="contact-details">
                <div className="contact-item">
                    <p className="contact-label">Название компании</p>
                    <p className="contact-value">ТОО "Жетi Аспан Сервис"</p>
                </div>

                <div className="contact-item">
                    <p className="contact-label">ИНН / БИН</p>
                    <p className="contact-value">121040010003</p>
                </div>

                <div className="contact-item">
                    <p className="contact-label">Юридический адрес</p>
                    <p className="contact-value">
                        Республика Казахстан, г. Астана, ул. Сарайшық 32/2
                    </p>
                </div>

                <div className="contact-item">
                    <p className="contact-label">Служба поддержки</p>
                    <p className="contact-value">+7 (701) 444 7557</p>
                </div>

                <div className="contact-item">
                    <p className="contact-label">Email</p>
                    <p className="contact-value">info@galmart.kz</p>
                </div>

                <div className="contact-item contact-item--social">
                    <p className="contact-label">Социальные сети</p>
                    <div className="social-icons">
                        <a href="#" className="social-icon"><WhatsappIcon /></a>
                        <a href="#" className="social-icon"><InstagramIcon /></a>
                    </div>
                </div>
            </div>

            <div className="addresses-header">
                <h2 className="addresses-title">Адреса супермаркетов</h2>

                <div className="city-selector">
                    <button
                        className={`city-button ${activeCity === 'Астана' ? 'city-button--active' : ''}`}
                        onClick={() => setActiveCity('Астана')}
                    >
                        Астана
                    </button>
                    <button
                        className={`city-button ${activeCity === 'Алматы' ? 'city-button--active' : ''}`}
                        onClick={() => setActiveCity('Алматы')}
                    >
                        Алматы
                    </button>
                </div>
            </div>

            <div className="addresses-list">
                {addresses.map((item, index) => (
                    <React.Fragment key={index}>
                        <AddressItem {...item} />
                        {item.mapPoint && (
                            <div className="map-placeholder">

                                <div className="map-zoom-controls">
                                    <button className="map-zoom-button">+</button>
                                    <button className="map-zoom-button">-</button>
                                </div>
                                <div className="map-current-location"></div>
                            </div>
                        )}
                    </React.Fragment>
                ))}
            </div>

        </div>
    );
};

export default ContactsPage;