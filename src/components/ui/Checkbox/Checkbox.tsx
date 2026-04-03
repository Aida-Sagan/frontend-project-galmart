import React from 'react';
import './Checkbox.css';

export interface CheckboxProps {
    /** Whether the checkbox is checked */
    checked: boolean;
    /** Change handler */
    onChange: (checked: boolean) => void;
    /** Label text (can be a string or ReactNode) */
    label?: React.ReactNode;
    /** Disabled state */
    disabled?: boolean;
    /** Additional className on wrapper */
    className?: string;
    /** Input name for forms */
    name?: string;
    /** Make the checkbox required */
    required?: boolean;
}

/** SVG checkmark icon matching Figma design */
const CheckIcon = () => (
    <svg
        className="galmart-checkbox__icon"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M2 6L5 9L10 3"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        />
    </svg>
);

export default function Checkbox({
    checked,
    onChange,
    label,
    disabled = false,
    className = '',
    name,
    required,
}: CheckboxProps) {
    const wrapperClass = [
        'galmart-checkbox',
        disabled && 'galmart-checkbox--disabled',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.checked);
    };

    return (
        <label className={wrapperClass}>
            <input
                type="checkbox"
                className="galmart-checkbox__input"
                checked={checked}
                onChange={handleChange}
                disabled={disabled}
                name={name}
                required={required}
            />
            <span className="galmart-checkbox__box">
                <CheckIcon />
            </span>
            {label && (
                <span className="galmart-checkbox__label">
                    {label}
                </span>
            )}
        </label>
    );
}
