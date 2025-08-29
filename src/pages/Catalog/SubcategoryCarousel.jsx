import React, { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './style/CatalogPage.css';

const SubcategoryCarousel = ({ subcategories, parentId, color }) => {
    const carouselRef = useRef(null);

    const scroll = (direction) => {
        const scrollAmount = 200;
        carouselRef.current.scrollBy({
            left: direction === 'left' ? -scrollAmount : scrollAmount,
            behavior: 'smooth',
        });
    };

    if (!subcategories || subcategories.length === 0) {
        return null;
    }

    return (
        <div className="subcategory-carousel-wrapper">
            <button className="carousel-arrow left" onClick={() => scroll('left')}>
                &#8249;
            </button>

            <div className="subcategory-carousel" ref={carouselRef}>
                {subcategories.map(sub => (
                    <div key={sub.id} className="carousel-item-container">
                        <NavLink
                            to={`/catalog/${parentId}/${sub.id}`}
                            className="subcategory-card"
                            style={{ backgroundColor: color || '#EBF5FA' }}
                        >
                            <div className="subcategory-card-image">
                                <img src={sub.image} alt={sub.title} />
                            </div>
                        </NavLink>
                        <div className="subcategory-card-title">{sub.title}</div>
                    </div>
                ))}
            </div>

            <button className="carousel-arrow right" onClick={() => scroll('right')}>
                &#8250;
            </button>
        </div>
    );
};

export default SubcategoryCarousel;