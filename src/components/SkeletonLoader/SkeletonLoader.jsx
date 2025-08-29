import React from 'react';
import './styles/SkeletonLoader.css';

const SkeletonLoader = ({ items = 3 }) => {
    return (
        <div className="skeleton-list">
            {Array.from({ length: items }).map((_, index) => (
                <div key={index} className="skeleton-item"></div>
            ))}
        </div>
    );
};

export default SkeletonLoader;