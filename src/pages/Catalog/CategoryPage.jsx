import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import ProductCard from '../../components/Product/ProductCard';
import CategoryBanner from './CategoryBanner.jsx';
import SubcategoryCarousel from './SubcategoryCarousel.jsx';
import ChipsFilter from './ChipsFilter.jsx';
import ProductSortDropdown from './ProductSortDropdown.jsx';
import CategoryPageSkeleton from '../../components/SkeletonLoader/CategoryPageSkeleton.jsx';
import { fetchCatalogData, fetchSectionDetails } from '../../api/services/catalogService';
import './style/CategoryPage.css';

const CategoryPage = () => {
    const { categoryId, subcategoryId } = useParams();
    const [sortOption, setSortOption] = useState('popularity');
    const [sidebarData, setSidebarData] = useState([]);
    const [pageData, setPageData] = useState(null);
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeChipIds, setActiveChipIds] = useState([]);

    const isDeepLevelPage = !!subcategoryId;

    useEffect(() => {

        console.log('Содержимое pageData:', pageData);
    }, [pageData]);

    useEffect(() => {
        const loadPageData = async () => {
            setIsLoading(true);
            setError(null);
            setPageData(null);

            try {
                const allCategories = await fetchCatalogData();
                setSidebarData(allCategories || []);

                const currentParentId = parseInt(categoryId);
                if (!currentParentId) {
                    setIsLoading(false);
                    return;
                }

                if (isDeepLevelPage) {
                    const currentChildId = parseInt(subcategoryId);
                    const sectionDetails = await fetchSectionDetails(currentChildId);

                    if (!sectionDetails) {
                        setError('Не удалось найти данные для этой категории.');
                        return;
                    }

                    const parentCategory = allCategories.find(cat => cat.id === currentParentId);
                    const currentSection = parentCategory?.sections.find(sec => sec.id === currentChildId);

                    setPageData({
                        isDeepLevel: true,
                        title: currentSection?.title || sectionDetails.title,
                        chips: sectionDetails.categories || [],
                    });
                    setProducts(sectionDetails.goods || []);
                    setActiveChipIds([currentChildId]);

                } else {
                    const parentCategory = allCategories.find(cat => cat.id === currentParentId);
                    if (!parentCategory) {
                        setError('Не удалось найти родительскую категорию.');
                        return;
                    }

                    const firstSubcategory = parentCategory.sections?.[0];
                    const productsData = firstSubcategory ? (await fetchSectionDetails(firstSubcategory.id))?.goods || [] : [];

                    setPageData({
                        isDeepLevel: false,
                        banner: parentCategory,
                        carousel: parentCategory.sections,
                    });
                    setProducts(productsData);
                    if (firstSubcategory) {
                        setActiveChipIds([firstSubcategory.id]);
                    } else {
                        setActiveChipIds([]);
                    }
                }

            } catch (err) {
                console.error(err);
                setError('Произошла ошибка при загрузке данных.');
            } finally {
                setIsLoading(false);
            }
        };

        loadPageData();
    }, [categoryId, subcategoryId]);

    const handleFilterChange = (chipId) => {
        setActiveChipIds(prevIds => {
            if (prevIds.includes(chipId)) {
                return prevIds.filter(id => id !== chipId);
            } else {
                return [...prevIds, chipId];
            }
        });
    };

    const getSortedProducts = () => {
        const sorted = [...products];
        switch (sortOption) {
            case 'price-asc': sorted.sort((a, b) => a.unit_price - b.unit_price); break;
            case 'price-desc': sorted.sort((a, b) => b.unit_price - a.unit_price); break;
            case 'name-asc': sorted.sort((a, b) => a.title.localeCompare(b.title)); break;
            default: break;
        }
        return sorted;
    };

    const sortedProducts = getSortedProducts();

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
                    <ProductSortDropdown sortOption={sortOption} setSortOption={setSortOption} />
                </div>

                <div className="products-grid">
                    {sortedProducts.length > 0 ? (
                        sortedProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))
                    ) : (
                        <p className="no-products-message">Нет товаров в этой категории</p>
                    )}
                </div>
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