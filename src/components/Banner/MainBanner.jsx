import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ReactComponent as ArrowLeft } from '../../assets/svg/nav-arrow-left.svg';
import { ReactComponent as ArrowRight } from '../../assets/svg/nav-arrow-right.svg';
import { fetchHomepageBanners } from '../../api/services/bannerService';

import './style/MainBanner.css';

const MainBanner = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [current, setCurrent] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const loadBanners = async () => {
            try {
                const fetchedBanners = await fetchHomepageBanners();
                setBanners(Array.isArray(fetchedBanners) ? fetchedBanners : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadBanners();
    }, []);

    useEffect(() => {
        if (banners.length > 0) {
            const interval = setInterval(() => {
                setCurrent((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners]);

    const handleNext = (e) => {
        e.stopPropagation();
        setCurrent((prev) => (prev + 1) % banners.length);
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        setCurrent((prev) => (prev - 1 + banners.length) % banners.length);
    };

    const handleDotClick = (index) => {
        setCurrent(index);
    };

    const handleClick = () => {
        if (banners[current] && banners[current].target_value) {
            navigate(banners[current].target_value);
        }
    };

    if (loading) {
        return <div className="main-banner-skeleton"></div>;
    }

    if (error) {
        return <div>Ошибка загрузки: {error}</div>;
    }

    if (banners.length === 0) {
        return null;
    }
    const currentBanner = banners[current];
    const imageSrc = currentBanner.images?.desktop || currentBanner.image;

    return (
        <div className="main-banner" onClick={handleClick}>

            <img
                src={imageSrc}
                alt={banners[current].title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />


            <button className="banner-arrow banner-arrow-left" onClick={handlePrev}>
                <ArrowLeft />
            </button>
            <button className="banner-arrow banner-arrow-right" onClick={handleNext}>
                <ArrowRight />
            </button>

            <div className="banner-dots">
                {banners.map((_, index) => (
                    <span
                        key={index}
                        className={`banner-dot ${index === current ? 'active' : ''}`}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleDotClick(index);
                        }}
                    />
                ))}
            </div>
        </div>
    );
};

export default MainBanner;