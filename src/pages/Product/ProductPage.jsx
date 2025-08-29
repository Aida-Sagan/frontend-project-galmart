import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSectionDetails } from '../../api/services/catalogService.js';
import ProductGallery from '../../components/Product/Detail/ProductGallery.jsx';
import ProductActions from '../../components/Product/Detail/ProductActions';
import ProductDetails from '../../components/Product/Detail/ProductDetails';
import RecommendedProducts from '../../components/Product/Detail/RecommendedProducts';
import './styles/ProductPage.css';

const ProductPage = () => {
    const { sectionId, productId } = useParams();
    const [product, setProduct] = useState(null);
    const [recommended, setRecommended] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);

    useEffect(() => {
        const loadProductData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const sectionData = await fetchSectionDetails(sectionId);

                if (sectionData && sectionData.goods) {
                    const currentProduct = sectionData.goods.find(p => p.id === parseInt(productId));

                    if (currentProduct) {
                        setProduct(currentProduct);
                        const otherProducts = sectionData.goods.filter(p => p.id !== parseInt(productId));
                        setRecommended(otherProducts.slice(0, 5));
                    } else {
                        setError('Товар не найден в данной секции.');
                    }
                } else {
                    setError('Не удалось загрузить данные категории.');
                }
            } catch (err) {
                setError('Произошла ошибка при загрузке.');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        if (sectionId && productId) {
            loadProductData();
        }
    }, [sectionId, productId]);

    if (isLoading) {
        return <div className="loading-message"></div>;
    }

    if (error) {
        return <div className="error-message">{error}</div>;
    }

    if (!product) {
        return <div className="error-message">Товар не найден</div>;
    }

    const nutritionalInfo = {
        calories: product.calories || 59,
        protein: product.protein || 2.9,
        fat: product.fat || 3.2,
        carbohydrates: product.carbohydrates || 4.7,
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

            <RecommendedProducts items={recommended} currentSectionId={sectionId} />
        </div>
    );
};

export default ProductPage;