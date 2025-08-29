import React from 'react';
import './style/SearchHistoryDropdown.css';

const searchHistory = [
    'Сок яблочный',
    'Мармелад яблочный',
    'Лимонад яблочный',
    'Яблоко',
    'Яблочное мороженое',
    'Пастила яблочная',
];

const SearchHistoryDropdown = () => {
    return (
        <div className="search-history-dropdown">
            <p className="search-history-title">Ранее вы искали:</p>
            <ul className="search-history-list">
                {searchHistory.map((item, index) => (
                    <li key={index} className="search-history-item">
                        <span>{item}</span>
                        <button className="delete-item-btn">&times;</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchHistoryDropdown;