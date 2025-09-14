import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ProductCard from '../../components/Product/ProductCard';
import CategoryBanner from './CategoryBanner.jsx';
import SubcategoryCarousel from './SubcategoryCarousel.jsx';
import ChipsFilter from './ChipsFilter.jsx';
import ProductSortDropdown from './ProductSortDropdown.jsx';
import Pagination from '../../components/Pagination/Pagination';
import CategoryPageSkeleton from '../../components/SkeletonLoader/CategoryPageSkeleton.jsx';
import { fetchCatalogData, fetchSectionDetails } from '../../api/services/catalogService';
import './style/CategoryPage.css';


const CategoryPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const [sortOption, setSortOption] = useState('popular');
    const [sidebarData, setSidebarData] = useState([]);
    const [pageData, setPageData] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChipIds, setActiveChipIds] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
    const isDeepLevelPage = !!subcategoryId;

    useEffect(() => {
        const loadPageData = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const allCategories = await fetchCatalogData();
                setSidebarData(allCategories || []);

                const currentId = subcategoryId || categoryId;
                if (!currentId) {
                    setIsLoading(false);
                    return;
                }

                const apiParams = {
                    page: pageFromUrl,
                    ordering: sortOption,
                    categories: activeChipIds.join(','),
                };

                const sectionDetails = await fetchSectionDetails(currentId, apiParams);
                if (!sectionDetails) {
                    setError('Не удалось найти данные для этой категории.');
                    setIsLoading(false);
                    return;
                }

                const parentCategory = allCategories.find(cat => cat.id === parseInt(categoryId));
                setPageData({
                    isDeepLevel: isDeepLevelPage,
                    title: sectionDetails.title || parentCategory?.title,
                    banner: parentCategory,
                    carousel: parentCategory?.sections,
                    chips: sectionDetails.categories || [],
                });

                setProducts(sectionDetails.goods || []);
                setTotalPages(sectionDetails.total_pages || 1);
                // setTotalPages(10);

            } catch (err) {
                console.error(err);
                setError('Произошла ошибка при загрузке данных.');
            } finally {
                setIsLoading(false);
            }
        };

        loadPageData();
    }, [categoryId, subcategoryId, pageFromUrl, sortOption, activeChipIds]);

    const handlePageChange = (newPage) => {
        setSearchParams({ page: newPage });
        window.scrollTo(0, 0);
    };

    const handleSortChange = (newSort) => {
        setSortOption(newSort);
        setSearchParams({ page: '1' });
    };

    const handleFilterChange = (chipId) => {
        const newActiveIds = activeChipIds.includes(chipId)
            ? activeChipIds.filter(id => id !== chipId)
            : [...activeChipIds, chipId];
        setActiveChipIds(newActiveIds);
        setSearchParams({ page: '1' });
    };


    const handleLoadMore = async () => {
        if (loadingMore || currentPage >= totalPages) return;

        setLoadingMore(true);
        const nextPage = currentPage + 1;
        const currentId = subcategoryId || categoryId;
        const apiParams = {
            page: nextPage,
            ordering: sortOption,
            categories: activeChipIds.join(','),
        };
        const data = await fetchSectionDetails(currentId, apiParams);

        if (data && data.goods) {
            setProducts(prevProducts => [...prevProducts, ...data.goods]);
            setCurrentPage(nextPage);
        }
        setLoadingMore(false);
    };


    const renderContent = () => {
        if (isLoading) return <CategoryPageSkeleton />;
        if (error) return <div>{error}</div>;
        if (!pageData) return <div>Категория не найдена</div>;

        return (
            <>
                {pageData.isDeepLevel ? (
                    <div>
                        <h2 className="page-title">{pageData.title}</h2>
                        <ChipsFilter
                            items={pageData.chips}
                            activeIds={activeChipIds}
                            onFilterChange={handleFilterChange}
                            parentCategoryId={categoryId}
                        />
                    </div>
                ) : (
                    <>
                        <CategoryBanner
                            title={pageData.banner.title}
                            image={pageData.banner.image_273x200}
                            bg={pageData.banner.color}
                        />
                        <SubcategoryCarousel
                            subcategories={pageData.carousel}
                            parentId={categoryId}
                            color={pageData.banner.color}
                        />
                    </>
                )}

                <div className="product-sort-dropdown-wrapper">
                    <ProductSortDropdown sortOption={sortOption} setSortOption={handleSortChange} />
                </div>

                <div className="products-grid">
                    {products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p className="no-products-message">Нет товаров в этой категории</p>
                    )}
                </div>

                {currentPage < totalPages && (
                    <div className="show-more-container">
                        <button onClick={handleLoadMore} disabled={loadingMore} className="show-more-button">
                            {loadingMore ? 'Загрузка...' : 'Показать ещё'}
                        </button>
                    </div>
                )}

                <Pagination
                    currentPage={pageFromUrl}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </>
        );
    };

    return (
        <div className="category-page">
            <Sidebar categories={sidebarData} />
            <div className="category-content">
                {renderContent()}
            </div>
        </div>
    );
};

export default CategoryPage;