import React, { useState, useEffect } from 'react';
import './style/SearchHistoryDropdown.css';

const SearchHistoryDropdown = ({ results = [], isLoading = false, searchValue = '' }) => {
    const [h, setH] = useState([]);

    useEffect(() => {
        const s = JSON.parse(localStorage.getItem('searchHistory') || '[]');
        setH(s);
    }, []);

    const handleR = (e, t) => {
        e.preventDefault();
        e.stopPropagation();
        const u = h.filter(i => i !== t);
        setH(u);
        localStorage.setItem('searchHistory', JSON.stringify(u));
    };

    if (isLoading) {
        return (
            <div className="search-history-dropdown">
                <div className="search-history-loading">Загрузка...</div>
            </div>
        );
    }

    if (searchValue.trim().length >= 3) {
        const d = Array.isArray(results) ? results : [];
        if (d.length === 0) return null;

        return (
            <div className="search-history-dropdown">
                <ul className="search-history-list">
                    {d.map((it) => (
                        <li
                            key={it.id || it.name}
                            className="search-history-item result-item"
                            onMouseDown={(e) => e.preventDefault()} // Чтобы не закрывалось при клике на результат
                        >
                            <span>{it.name}</span>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    if (h.length === 0) return null;

    return (
        <div className="search-history-dropdown" onMouseDown={(e) => e.preventDefault()}>
            <p className="search-history-title">Ранее вы искали:</p>
            <ul className="search-history-list">
                {h.map((it, idx) => (
                    <li key={idx} className="search-history-item">
                        <span className="history-text">{it}</span>
                        <button
                            className="delete-item-btn"
                            onMouseDown={(e) => handleR(e, it)}
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M10.5 3.5L3.5 10.5" stroke="#888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                                <path d="M3.5 3.5L10.5 10.5" stroke="#888" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchHistoryDropdown;