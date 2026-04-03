import React from 'react';
import './Button.css';

export type ButtonVariant = 'filled' | 'outlined';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    /** Visual style variant */
    variant?: ButtonVariant;
    /** Stretch to 100 % of parent width */
    fullWidth?: boolean;
    /** Additional className on the button element */
    className?: string;
    /** Children content (text, icons, etc.) */
    children: React.ReactNode;
}

export default function Button({
    variant = 'filled',
    fullWidth = false,
    className = '',
    children,
    disabled,
    type = 'button',
    ...rest
}: ButtonProps) {
    const classNames = [
        'galmart-btn',
        `galmart-btn--${variant}`,
        fullWidth && 'galmart-btn--full-width',
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled}
            {...rest}
        >
            {children}
        </button>
    );
}
