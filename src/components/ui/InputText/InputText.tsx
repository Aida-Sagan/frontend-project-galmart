import React, { useState, useRef, useEffect } from 'react';
import './InputText.css';

export type InputTextState = 'empty' | 'filled' | 'active-empty' | 'active-filled' | 'error' | 'disabled';

export interface InputTextProps {
    /** Current value */
    value: string;
    /** Change handler */
    onChange: (value: string) => void;
    /** Floating label text */
    label?: string;
    /** Placeholder when empty & unfocused (shown below the label) */
    placeholder?: string;
    /** Helper text below input */
    helperText?: string;
    /** Error message — sets error state automatically */
    errorText?: string;
    /** Disabled state */
    disabled?: boolean;
    /** Show trailing icon */
    showIcon?: boolean;
    /** Custom trailing icon element */
    icon?: React.ReactNode;
    /** Input type */
    type?: string;
    /** Input name for forms */
    name?: string;
    /** Additional className on wrapper */
    className?: string;
    /** Read-only */
    readOnly?: boolean;
    /** onClick handler (useful for address fields, etc.) */
    onClick?: () => void;
    /** onBlur handler */
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** onFocus handler */
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
    /** Auto focus */
    autoFocus?: boolean;
}

export default function InputText({
    value,
    onChange,
    label,
    placeholder,
    helperText,
    errorText,
    disabled = false,
    showIcon = false,
    icon,
    type = 'text',
    name,
    className = '',
    readOnly = false,
    onClick,
    onBlur,
    onFocus,
    autoFocus = false,
}: InputTextProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const hasValue = value.length > 0;
    const isError = !!errorText;

    // Derive visual state
    let state: InputTextState = 'empty';
    if (disabled) {
        state = 'disabled';
    } else if (isError) {
        state = 'error';
    } else if (isFocused && hasValue) {
        state = 'active-filled';
    } else if (isFocused && !hasValue) {
        state = 'active-empty';
    } else if (hasValue) {
        state = 'filled';
    }

    const showFloatingLabel = label && (hasValue || isFocused);
    const showPlaceholderLabel = label && !hasValue && !isFocused;

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
    };

    // Helper text to show
    const displayHelperText = isError ? errorText : helperText;

    return (
        <div className={`galmart-input-text galmart-input-text--${state} ${className}`}>
            <div
                className="galmart-input-text__container"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="galmart-input-text__content">
                    {showFloatingLabel && (
                        <span className="galmart-input-text__label galmart-input-text__label--floating">
                            {label}
                        </span>
                    )}
                    {showPlaceholderLabel && (
                        <span className="galmart-input-text__label galmart-input-text__label--placeholder">
                            {label}
                        </span>
                    )}
                    <input
                        ref={inputRef}
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={isFocused && !hasValue ? (placeholder || '') : ''}
                        disabled={disabled}
                        readOnly={readOnly}
                        onClick={onClick}
                        className={`galmart-input-text__input ${showFloatingLabel ? 'galmart-input-text__input--with-label' : ''}`}
                        autoComplete="off"
                    />
                </div>
                {showIcon && (
                    <span className="galmart-input-text__icon">
                        {icon || <DefaultEditIcon disabled={disabled} />}
                    </span>
                )}
            </div>
            {displayHelperText && (
                <p className={`galmart-input-text__helper ${isError ? 'galmart-input-text__helper--error' : ''}`}>
                    {displayHelperText}
                </p>
            )}
        </div>
    );
}

/** Default edit pencil icon matching Figma */
function DefaultEditIcon({ disabled }: { disabled?: boolean }) {
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={disabled ? 'galmart-input-text__icon--disabled' : ''}
        >
            <path
                d="M16.474 5.408l2.118 2.117m-.756-3.982L12.109 9.27a2.118 2.118 0 00-.58 1.082L11 13l2.648-.53c.41-.082.786-.283 1.082-.579l5.727-5.727a1.853 1.853 0 10-2.621-2.621z"
                stroke={disabled ? '#B0B0B0' : '#222222'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M19 15v3a2 2 0 01-2 2H6a2 2 0 01-2-2V7a2 2 0 012-2h3"
                stroke={disabled ? '#B0B0B0' : '#222222'}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}
