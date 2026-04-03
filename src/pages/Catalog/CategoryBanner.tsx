import React from 'react';
import './style/CategoryBanner.css';

const CategoryBanner = ({ title, image, bg }) => {
    return (
        <div
            className="category-banner"
            style={{ backgroundColor: bg }}
        >
            <div className="category-banner-content">
                <h2 className="title-banner-content">{title}</h2>
            </div>
            <div className="category-banner-image">
                <img src={image} alt={title} />
            </div>
        </div>
    );
};

export default CategoryBanner;
