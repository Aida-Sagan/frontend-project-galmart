import React, { useEffect, useState } from 'react';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { fetchHomePageData } from '../../api/services/homepageService';
import ProductCard from '../../components/Product/ProductCard';
import Container from '../../components/Container/Container';
import './styles/FavoritesPage.css';

const FavoritesPage = () => {
    const { favoriteIds } = useFavorites();
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadProducts = async () => {
            const data = await fetchHomePageData();
            if (data && data.product_offers) {
                const products = data.product_offers.flatMap(offer => offer.goods);
                setAllProducts(products);
            }
            setLoading(false);
        };
        loadProducts();
    }, []);

    const favoriteProducts = allProducts.filter(product => favoriteIds.includes(product.id));

    if (loading) {
        return <Container><div>Загрузка...</div></Container>;
    }

    return (
        <Container>
            <div className="favorites-page">
                <div className="favorites-header">
                    <h1>Избранное</h1>
                    <button className="clear-favorites-btn">Очистить</button>
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