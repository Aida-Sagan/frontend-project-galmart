import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCatalogData } from '../../api/services/catalogService';
import { catalogLayoutMap } from '../../config/catalogLayout';
import CatalogCard from '../../components/Catalog/CatalogCard/CatalogCard';
import CatalogCardSkeleton from '../../components/Catalog/CatalogCard/CatalogCardSkeleton';
import AgeVerificationModal from '../../components/Modals/AgeVerificationModal'; // Импорт модального окна
import Container from '../../components/Container/Container.jsx';

import './style/CatalogPage.css';

const RESTRICTED_CATEGORY_TITLE = 'алкоголь';

const skeletonLayout = Object.keys(catalogLayoutMap).map(id => ({
    id: `skeleton-${id}`,
    ...catalogLayoutMap[id],
}));

const CatalogPage = () => {
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
    const [targetCategory, setTargetCategory] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadCatalog = async () => {
            try {
                await new Promise(resolve => setTimeout(resolve, 1500));
                const data = await fetchCatalogData();
                const enrichedData = data.map(category => ({
                    ...category,
                    width: catalogLayoutMap[category.id]?.width || 1,
                    height: catalogLayoutMap[category.id]?.height || 1,
                }));
                setCategories(enrichedData);
            } catch (err) {
                setError('Не удалось загрузить каталог');
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        loadCatalog();
    }, []);

    const openAgeModal = (category) => {
        setTargetCategory(category);
        setIsAgeModalOpen(true);
    };

    const handleAgeConfirm = () => {
        sessionStorage.setItem('isAgeVerified', 'true');
        setIsAgeModalOpen(false);
        if (targetCategory) {
            navigate(`/catalog/${targetCategory.id}`);
        }
    };

    const handleAgeDecline = () => {
        setIsAgeModalOpen(false);
        setTargetCategory(null);
    };

    if (error) {
        return <h1 className="catalog-page__title error">{error}</h1>;
    }

    return (
        <Container>
            <div className="catalog-page">
                <h1 className="catalog-page__title">Каталог товаров</h1>
                <div className="catalog-page__grid">
                    {isLoading ? (
                        skeletonLayout.map(item => (
                            <CatalogCardSkeleton key={item.id} width={item.width} height={item.height} />
                        ))
                    ) : (
                        categories.map(category => (
                            <CatalogCard
                                key={category.id}
                                category={category}
                                openAgeModal={openAgeModal} // Передача функции
                            />
                        ))
                    )}
                </div>
            </div>
            <AgeVerificationModal
                isOpen={isAgeModalOpen}
                onConfirm={handleAgeConfirm}
                onDecline={handleAgeDecline}
            />
        </Container>
    );
};

export default CatalogPage;