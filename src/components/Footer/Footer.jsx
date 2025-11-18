import React from 'react';
import { Link } from 'react-router-dom';
import { footerData } from './footerData';
import { ReactComponent as WhatsappIcon } from '../../assets/svg/whatsapp.svg';
import { ReactComponent as InstagramIcon } from '../../assets/svg/instagram.svg';
import { ReactComponent as LogoIcon } from '../../assets/svg/logo.svg';

import './style/Footer.css';

const Footer = () => {
    const firstLegalPath = `/legal/${footerData.legal?.links?.[0]?.path || ''}`;

    const firstCustomerPath = `/customer/${footerData.customer?.links?.[0]?.path || ''}`;

    return (
        <footer className="footer">
            <div className="footer__container">

                {/* 1. Брендинг */}
                <div className="footer__col footer__col--brand">
                    <div className="footer__logo">
                        <LogoIcon className="footer__logo-icon" />
                    </div>

                    {footerData.brand.description.map((text, i) => (
                        <p className="footer__text" key={i}>{text}</p>
                    ))}
                </div>

                {/* 2. Условия пользования (Legal) */}
                <div className="footer__col">
                    <h4>
                        <Link to={firstLegalPath} className="footer__link-title">
                            {footerData.legal.title}
                        </Link>
                    </h4>
                    <ul>
                        {/* Рендеринг ссылок Legal */}
                        {footerData.legal.links.map((item, i) => (
                            <li key={i}>
                                <Link to={`/legal/${item.path}`} className='title-item-link'>{item.title}</Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3. Покупателям (Customer) - ИСПРАВЛЕНО */}
                <div className="footer__col">
                    <h4>
                        <Link to={firstCustomerPath} className="footer__link-title">
                            {footerData.customer.title}
                        </Link>
                    </h4>
                    <ul>
                        {footerData.customer.links.map((item, i) => (
                            <li key={i}>
                                <Link to={`/customer/${item.path}`} className='title-item-link'>{item.title}</Link>
                            </li>
                        ))}
                    </ul>

                </div>

                {/* 4. Контакты */}
                <div className="footer__col">
                    <h4>{footerData.contacts.title}</h4>
                    <p><strong>{footerData.contacts.hotlineLabel}</strong><br />{footerData.contacts.hotline}</p>
                    <p><strong>{footerData.contacts.emailLabel}</strong></p>
                    {footerData.contacts.emails.map((email, i) => (
                        <p key={i}>{email}</p>
                    ))}
                    <div className="footer__socials">
                        <a href="#"><WhatsappIcon /></a>
                        <a href="#"><InstagramIcon /></a>
                    </div>
                </div>

            </div>

            {/* Копирайт */}
            <div className="footer__bottom">
                {footerData.copyright}
            </div>
        </footer>
    );
};

export default Footer;