import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import './style/SectionBlock.css';

const SectionBlock = ({ title, products = [], compilationId, sectionId, showMore = false, categoryLink = "/" }) => {
    const [visibleLimit, setVisibleLimit] = useState(5);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setVisibleLimit(3);
            } else if (window.innerWidth >= 768 && window.innerWidth <= 1020) {
                setVisibleLimit(5);
            } else {
                setVisibleLimit(5);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const visibleProducts = products.slice(0, visibleLimit);

    // Determine the correct link based on the compilationId
    const moreLink = compilationId ? `/compilations/${compilationId}` : categoryLink;

    return (
        <div className="section">
            <div className="section__header">
                <h2 className="title_section_header">{title}</h2>
                {showMore && (
                    <Link to={moreLink} className="section__more-link">
                        Смотреть больше
                        <svg
                            width="8"
                            height="14"
                            viewBox="0 0 8 14"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.46967 0.46967C0.176777 0.762563 0.176777 1.23744 0.46967 1.53033L5.93934 7L0.46967 12.4697C0.176777 12.7626 0.176777 13.2374 0.46967 13.5303C0.762563 13.8232 1.23744 13.8232 1.53033 13.5303L7.53033 7.53033C7.82322 7.23744 7.82322 6.76256 7.53033 6.46967L1.53033 0.46967C1.23744 0.176777 0.762563 0.176777 0.46967 0.46967Z"
                                fill="#7A7A7A"
                            />
                        </svg>
                    </Link>
                )}
            </div>

            <div className="section__grid">
                {visibleProducts.map((item) => (
                    <ProductCard key={item.id} product={item} sectionId={sectionId} />
                ))}
                {showMore && (
                    <Link to={moreLink} className="section__more-card">
                        <div className="plus-icon">
                            <svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M7 0.75C7.41421 0.75 7.75 1.08579 7.75 1.5V6.75H13C13.4142 6.75 13.75 7.08579 13.75 7.5C13.75 7.91421 13.4142 8.25 13 8.25H7.75V13.5C7.75 13.9142 7.41421 14.25 7 14.25C6.58579 14.25 6.25 13.9142 6.25 13.5V8.25H1C0.585786 8.25 0.25 7.91421 0.25 7.5C0.25 7.08579 0.585786 6.75 1 6.75H6.25V1.5C6.25 1.08579 6.58579 0.75 7 0.75Z" fill="#902067"/>
                            </svg>

                        </div>
                        <span>Смотреть<br />больше</span>
                    </Link>
                )}
            </div>
        </div>
    );
};

export default SectionBlock;