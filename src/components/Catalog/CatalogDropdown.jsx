import React, { useState, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { fetchCatalogData, fetchSectionDetails } from '../../api/services/catalogService';
import SkeletonLoader from '../SkeletonLoader/SkeletonLoader.jsx';
import AgeVerificationModal from '../../components/Modals/AgeVerificationModal';
import './style/Catalog.css';

const RESTRICTED_CATEGORY_TITLE = 'алкоголь';

const CatalogDropdown = () => {
    const [categories, setCategories] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [subCategoryCache, setSubCategoryCache] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isContentLoading, setIsContentLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isAgeModalOpen, setIsAgeModalOpen] = useState(false);
    const [targetCategory, setTargetCategory] = useState(null);
    const navigate = useNavigate();

    const activeCategory = categories.length > 0 ? categories[activeIndex] : null;

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const data = await fetchCatalogData();
                setCategories(data);
            } catch (err) {
                setError(err.message || 'Failed to load initial data');
            } finally {
                setIsLoading(false);
            }
        };
        loadInitialData();
    }, []);

    const loadAllSections = useCallback(async (sections) => {
        setIsContentLoading(true);
        try {
            const sectionsToLoad = sections.filter(section => !subCategoryCache[section.id]);

            if (sectionsToLoad.length === 0) {
                setIsContentLoading(false);
                return;
            }

            const promises = sectionsToLoad.map(section =>
                fetchSectionDetails(section.id).then(data => ({ id: section.id, data }))
            );

            const results = await Promise.all(promises);

            setSubCategoryCache(prevCache => {
                const newCacheEntries = results.reduce((acc, result) => {
                    if (result.data) {
                        acc[result.id] = result.data;
                    }
                    return acc;
                }, {});
                return {
                    ...prevCache,
                    ...newCacheEntries,
                };
            });
        } catch (err) {
            console.error("Failed to load section details", err);
        } finally {
            setIsContentLoading(false);
        }
    }, [subCategoryCache]);

    useEffect(() => {
        if (activeCategory?.sections.length > 0) {
            loadAllSections(activeCategory.sections);
        }
    }, [activeCategory, loadAllSections]);

    const handleMouseEnter = (index) => {
        const category = categories[index];
        const isRestricted = category.title.toLowerCase().includes(RESTRICTED_CATEGORY_TITLE);
        const isVerified = sessionStorage.getItem('isAgeVerified') === 'true';

        if (isRestricted && !isVerified) {
            return;
        }

        setActiveIndex(index);
    };

    const handleCategoryClick = (category, index) => {
        const isRestricted = category.title.toLowerCase().includes(RESTRICTED_CATEGORY_TITLE);
        const isVerified = sessionStorage.getItem('isAgeVerified') === 'true';

        if (isRestricted && !isVerified) {
            setTargetCategory(category);
            setIsAgeModalOpen(true);
            return;
        }

        setActiveIndex(index);
        navigate(`/catalog/${category.id}`);
    };

    const handleAgeConfirm = () => {
        sessionStorage.setItem('isAgeVerified', 'true');
        setIsAgeModalOpen(false);
        if (targetCategory) {
            const targetIndex = categories.findIndex(cat => cat.id === targetCategory.id);
            if (targetIndex !== -1) {
                setActiveIndex(targetIndex);
            }
            navigate(`/catalog/${targetCategory.id}`);
        }
    };

    const handleAgeDecline = () => {
        setIsAgeModalOpen(false);
        setTargetCategory(null);
        setActiveIndex(0);
    };

    if (isLoading) return <div className="catalog-dropdown-message"></div>;
    if (error) return <div className="catalog-dropdown-message error">{error}</div>;
    if (!activeCategory) return null;

    return (
        <div className="catalog-dropdown">
            <div className="catalog-sidebar">
                {categories.map((category, index) => {
                    const isRestricted = category.title.toLowerCase().includes(RESTRICTED_CATEGORY_TITLE);
                    const isVerified = sessionStorage.getItem('isAgeVerified') === 'true';

                    const shouldShowNavLink = !isRestricted || isVerified;

                    return (
                        <div
                            key={category.id}
                            className={`catalog-sidebar-item ${index === activeIndex ? 'active' : ''}`}
                            onMouseEnter={() => handleMouseEnter(index)}
                            onClick={() => handleCategoryClick(category, index)}
                        >
                            {shouldShowNavLink ? (
                                <NavLink to={`/catalog/${category.id}`} className="sidebar-link">
                                    {category.title}
                                </NavLink>
                            ) : (
                                <span className="sidebar-link">
                                    {category.title}
                                </span>
                            )}
                            {index === activeIndex && (
                                <svg className="arrow-icon" width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L5.93934 7L0.46967 12.4697C0.176777 12.7626 0.176777 13.2374 0.46967 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L7.53033 7.53033C7.82322 7.23744 7.82322 6.76256 7.53033 6.46967L1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967Z" fill="#902067"/>
                                </svg>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="catalog-content">
                <NavLink to={`/catalog/${activeCategory.id}`} className="catalog-title-link">
                    <h3 className="catalog-title">{activeCategory.title}</h3>
                </NavLink>
                {isContentLoading ? (
                    <SkeletonLoader />
                ) : (
                    <div className="catalog-columns-wrapper">
                        {activeCategory.sections.length > 0 ? (
                            activeCategory.sections.map((section) => {
                                const subCategoriesData = subCategoryCache[section.id];
                                // ИСПРАВЛЕНО: Теперь берем массив 'categories' из объекта данных секции
                                const subCategoriesList = subCategoriesData?.categories || [];

                                return (
                                    <div key={section.id} className="catalog-column">
                                        <NavLink to={`/catalog/${activeCategory.id}/${section.id}`} className="catalog-subtitle-link">
                                            <h4 className="catalog-subtitle">{section.title}</h4>
                                        </NavLink>
                                        <ul className="catalog-list">
                                            {subCategoriesList.map((sub) => (
                                                <li key={sub.id}>
                                                    <div className="catalog-list-item">
                                                        {sub.title}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                );
                            })
                        ) : (
                            <p>В этой категории нет разделов.</p>
                        )}
                    </div>
                )}
            </div>

            <AgeVerificationModal
                isOpen={isAgeModalOpen}
                onConfirm={handleAgeConfirm}
                onDecline={handleAgeDecline}
            />
        </div>
    );
};

export default CatalogDropdown;