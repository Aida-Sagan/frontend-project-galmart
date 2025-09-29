import React, { useState, useRef, useEffect } from 'react';

const options = [
    { value: 'popular', label: 'По популярности' },
    { value: 'price', label: 'Сначала дешевле' },
    { value: '-price', label: 'Сначала дороже' },
    { value: 'name', label: 'По алфавиту' },
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

    const currentLabel = options.find(opt => opt.value === sortOption)?.label;

    return (
        <div className="sort-dropdown-wrap" ref={ref}>
            <button
                className="sort-dropdown-button"
                onClick={() => setIsOpen(prev => !prev)}
            >
                {currentLabel}
                <span className="arrow">
                   <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.16699 0.791626C5.65024 0.791626 6.04198 1.18338 6.04199 1.66663V18.2213L8.04785 16.2145C8.38956 15.8728 8.94442 15.8728 9.28613 16.2145C9.62759 16.5561 9.62747 17.1101 9.28613 17.4518L5.78613 20.9518C5.44442 21.2935 4.88956 21.2935 4.54785 20.9518L1.04785 17.4518C0.706538 17.1101 0.706419 16.5561 1.04785 16.2145C1.38956 15.8728 1.94442 15.8728 2.28613 16.2145L4.29199 18.2213V1.66663C4.292 1.18339 4.68375 0.791634 5.16699 0.791626ZM16.2148 1.04749C16.5565 0.706053 17.1105 0.706171 17.4521 1.04749L20.9521 4.54749C21.2939 4.88919 21.2939 5.44406 20.9521 5.78577C20.6105 6.1271 20.0565 6.12722 19.7148 5.78577L17.709 3.77893V20.3336C17.7088 20.8166 17.317 21.2085 16.834 21.2086C16.3508 21.2086 15.9592 20.8167 15.959 20.3336V3.77893L13.9521 5.78577C13.6105 6.1271 13.0565 6.12722 12.7148 5.78577C12.3731 5.44406 12.3731 4.88919 12.7148 4.54749L16.2148 1.04749Z" fill="#222222"/>
                    </svg>
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

export default ProductSortDropdown;