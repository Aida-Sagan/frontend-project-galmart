import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./style/SpecialOffersSlider.css";

export default function SpecialOffersSlider({ title, banners }) {
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        if (banners && banners.length > 2) {
            setCurrent((prev) => (prev + 1) % (banners.length - 2));
        }
    };

    const prevSlide = () => {
        if (banners && banners.length > 2) {
            setCurrent((prev) =>
                prev - 1 < 0 ? banners.length - 3 : prev - 1
            );
        }
    };

    useEffect(() => {
        if (!banners || banners.length === 0) {
            return;
        }
        const interval = setInterval(nextSlide, 5000);
        return () => clearInterval(interval);
    }, [banners]);

    if (!banners || banners.length === 0) {
        return null;
    }

    return (
        <section className="slider-section">
            <div className="slider-header">
                <h2 className="slider-title">{title}</h2>
                <div className="slider-controls">
                    <button onClick={prevSlide} className="slider-button">
                        <ChevronLeft className="slider-icon" />
                    </button>
                    <button onClick={nextSlide} className="slider-button">
                        <ChevronRight className="slider-icon" />
                    </button>
                </div>
            </div>

            <div className="slider-track">
                {banners.slice(current, current + 3).map((banner, index) => (
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
        </section>
    );
}