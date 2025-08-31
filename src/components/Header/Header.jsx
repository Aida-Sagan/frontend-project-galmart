import React from 'react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Container from '../Container/Container';
import CatalogDropdown from '../Catalog/CatalogDropdown';
import SearchHistoryDropdown from './SearchHistoryDropdown';

import catalogIcon from '../../assets/svg/catalog.svg';
import searchIcon from '../../assets/svg/search.svg';
import cartIcon from '../../assets/svg/cart.svg';
import likeIcon from '../../assets/svg/like.svg';
import locationIcon from '../../assets/svg/location.svg';
import userIcon from '../../assets/svg/user.svg';
import { ReactComponent as LogoIcon } from '../../assets/svg/logo.svg';

import './style/Header.css';

const MoreIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="6" r="1.5" fill="#222"/><circle cx="12" cy="12" r="1.5" fill="#222"/><circle cx="12" cy="18" r="1.5" fill="#222"/></svg>);
const CloseIcon = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18 6L6 18" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M6 6L18 18" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>);

const Header = () => {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [isSearchFocused, setSearchFocused] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const closeMenu = () => setMenuOpen(false);

    return (
        <header className="header">
            <Container>
                <div className="header__content">
                    <div className="header__left">
                        <Link to="/" className="header__logo">
                            <LogoIcon className="footer__logo-icon" />
                        </Link>
                        <div className="header__search-container">
                            <div className="header__search-wrapper">
                                <div
                                    className="header__catalog-wrapper"
                                    {...(!isMobile && {
                                        onMouseEnter: () => setCatalogOpen(true),
                                        onMouseLeave: () => setCatalogOpen(false),
                                    })}
                                >
                                    <button
                                        className="header__catalog-btn"
                                        onClick={() => {
                                            if (isMobile) {
                                                navigate('/catalog');
                                            }
                                        }}
                                    >
                                        <img src={catalogIcon} alt="Каталог" />
                                        <span>Каталог</span>
                                    </button>
                                    {!isMobile && isCatalogOpen && <CatalogDropdown />}
                                </div>
                                <input
                                    type="text"
                                    className="header__search-input"
                                    placeholder="Поиск в galmart"
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => {
                                        setTimeout(() => setSearchFocused(false), 150);
                                    }}
                                />
                                <img src={searchIcon} alt="Поиск" className="header__search-icon" />
                            </div>
                            {isSearchFocused && <SearchHistoryDropdown />}
                        </div>
                    </div>
                    <div className="header__right">
                        <div className="header__icon-button">
                            <img src={locationIcon} alt="Город" />
                            <span>Астана</span>
                        </div>
                        <Link to="/favorites" className="header__icon-button header__icon-button--desktop">
                            <img src={likeIcon} alt="Избранное" />
                        </Link>
                        <Link to="/cart" className="header__icon-button header__icon-button--desktop">
                            <img src={cartIcon} alt="Корзина" />
                        </Link>
                        <Link to="/profile" className="header__icon-button header__icon-button--desktop">
                            <img src={userIcon} alt="Профиль" />
                        </Link>
                        <div className="header__icon-button header__icon-button--desktop">
                            <select>
                                <option>РУС</option>
                                <option>ҚАЗ</option>
                            </select>
                        </div>
                        <button className="header__more-btn" onClick={() => setMenuOpen(true)}>
                            <MoreIcon />
                        </button>
                    </div>
                </div>
            </Container>
            <div className={`header__mobile-backdrop ${isMenuOpen ? 'is-open' : ''}`} onClick={closeMenu}></div>
            <div className={`header__mobile-menu ${isMenuOpen ? 'is-open' : ''}`}>
                <div className="header__mobile-menu-header">
                    <button onClick={closeMenu} className="header__mobile-menu-close"><CloseIcon /></button>
                </div>
                <div className="header__mobile-menu-content">
                    <div className="header__mobile-menu-item-wrapper">
                        <Link to="/favorites" className="header__mobile-menu-item" onClick={closeMenu}>
                            <img src={likeIcon} alt="Избранное" />
                        </Link>
                        <span className="header__badge">99+</span>
                    </div>
                    <div className="header__mobile-menu-item-wrapper">
                        <Link to="/cart" className="header__mobile-menu-item" onClick={closeMenu}>
                            <img src={cartIcon} alt="Корзина" />
                        </Link>
                        <span className="header__badge">99+</span>
                    </div>
                    <div className="header__mobile-menu-item-wrapper">
                        <Link to="/profile" className="header__mobile-menu-item" onClick={closeMenu}>
                            <img src={userIcon} alt="Профиль" />
                        </Link>
                        <span className="header__badge">99+</span>
                    </div>
                    <div className="header__mobile-menu-item-wrapper">
                        <div className="header__mobile-menu-item">
                            <select>
                                <option>РУС</option>
                                <option>ҚАЗ</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;

