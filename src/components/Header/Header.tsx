import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import Container from '../Container/Container';
import CatalogDropdown from '../Catalog/CatalogDropdown';
import SearchHistoryDropdown from './SearchHistoryDropdown';
import { locationStore } from '../../stores/locationStore';
import { observer } from 'mobx-react-lite';
import { searchStore } from '../../stores/searchStore';

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

const Header = observer((): any => {
    const [isCatalogOpen, setCatalogOpen] = useState(false);
    const [isSearchFocused, setSearchFocused] = useState(false);
    const [isMenuOpen, setMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    const {
        searchValue,
        setSearchValue,
        performSearch,
        pageData,
        isLoading,
        searchHistory
    } = searchStore;

    const { selectedAddress, city, openLocationModal } = locationStore;
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth <= 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchValue.trim().length > 2) {
                performSearch(searchValue);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [searchValue, performSearch]);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && searchValue.trim().length > 2) {
            performSearch(searchValue);
            navigate(`/search?query=${encodeURIComponent(searchValue)}`);
            setSearchFocused(false);
            e.target.blur();
        }
    };

    const closeMenu = () => setMenuOpen(false);

    const locationText = selectedAddress?.base_address
        || selectedAddress?.address
        || city?.name
        || 'Выберите город';

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
                                        onClick={() => navigate('/catalog')}
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
                                    value={searchValue}
                                    onChange={(e) => setSearchValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => setSearchFocused(true)}
                                    onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                                />
                                <img src={searchIcon} alt="Поиск" className="header__search-icon" />
                            </div>
                            {isSearchFocused && (
                                <SearchHistoryDropdown
                                    results={pageData}
                                    isLoading={isLoading}
                                    searchValue={searchValue}
                                    history={searchHistory}
                                />
                            )}
                        </div>
                    </div>
                    <div className="header__right">
                        <div className="header__icon-button">
                            <button className="header__icon-button header__location-btn" onClick={openLocationModal}>
                                <img src={locationIcon} alt="Город" />
                                <span className="location-text">{locationText}</span>
                            </button>
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
                            <select className="lang-select">
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
                            <span>Избранное</span>
                        </Link>
                    </div>
                    <div className="header__mobile-menu-item-wrapper">
                        <Link to="/cart" className="header__mobile-menu-item" onClick={closeMenu}>
                            <img src={cartIcon} alt="Корзина" />
                            <span>Корзина</span>
                        </Link>
                    </div>
                    <div className="header__mobile-menu-item-wrapper">
                        <Link to="/profile" className="header__mobile-menu-item" onClick={closeMenu}>
                            <img src={userIcon} alt="Профиль" />
                            <span>Профиль</span>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
});

export default Header;