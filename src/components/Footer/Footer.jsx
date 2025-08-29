import React from 'react';

import { footerData } from './footerData';
import { ReactComponent as WhatsappIcon } from '../../assets/svg/whatsapp.svg';
import { ReactComponent as InstagramIcon } from '../../assets/svg/instagram.svg';
import { ReactComponent as LogoIcon } from '../../assets/svg/logo.svg';

import './style/Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer__container">

                <div className="footer__col footer__col--brand">
                    <div className="footer__logo">
                        <LogoIcon className="footer__logo-icon" />
                    </div>

                    {footerData.brand.description.map((text, i) => (
                        <p className="footer__text" key={i}>{text}</p>
                    ))}
                </div>

                <div className="footer__col">
                    <h4>{footerData.legal.title}</h4>
                    <ul>
                        {footerData.legal.links.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                </div>

                <div className="footer__col">
                    <h4>{footerData.buyers.title}</h4>
                    <ul>
                        {footerData.buyers.links.map((item, i) => (
                            <li key={i}>{item}</li>
                        ))}
                    </ul>
                    <h4>{footerData.buyers.corporateTitle}</h4>
                </div>

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

            <div className="footer__bottom">
                {footerData.copyright}
            </div>
        </footer>
    );
};

export default Footer;
