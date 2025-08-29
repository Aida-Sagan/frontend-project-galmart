import React from 'react';
import Container from '../../components/Container/Container.jsx';
import ProductCardSkeleton from '../SkeletonLoader/ProductCardSkeleton.jsx';
import './styles/MainPageSkeleton.css';

const MainPageSkeleton = () => {
    return (
        <Container>
            <div className="main-page-skeleton">
                <div className="skeleton skeleton-banner"></div>

                <div className="skeleton-section">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton-grid">
                        {Array.from({ length: 4 }).map((_, i) => <ProductCardSkeleton key={i} />)}
                    </div>
                </div>

                <div className="skeleton-section">
                    <div className="skeleton skeleton-title"></div>
                    <div className="skeleton-slider">
                        {Array.from({ length: 3 }).map((_, i) => <div key={i} className="skeleton skeleton-slide"></div>)}
                    </div>
                </div>

            </div>
        </Container>
    );
};

export default MainPageSkeleton;