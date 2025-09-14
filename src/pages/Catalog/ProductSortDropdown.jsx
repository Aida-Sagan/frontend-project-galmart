import React, { useState, useRef, useEffect } from 'react';
import ArrowDownIcon from '../../components/CustomIcons/ArrowDownIcon.jsx';
import ArrowUpIcon from '../../components/CustomIcons/ArrowUpIcon.jsx';

import './style/ProductSortDropdown.css';

const options = [
    { value: 'popular', label: 'По популярности' },
    { value: 'ascending', label: 'Сначала дешевле' },
    { value: 'descending', label: 'Сначала дороже' },
    { value: 'alphabet', label: 'По алфавиту' },
];

const ProductSortDropdown = ({ sortOption, setSortOption }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = e => {
            if (ref.current && !ref.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="sort-dropdown-wrapper" ref={ref}>
            <button
                className="sort-dropdown-button"
                onClick={() => setIsOpen(prev => !prev)}
            >
                {options.find(opt => opt.value === sortOption)?.label}
                <span className="arrow">    {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}</span>
            </button>

            {isOpen && (
                <ul className="sort-dropdown-menu">
                    {options.map(opt => (
                        <li
                            key={opt.value}
                            onClick={() => {
                                setSortOption(opt.value);
                                setIsOpen(false);
                            }}
                            className={sortOption === opt.value ? 'selected' : ''}
                        >
                            <span className="label">{opt.label}</span>
                            <span className="radio">
                                {sortOption === opt.value ? (
                                    <div className="circle selected" />
                                ) : (
                                    <div className="circle" />
                                )}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ProductSortDropdown;
