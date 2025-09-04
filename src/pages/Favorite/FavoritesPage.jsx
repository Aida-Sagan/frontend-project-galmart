import React, { useEffect, useState } from 'react';
import ProductCard from '../../components/Product/ProductCard';
import Container from '../../components/Container/Container';
import { fetchFavorites, clearAllFavorites } from '../../api/services/authService';
import './styles/FavoritesPage.css';

const FavoritesPage = () => {
    const [favoriteProducts, setFavoriteProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFavorites = async () => {
            setLoading(true);
            try {
                const response = await fetchFavorites({ ordering: 'popular' });
                setFavoriteProducts(response.data || []);
            } catch (error) {
                console.error("Не удалось загрузить избранные товары:", error);
                setFavoriteProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadFavorites();
    }, []);

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
                            Очистить
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
                    <p>В избранном пока ничего нет.</p>
                )}
            </div>
        </Container>
    );
};

export default FavoritesPage;