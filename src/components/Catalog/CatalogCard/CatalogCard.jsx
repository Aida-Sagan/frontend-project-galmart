import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Catalog.css';

const RESTRICTED_CATEGORY_TITLE = 'алкоголь';

const CatalogCard = ({ category, openAgeModal }) => {
    const navigate = useNavigate();
    const isRestricted = category.title.toLowerCase().includes(RESTRICTED_CATEGORY_TITLE);
    const isVerified = sessionStorage.getItem('isAgeVerified') === 'true';

    const handleCardClick = (e) => {
        if (isRestricted && !isVerified) {
            // Если категория ограничена и возраст не подтвержден, открываем модальное окно
            openAgeModal(category);
        } else {
            // В противном случае, выполняем навигацию вручную
            navigate(`/catalog/${category.id}`);
        }
    };

    return (
        <div
            className="catalog-page__card"
            style={{
                backgroundColor: category.color,
                gridColumn: `span ${category.width || 1}`,
                gridRow: `span ${category.height || 1}`,
                cursor: 'pointer'
            }}
            onClick={handleCardClick}
        >
            <h3 className="catalog-page__card-title">{category.title}</h3>
            <img
                src={category.image}
                alt={category.title}
                className="catalog-page__card-image"
            />
        </div>
    );
};

export default CatalogCard;