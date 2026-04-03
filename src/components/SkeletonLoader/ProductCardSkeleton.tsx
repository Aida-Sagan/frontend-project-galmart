import React from 'react';
import './styles/ProductCardSkeleton.css';

const ProductCardSkeleton = () => {
    return (
        <div className="product-card-skeleton">
            <div className="skeleton skeleton-image"></div>
            <div className="skeleton skeleton-text"></div>
            <div className="skeleton skeleton-text short"></div>
            <div className="skeleton skeleton-price"></div>
        </div>
    );
};

export default ProductCardSkeleton;