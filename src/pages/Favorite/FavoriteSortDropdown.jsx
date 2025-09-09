import React, { useState, useRef, useEffect } from 'react';
import ArrowDownIcon from '../../components/CustomIcons/ArrowDownIcon.jsx';
import ArrowUpIcon from '../../components/CustomIcons/ArrowUpIcon.jsx';

import './styles/FavoriteSortDropdown.css';


const options = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price', label: 'Сначала дешевле' },
    { value: '-price', label: 'Сначала дороже' },
    { value: 'name', label: 'По алфавиту' },
];

const FavoriteSortDropdown = ({ sortOption, setSortOption }) => {
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

    const currentLabel = options.find(opt => opt.value === sortOption)?.label;

    return (
        <div className="sort-dropdown-wrapper" ref={ref}>
            <button
                className="sort-dropdown-button"
                onClick={() => setIsOpen(prev => !prev)}
            >
                {currentLabel}
                <span className="arrow">
                    {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
                </span>
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

export default FavoriteSortDropdown;