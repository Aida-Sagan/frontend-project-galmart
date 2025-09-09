import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Для кнопки "Войти"
import ProductCard from '../../components/Product/ProductCard';
import Container from '../../components/Container/Container';
import { fetchFavorites, clearAllFavorites } from '../../api/services/authService';

import emptyFavoritesIcon from '../../assets/favorite_empty.png';
import authRequiredIcon from '../../assets/is_exists.png';

import './styles/FavoritesPage.css';

const FavoritesPage = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);


    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('authToken');
            if (token) {
                setIsAuthenticated(true);
                try {
                    const response = await fetchFavorites({ ordering: 'popular' });
                    setFavoriteProducts(response.data || []);
                } catch (error) {
                    console.error("Не удалось загрузить избранные товары:", error);
                    setFavoriteProducts([]);
                }
            } else {
                setIsAuthenticated(false);
            }
            setLoading(false);
        };

        loadData();
    }, []);

    useEffect(() => {
        console.log('Состояние обновилось! Новое значение favoriteProducts:', favoriteProducts);
    }, [favoriteProducts]); // <-- Массив зависимостей

    const handleClearFavorites = async () => {
        try {
            await clearAllFavorites();
            setFavoriteProducts([]);
        } catch (error) {
            console.error("Ошибка при очистке избранного:", error);
        }
    };

    if (loading) {
        return <Container><div>Загрузка...</div></Container>;
    }

    /// если юзер не авторизован/не зарегистрирован
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

    /// если юзер  авторизован/ зарегистрирован
    return (
        <Container>
            <div className="favorites-page">
                <div className="favorites-header">
                    <h1>Избранное</h1>
                    {favoriteProducts.length > 0 && (
                        <button
                            onClick={handleClearFavorites}
                            className="clear-favorites-btn"
                        >
                            <span>Очистить избранное</span>
                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.4717 10.3486C22.5553 9.87283 23.0086 9.55525 23.4844 9.63867C23.9602 9.72234 24.2788 10.1755 24.1953 10.6514L21.8672 23.8887C21.5975 25.4227 20.2655 26.5419 18.708 26.542H9.29199C7.73449 26.5419 6.40252 25.4226 6.13281 23.8887L3.80469 10.6514C3.72121 10.1755 4.03979 9.72234 4.51562 9.63867C4.99142 9.55524 5.44465 9.87283 5.52832 10.3486L7.85547 23.5859C7.97806 24.2832 8.58412 24.7919 9.29199 24.792H18.708C19.4158 24.7919 20.022 24.2832 20.1445 23.5859L22.4717 10.3486ZM15.6045 1.45801C17.3763 1.45818 18.8125 2.8952 18.8125 4.66699V6.125H24.5C24.9832 6.125 25.375 6.51675 25.375 7C25.375 7.48325 24.9832 7.875 24.5 7.875H3.5C3.01675 7.875 2.625 7.48325 2.625 7C2.625 6.51675 3.01675 6.125 3.5 6.125H9.1875V4.66699C9.1875 2.89519 10.6237 1.45818 12.3955 1.45801H15.6045ZM12.3955 3.20801C11.5902 3.20818 10.9375 3.86168 10.9375 4.66699V6.125H17.0625V4.66699C17.0625 3.86168 16.4098 3.20818 15.6045 3.20801H12.3955Z" fill="#222222"/>
                            </svg>

                        </button>
                    )}
                </div>

                {favoriteProducts.length > 0 ? (
                    <div className="favorites-grid">
                        {favoriteProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    // Дизайн для пустого избранного
                    <div className="favorites-placeholder">
                        <img src={emptyFavoritesIcon} alt="В избранном пока пусто" className="placeholder-image" />
                        <h2 className="placeholder-title">В избранном пока пусто</h2>
                        <p className="placeholder-subtitle">Добавляйте товары в избранное, чтобы не потерять их из виду</p>
                    </div>
                )}
            </div>
        </Container>
    );
};

export default FavoritesPage;