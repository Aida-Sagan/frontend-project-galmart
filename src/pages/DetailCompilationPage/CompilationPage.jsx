import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { fetchCompilationById } from '../../api/services/fetchCompilationById.js';

import Container from '../../components/Container/Container';
import Loader from '../../components/Loader/Loader';
import ProductCard from '../../components/Product/ProductCard';
import Pagination from '../../components/Pagination/Pagination';
import './style/CompilationPage.css';


const CompilationPage = () => {
    const { id } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [compilationInfo, setCompilationInfo] = useState(null);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);

    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);

    // --- Логика загрузки данных ---
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const data = await fetchCompilationById(id, pageFromUrl);
            if (data) {
                setCompilationInfo(data);
                setProducts(data.goods_list || []);
                setTotalPages(data.total_pages || 1);
                // setTotalPages(10);
                setCurrentPage(pageFromUrl);
            }
            setLoading(false);
            window.scrollTo(0, 0);
        };

        loadInitialData();
    }, [id, pageFromUrl]);

    // --- Логика для кнопки "Показать ещё" ---
    const handleLoadMore = async () => {
        if (loadingMore || currentPage >= totalPages) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;
        const data = await fetchCompilationById(id, nextPage);

        if (data && data.goods_list) {
            setProducts(prevProducts => [...prevProducts, ...data.goods_list]);
            setCurrentPage(nextPage);
        }
        setLoadingMore(false);
    };

    // --- Логика для пагинации ---
    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
    };

    if (loading) {
        return <Loader />;
    }

    if (!compilationInfo) {
        return <Container><div>Не удалось загрузить данные подборки.</div></Container>;
    }

    return (
        <Container>
            <div className="compilation-page">
                {compilationInfo.image && <img src={compilationInfo.image} alt={compilationInfo.title} className="compilation-banner" />}
                <h1 className="compilation-title">{compilationInfo.title}</h1>

                {compilationInfo.text_html && <div className="compilation-description" dangerouslySetInnerHTML={{ __html: compilationInfo.text_html }} />}

                <div className="compilation-grid">
                    {products.map(product => (
                        <ProductCard key={`${product.id}-${Math.random()}`} product={product} />
                    ))}
                </div>

                {/* Кнопка "Показать ещё" появляется, если есть еще страницы для загрузки */}
                {currentPage < totalPages && (
                    <div className="show-more-container">
                        <button onClick={handleLoadMore} disabled={loadingMore} className="show-more-button">
                            {loadingMore ? 'Загрузка...' : 'Показать ещё'}
                        </button>
                    </div>
                )}

                {/* Пагинация отображается всегда (если страниц больше одной) */}
                <Pagination
                    currentPage={pageFromUrl}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </Container>
    );
};

export default CompilationPage;