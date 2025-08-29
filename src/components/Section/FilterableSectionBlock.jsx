import React, { useState, useEffect } from 'react';
import ProductCard from '../Product/ProductCard';
import './style/FilterableSectionBlock.css';
import './style/SaleDescriptionCard.css';

const SaleDescriptionCard = ({ collection }) => {
    if (!collection || !collection.title) {
        return null;
    }

    return (
        <div className="sale-description-card">
            <h3 className="sale-title">{collection.title}</h3>
            <p className="sale-description">
                Все самое лучшее из категории «{collection.title}» специально для вас.
            </p>
            <button className="watch-more-btn">Смотреть больше</button>
        </div>
    );
};

const FilterableSectionBlock = ({ collections = [] }) => {
    const [activeCollection, setActiveCollection] = useState(null);

    useEffect(() => {
        if (collections && collections.length > 0 && !activeCollection) {
            setActiveCollection(collections[0]);
        }
    }, [collections, activeCollection]);

    if (!activeCollection) {
        return null;
    }

    return (
        <section className="filterable-section">
            <div className="section-header">
                <h2 className="section-title">{activeCollection.title}</h2>
                <div className="filter-buttons">
                    {collections.map((collection) => (
                        <button
                            key={collection.id}
                            className={`filter-button ${activeCollection.id === collection.id ? 'active' : ''}`}
                            onClick={() => setActiveCollection(collection)}
                        >
                            {collection.title}
                        </button>
                    ))}
                </div>
            </div>

            <div className="section__grid">
                <SaleDescriptionCard collection={activeCollection} />
                {activeCollection.goods.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
};

export default FilterableSectionBlock;