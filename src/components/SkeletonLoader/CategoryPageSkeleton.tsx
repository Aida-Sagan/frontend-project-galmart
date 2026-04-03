import React from 'react';
import './styles/CategoryPageSkeleton.css';

const CategoryPageSkeleton = () => {
    return (
        <div className="category-content-skeleton">
            <div className="skeleton-banner"></div>
            <div className="skeleton-carousel">
                {Array.from({ length: 5 }).map((_, i) => <div key={i} className="skeleton-carousel-item"></div>)}
            </div>
            <div className="skeleton-sort"></div>
            <div className="skeleton-grid">
                {Array.from({ length: 8 }).map((_, i) => <div key={i} className="skeleton-product-card"></div>)}
            </div>
        </div>
    );
};

export default CategoryPageSkeleton;