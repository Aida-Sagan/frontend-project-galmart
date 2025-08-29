import React, { useState, useEffect } from 'react';
import './styles/ScrollToTopButton.css';
import { ReactComponent as ArrowUpIcon } from '../../assets/svg/arrow-up.svg';

const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.pageYOffset > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);

        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    return (
        <div className="scroll-to-top">
            {isVisible && (
                <button onClick={scrollToTop} className="scroll-to-top-btn">
                    <ArrowUpIcon />
                </button>
            )}
        </div>
    );
};

export default ScrollToTopButton;