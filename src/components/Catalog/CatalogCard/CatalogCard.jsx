import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Catalog.css';

const CatalogCard = ({ category }) => {

    return (
        <Link
            to={`/catalog/${category.id}`}
            className="catalog-page__card"
            style={{
                backgroundColor: category.color,
                gridColumn: `span ${category.width || 1}`,
                gridRow: `span ${category.height || 1}`,
            }}
        >
            <h3 className="catalog-page__card-title">{category.title}</h3>
            <img
                src={category.image}
                alt={category.title}
                className="catalog-page__card-image"
            />
        </Link>
    );
};

export default CatalogCard;