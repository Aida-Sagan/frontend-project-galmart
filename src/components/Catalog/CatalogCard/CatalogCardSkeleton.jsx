import React from 'react';
import '../style/CatalogCardSkeleton.css';

const CatalogCardSkeleton = ({ width = 1, height = 1 }) => {
    return (
        <div
            className="catalog-card-skeleton"
            style={{
                gridColumn: `span ${width}`,
                gridRow: `span ${height}`,
            }}
        >
            <div className="skeleton-title"></div>
            <div className="skeleton-image"></div>
        </div>
    );
};

export default CatalogCardSkeleton;