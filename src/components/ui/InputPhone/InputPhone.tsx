import React, { useState, useRef, useEffect } from 'react';
import { IMaskInput } from 'react-imask';
import { X } from 'lucide-react';
import './InputPhone.css';

export type PhoneCountry = 'KZ' | 'UZ';

export interface InputPhoneProps {
    /** Current phone value (full, e.g. "+7 (705) 123-45-67") */
    value: string;
    /** Change handler — receives the full formatted value */
    onChange: (value: string) => void;
    /** Country — determines prefix and mask */
    country?: PhoneCountry;
    /** Error message */
    errorText?: string;
    /** Additional class on wrapper */
    className?: string;
    /** Show clear (X) button */
    showClear?: boolean;
    /** onBlur handler */
    onBlur?: (e: React.FocusEvent) => void;
    /** onFocus handler */
    onFocus?: (e: React.FocusEvent) => void;
    /** Auto focus */
    autoFocus?: boolean;
    /** Input name */
    name?: string;
}

const COUNTRY_CONFIG: Record<PhoneCountry, { prefix: string; mask: string; placeholder: string }> = {
    KZ: {
        prefix: '+7',
        mask: '(000) 000-00-00',
        placeholder: '(000) 000-00-00',
    },
    UZ: {
        prefix: '+998',
        mask: '(00) 000-00-00',
        placeholder: '(00) 000-00-00',
    },
};

export default function InputPhone({
    value,
    onChange,
    country = 'KZ',
    errorText,
    className = '',
    showClear = true,
    onBlur,
    onFocus,
    autoFocus = false,
    name,
}: InputPhoneProps) {
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const config = COUNTRY_CONFIG[country];
    const isError = !!errorText;

    // Strip the prefix to get the "masked" part
    const prefixRegex = new RegExp(`^\\+?${config.prefix.replace('+', '')}\\s?`);
    const maskedValue = value.replace(prefixRegex, '');

    // Check if there are digits beyond the country code
    const rawDigits = value.replace(/\D/g, '');
    const prefixDigits = config.prefix.replace(/\D/g, '');
    const hasExtraDigits = rawDigits.length > prefixDigits.length;

    // Determine visual state
    const isActive = isFocused;
    const isFilled = hasExtraDigits && !isFocused;

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    const handleFocus = (e: React.FocusEvent) => {
        setIsFocused(true);
        onFocus?.(e);
    };

    const handleBlur = (e: React.FocusEvent) => {
        setIsFocused(false);
        onBlur?.(e);
    };

    const handleAccept = (maskedVal: string) => {
        onChange(`${config.prefix} ${maskedVal}`);
    };

    const handleClear = () => {
        onChange(`${config.prefix} `);
        inputRef.current?.focus();
    };

    let containerClass = 'galmart-input-phone__container';
    if (isError) {
        containerClass += ' galmart-input-phone__container--error';
    } else if (isActive) {
        containerClass += ' galmart-input-phone__container--active';
    }

    return (
        <div className={`galmart-input-phone ${className}`}>
            <div
                className={containerClass}
                onClick={() => inputRef.current?.focus()}
            >
                <div className="galmart-input-phone__left">
                    <span className="galmart-input-phone__prefix">{config.prefix}</span>
                    <IMaskInput
                        inputRef={(el: HTMLInputElement | null) => {
                            (inputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
                        }}
                        name={name}
                        mask={config.mask}
                        value={maskedValue}
                        onAccept={handleAccept}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        placeholder={config.placeholder}
                        className="galmart-input-phone__input"
                        inputMode="numeric"
                        autoComplete="tel"
                    />
                </div>
                {showClear && hasExtraDigits && (
                    <button
                        type="button"
                        className="galmart-input-phone__clear"
                        onClick={handleClear}
                        aria-label="Очистить"
                        tabIndex={-1}
                    >
                        <X size={18} />
                    </button>
                )}
            </div>
            {errorText && (
                <p className="galmart-input-phone__error">{errorText}</p>
            )}
        </div>
    );
}
