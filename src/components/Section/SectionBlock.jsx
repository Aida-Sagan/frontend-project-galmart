import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Product/ProductCard';
import './style/SectionBlock.css';

const SectionBlock = ({ title, products = [], sectionId, showMore = false, limit = 5, categoryLink = "/" }) => {
    const visibleProducts = products.slice(0, limit);

    return (
        <div className="section">
            <div className="section__header">
                <h2 className="title_section_header">{title}</h2>
                {showMore && (
                    <Link to={categoryLink} className="section__more-link">
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
            </div>
        </div>
    );
};

export default SectionBlock;