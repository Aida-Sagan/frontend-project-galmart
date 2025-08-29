import React from 'react';
import { useState } from 'react';
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


const Header = () => {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [isSearchFocused, setSearchFocused] = useState(false);
    const navigate = useNavigate();

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
                                    onMouseEnter={() => setCatalogOpen(true)}
                                    onMouseLeave={() => setCatalogOpen(false)}
                                >
                                    <button
                                        className="header__catalog-btn"
                                        onClick={() => navigate('/catalog')}
                                    >
                                        <img src={catalogIcon} alt="Каталог" />
                                        <span>Каталог</span>
                                    </button>

                                    {isCatalogOpen && <CatalogDropdown />}
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

                        <Link to="/favorites" className="header__icon-button">
                            <img src={likeIcon} alt="Избранное" />
                        </Link>

                        <Link to="/cart" className="header__icon-button">
                            <img src={cartIcon} alt="Корзина" />
                        </Link>

                        <Link to="/profile" className="header__icon-button">
                            <img src={userIcon} alt="Профиль" />
                        </Link>

                        <div className="header__icon-button">
                            <select>
                                <option>РУС</option>
                                <option>ҚАЗ</option>
                            </select>
                        </div>
                    </div>
                </div>
            </Container>
        </header>
    );
};

export default Header;