import React, { useState } from 'react';
import './style/ChipsFilter.css';

const ChipsFilter = ({ items, activeIds, onFilterChange }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!items || items.length === 0) {
        return null;
    }

    const itemsToShow = isExpanded ? items : items.slice(0, 9);
    const hiddenItemsCount = items.length - itemsToShow.length;

    return (
        <div className="chips-filter-wrapper">
            <div className="chips-container">
                {itemsToShow.map(item => (
                    <button
                        key={item.id}
                        onClick={() => onFilterChange(item.id)}
                        className={`chip ${activeIds.includes(item.id) ? 'active' : ''}`}
                    >
                        {item.title}
                    </button>
                ))}
                {hiddenItemsCount > 0 && !isExpanded && (
                    <button className="chip more" onClick={() => setIsExpanded(true)}>
                        Ещё +{hiddenItemsCount}
                    </button>
                )}
            </div>
        </div>
    );
};

export default ChipsFilter;