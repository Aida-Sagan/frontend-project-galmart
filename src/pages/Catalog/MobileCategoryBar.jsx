import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import './style/MobileCategoryBar.css';

const MobileCategoryBar = ({ categories }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [openCategories, setOpenCategories] = useState({});
    const { categoryId, subcategoryId } = useParams();

    useEffect(() => {
        if (isModalOpen) {
            if (categoryId) {
                setOpenCategories({ [categoryId]: true });
            } else if (categories && categories.length > 0) {
                setOpenCategories({ [categories[0].id]: true });
            }
        }
    }, [isModalOpen, categoryId, categories]);

    const toggleCategory = (id) => {
        setOpenCategories(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    if (!categories || categories.length === 0) {
        return null;
    }

    const firstCategory = categories[0];

    return (
        <div className="mobile-category-bar-wrapper">
            {/* Рендерим текущую категорию из URL или первую по умолчанию */}
            <div className="mobile-category-item">
                <div className="mobile-category-header" onClick={() => toggleCategory(categoryId || firstCategory.id)}>
                    <NavLink
                        to={`/catalog/${categoryId || firstCategory.id}`}
                        className="mobile-category-link"
                    >
                        {categories.find(c => c.id === parseInt(categoryId))?.title || firstCategory.title}
                    </NavLink>
                    {/* Стрелка "открыта" только для первой категории */}
                    <span className={`arrow-icon ${openCategories[categoryId || firstCategory.id] ? 'open' : ''}`}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 9L12 15L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </span>
                </div>
                {/* Список подкатегорий текущей категории */}
                {(categoryId || firstCategory) && openCategories[categoryId || firstCategory.id] && (
                    <ul className="mobile-subcategory-list">
                        {(categories.find(c => c.id === parseInt(categoryId))?.sections || firstCategory.sections || []).map(sub => (
                            <li key={sub.id}>
                                <NavLink
                                    to={`/catalog/${categoryId || firstCategory.id}/${sub.id}`}
                                    className={`mobile-subcategory-link ${parseInt(sub.id) === parseInt(subcategoryId) ? 'active' : ''}`}
                                    onClick={() => setIsModalOpen(false)}
                                >
                                    {sub.title}
                                </NavLink>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Кнопка для открытия модального окна */}
            <button className="mobile-category-toggle-btn" onClick={() => setIsModalOpen(true)}>
                Смотреть все категории
            </button>

            {/* Модальное окно */}
            {isModalOpen && (
                <div className="mobile-category-modal">
                    <div className="modal-header">
                        <h2>Каталог</h2>
                        <button onClick={() => setIsModalOpen(false)} className="close-btn">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                    </div>
                    <ul className="modal-category-list">
                        {categories.map(category => {
                            const isOpen = !!openCategories[category.id];
                            const isActive = parseInt(category.id) === parseInt(categoryId);

                            return (
                                <li key={category.id}>
                                    <div className="modal-category-header" onClick={() => toggleCategory(category.id)}>
                                        <NavLink
                                            to={`/catalog/${category.id}`}
                                            onClick={() => setIsModalOpen(false)}
                                            className={`modal-category-link ${isActive ? 'active' : ''}`}
                                        >
                                            {category.title}
                                        </NavLink>
                                        {category.sections?.length > 0 && (
                                            <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                    <path d="M18 9L12 15L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                                </svg>
                                            </span>
                                        )}
                                    </div>
                                    {category.sections?.length > 0 && isOpen && (
                                        <ul className="modal-subcategory-list">
                                            {category.sections.map(sub => (
                                                <li key={sub.id}>
                                                    <NavLink
                                                        to={`/catalog/${category.id}/${sub.id}`}
                                                        onClick={() => setIsModalOpen(false)}
                                                        className={`modal-subcategory-link ${parseInt(sub.id) === parseInt(subcategoryId) ? 'active' : ''}`}
                                                    >
                                                        {sub.title}
                                                    </NavLink>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MobileCategoryBar;