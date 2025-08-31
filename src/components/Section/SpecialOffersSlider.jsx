import React, { useEffect, useState, useRef, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./style/SpecialOffersSlider.css";

function debounce(func, delay) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), delay);
    };
}

export default function SpecialOffersSlider({ title, banners }) {
    const [current, setCurrent] = useState(0);
    const trackRef = useRef(null);

    const isMobile = typeof window !== 'undefined' && window.matchMedia("(max-width: 768px)").matches;

    if (!banners || !banners.length) {
        return null;
    }

    const totalBanners = banners.length;
    const itemsToShow = isMobile ? 1 : 3;
    const maxIndex = totalBanners > itemsToShow ? totalBanners - itemsToShow : 0;

    const desktopNext = useCallback(() => {
        setCurrent((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, [maxIndex]);

    const desktopPrev = useCallback(() => {
        setCurrent((prev) => (prev <= 0 ? maxIndex : prev - 1));
    }, [maxIndex]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (isMobile) {
                if (trackRef.current) {
                    const track = trackRef.current;
                    const slideWidth = track.scrollWidth / totalBanners;
                    const nextSlideIndex = (current + 1) % totalBanners;
                    track.scrollTo({
                        left: nextSlideIndex * slideWidth,
                        behavior: 'smooth',
                    });
                }
            } else {
                desktopNext();
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [current, totalBanners, isMobile, desktopNext]);

    const handleScroll = useCallback(
        debounce(() => {
            if (trackRef.current) {
                const track = trackRef.current;
                const slideWidth = track.scrollWidth / totalBanners;
                const activeIndex = Math.round(track.scrollLeft / slideWidth);
                setCurrent(activeIndex);
            }
        }, 150),
        [totalBanners]
    );

    const goToSlide = (index) => {
        if (trackRef.current) {
            const track = trackRef.current;
            const slideWidth = track.scrollWidth / totalBanners;
            track.scrollTo({ left: index * slideWidth, behavior: 'smooth' });
        }
    };

    return (
        <section className="slider-section">
            <div className="slider-header">
                <h2 className="slider-title">{title}</h2>
                <div className="slider-controls">
                    <button onClick={desktopPrev} className="slider-button">
                        <ChevronLeft className="slider-icon" />
                    </button>
                    <button onClick={desktopNext} className="slider-button">
                        <ChevronRight className="slider-icon" />
                    </button>
                </div>
            </div>

            <div className="slider-container">
                <div
                    className="slider-track"
                    ref={trackRef}
                    onScroll={isMobile ? handleScroll : null}
                    style={{
                        transform: !isMobile ? `translateX(-${current * (100 / itemsToShow)}%)` : 'none'
                    }}
                >
                    {banners.map((banner, index) => (
                        <a
                            key={banner.id || index}
                            href={banner.link}
                            className="slider-banner"
                        >
                            <img
                                src={banner.image}
                                alt={banner.title || `Спецпредложение ${index + 1}`}
                                className="slider-image"
                            />
                        </a>
                    ))}
                </div>

                <div className="slider-dots">
                    {banners.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`slider-dot ${current === index ? 'active' : ''}`}
                            aria-label={`Перейти к слайду ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}

