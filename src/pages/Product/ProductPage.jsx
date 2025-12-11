import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProductDetails } from '../../api/services/catalogService.js';
import ProductGallery from '../../components/Product/Detail/ProductGallery.jsx';
import ProductActions from '../../components/Product/Detail/ProductActions';
import ProductDetails from '../../components/Product/Detail/ProductDetails';
import RecommendedProducts from '../../components/Product/Detail/RecommendedProducts';
import './styles/ProductPage.css';

const ProductPage = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const loadProductData = async () => {
            setIsLoading(true);
            setError(null);
            setProduct(null);

            try {
                const currentProduct = await fetchProductDetails(productId);
                setProduct(currentProduct);

            } catch (err) {
                setError('Произошла ошибка при загрузке товара.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (productId) {
            loadProductData();
        }
    }, [productId]);

    if (isLoading) {
        return <div className="loading-message">Загрузка...</div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="error-message">Товар не найден</div>;
    }

    const nutritionalInfo = {
        calories: product.calories || 0,
        protein: product.protein || 0,
        fat: product.fat || 0,
        carbohydrates: product.carbohydrates || 0,
    };

    return (
        <div className="product-page-container">
            <div className="breadcrumbs">
                <Link to="/">Главная</Link> — <Link to="/catalog">Каталог товаров</Link> — <span>{product.title}</span>
            </div>

            <main className="product-main-section">
                <ProductGallery photos={product.photos} title={product.title} />
                <div className="product-info-wrapper">
                    <h1>{product.title}</h1>
                    <div className="product-tags">
                    </div>
                    <ProductActions product={product} />
                    <div className="nutritional-facts">
                        <h3>Пищевая ценность на 100 г</h3>
                        <div className="facts-grid">
                            <div className="fact-item"><span className="number">{nutritionalInfo.calories}</span> ккал</div>
                            <div className="fact-item"><span  className="number">{nutritionalInfo.protein}</span> белки</div>
                            <div className="fact-item"><span className="number">{nutritionalInfo.fat}</span> жиры</div>
                            <div className="fact-item"><span className="number">{nutritionalInfo.carbohydrates}</span> углеводы</div>
                        </div>
                    </div>
                    <ProductDetails product={product} isOpen={isDetailsOpen} />
                    <button
                        className="details-toggle-button"
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    >
                        {isDetailsOpen ? 'Меньше информации о товаре' : 'Подробнее о товаре'}
                    </button>
                </div>
            </main>

            <RecommendedProducts items={recommended} />
        </div>
    );
};

export default ProductPage;

