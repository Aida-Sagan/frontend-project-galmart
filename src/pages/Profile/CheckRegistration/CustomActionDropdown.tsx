import React, { useState, useRef, useEffect } from 'react';

const RadioIcon = ({ selected }) => (
    <div className={`custom-radio-icon ${selected ? 'selected' : ''}`}>
        {selected && <div className="custom-radio-dot"></div>}
    </div>
);

const DropdownArrow = ({ isOpen }) => (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg" className={`dropdown-arrow-icon ${isOpen ? 'open' : ''}`}>
        <path fillRule="evenodd" clipRule="evenodd" d="M0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L7.53033 7.53033C7.23744 7.82322 6.76256 7.82322 6.46967 7.53033L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967Z" fill="#902067"/>
    </svg>
);


const CustomDropdown = ({ value, options, onChange, placeholder, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const selectedOption = options.find(option => option.id === value);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleComplexSelect = (option) => {
        onChange(option.id);
        setIsOpen(false);
    };

    if (disabled) {
        return (
            <div className="custom-dropdown-container disabled">
                <div className="dropdown-selected-area disabled">
                    <div className="selected-area-content">
                        <span className="selected-placeholder">{placeholder}</span>
                        <span className="selected-value">
                            {selectedOption ? selectedOption.title : ''}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="custom-dropdown-container" ref={dropdownRef}>
            <div
                className={`dropdown-selected-area ${isOpen ? 'open' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="selected-area-content">
                    <span className="selected-placeholder">{placeholder}</span>
                    <span className="selected-value">
                        {selectedOption ? selectedOption.title : ''}
                    </span>
                </div>
                <DropdownArrow isOpen={isOpen} />
            </div>

            {isOpen && (
                <div className="dropdown-options-list">
                    {options.map(option => (
                        <div
                            key={option.id}
                            className={`dropdown-option-item ${option.id === value ? 'selected' : ''}`}
                            onClick={() => handleComplexSelect(option)}
                        >
                            <span className="option-title">{option.title}</span>
                            <RadioIcon selected={option.id === value} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;