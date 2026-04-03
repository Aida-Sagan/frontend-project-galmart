
import React from 'react';
import './styles/ArrowLink.css';

const ArrowLink = ({ title, subtitle, onClick, to = null }) => {
    const content = (
        <div className="arrow-link-content">
            <div className="link-title">{title}</div>
            <div className="link-subtitle">{subtitle}</div>
            <span className="arrow-icon">›</span>
        </div>
    );

    if (to) {
        return (
            <a href={to} className="arrow-link">
                {content}
            </a>
        );
    }

    return (
        <div className="arrow-link" onClick={onClick}>
            {content}
        </div>
    );
};

export default ArrowLink;