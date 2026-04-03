import React, { useState } from 'react';
import '../style/ProductGallery.css';

const ProductGallery = ({ photos, title }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const images = photos && photos.length > 0 ? photos : ['/placeholder.png'];

    const goToPrevious = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? images.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
    };

    const goToNext = () => {
        const isLastSlide = currentIndex === images.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
    };

    return (
        <div className="gallery-container">
            <div className="main-image-wrapper">
                <button className="arrow-gallery left-arrow" onClick={goToPrevious}>‹</button>
                <img src={images[currentIndex]} alt={title} className="main-image" />
                <button className="arrow-gallery right-arrow" onClick={goToNext}>›</button>
            </div>
            <div className="dots-container">
                {images.map((_, index) => (
                    <div
                        key={index}
                        className={`dot ${currentIndex === index ? 'active' : ''}`}
                        onClick={() => setCurrentIndex(index)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default ProductGallery;