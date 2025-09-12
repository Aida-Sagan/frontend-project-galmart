import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../../components/Product/ProductCard';
import Container from '../../components/Container/Container';
import { fetchFavorites, clearAllFavorites } from '../../api/services/authService';
import FavoriteSortDropdown from './FavoriteSortDropdown.jsx';
import { useMediaQuery } from '../../hooks/useMediaQuery';

import emptyFavoritesIcon from '../../assets/favorite_empty.png';
import authRequiredIcon from '../../assets/is_exists.png';

import './styles/FavoritesPage.css';

/// Компонент модального окна для подтверждения
const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <button className="modal-close-btn" onClick={onClose}>&times;</button>
                <h2>Очистить избранное?</h2>
                <p>Вы уверены, что хотите удалить список избранных товаров?</p>
                <div className="modal-actions">
                    <button className="modal-btn primary" onClick={onClose}>Не удалять</button>
                    <button className="modal-btn secondary" onClick={onConfirm}>Удалить</button>
                </div>
            </div>
        </div>
    );
};


const FavoritesPage = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [sortOption, setSortOption] = useState('descending');
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            if (token) {
                setIsAuthenticated(true);
                try {
                    const response = await fetchFavorites({ ordering: sortOption });
                    setFavoriteProducts(response.data || []);
                } catch (error) {
                    console.error("Не удалось загрузить избранные товары:", error);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        loadData();
    }, [sortOption]);

    const handleClearFavoritesClick = () => {
        setIsModalOpen(true);
    };

    /// Эта функция выполняет удаление ПОСЛЕ подтверждения в модальном окне
    const handleConfirmClear = async () => {
        try {
            await clearAllFavorites();
            setFavoriteProducts([]);
        } catch (error) {
            console.error("Ошибка при очистке избранного:", error);
        }
        setIsModalOpen(false);
    };

    if (loading) {
        return <Container><div>Загрузка...</div></Container>;
    }

    if (!isAuthenticated) {
        return (
            <Container>
                <div className="favorites-placeholder">
                    <img src={authRequiredIcon} alt="Войдите в аккаунт" className="placeholder-image" />
                    <h2 className="placeholder-title">Войдите или зарегистрируйтесь</h2>
                    <p className="placeholder-subtitle">Чтобы сохранять и просматривать избранное необходима авторизация</p>
                    <Link to="/login" className="auth-button">Войти</Link>
                </div>
            </Container>
        );
    }

    const DesktopHeader = (
        <div className="favorites-header desktop">
            <h1>Избранное</h1>
            {favoriteProducts.length > 0 && (
                <div className="header-actions">
                    <button onClick={handleClearFavoritesClick} className="clear-favorites-btn">
                        <span>Очистить избранное</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                    <FavoriteSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                </div>
            )}
        </div>
    );

    const MobileHeader = (
        <div className="favorites-header mobile">
            <div className="favorites-header-top">
                <h1>Избранное</h1>
                {favoriteProducts.length > 0 && (
                    <button onClick={handleClearFavoritesClick} className="clear-favorites-btn">
                        <span>Очистить избранное</span>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14Z" stroke="#222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                )}
            </div>
            {favoriteProducts.length > 0 && (
                <FavoriteSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
            )}
        </div>
    );

    return (
        <Container>
            <div className="favorites-page">
                {isMobile ? MobileHeader : DesktopHeader}

                {favoriteProducts.length > 0 ? (
                    <div className="favorites-grid">
                        {favoriteProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="favorites-placeholder">
                        <img src={emptyFavoritesIcon} alt="В избранном пока пусто" className="placeholder-image" />
                        <h2 className="placeholder-title">В избранном пока пусто</h2>
                        <p className="placeholder-subtitle">Добавляйте товары в избранное, чтобы не потерять их из виду</p>
                    </div>
                )}
            </div>

            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleConfirmClear}
            />
        </Container>
    );
};

export default FavoritesPage;