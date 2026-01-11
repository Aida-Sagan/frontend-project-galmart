import React, { useEffect, useState } from 'react';
import Container from '../../components/Container/Container.jsx';
import MainBanner from '../../components/Banner/MainBanner.jsx';
import SectionBlock from '../../components/Section/SectionBlock.jsx';
import FilterableSectionBlock from '../../components/Section/FilterableSectionBlock';
import SpecialOffersSlider from '../../components/Section/SpecialOffersSlider.jsx';
import QrPromo from '../../components/qrPromo/qrPromo';
import { fetchHomePageData } from '../../api/services/homepageService';
import Loader from '../../components/Loader/Loader.jsx';
import ScrollToTopButton from '../../components/ScrollToTopButton/ScrollToTopButton';
import { useLocation } from '../../context/LocationContext.jsx';
import MobileStub from '../MobileStub/MobileStub.jsx';

import './styles/MainPage.css';

export default function MainPage() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showMobileStub, setShowMobileStub] = useState(false);


    const {
        city,
        isLoading: isLocationLoading,
    } = useLocation();

    useEffect(() => {
        const isMobile = window.innerWidth <= 480;
        const hasSeenStub = sessionStorage.getItem('hasSeenMobileStub');

        if (isMobile && !hasSeenStub) {
            setShowMobileStub(true);
        }

        const loadPageData = async () => {
            if (isLocationLoading) return;

            setLoading(true);
            try {
                const data = await fetchHomePageData();
                if (data) {
                    setPageData(data);
                }
            } catch (error) {
                console.error("Failed to load homepage data:", error);
            } finally {
                setLoading(false);
            }
        };

        loadPageData();

    }, [city, isLocationLoading]);

    const handleContinueToWeb = () => {
        sessionStorage.setItem('hasSeenMobileStub', 'true');
        setShowMobileStub(false);
    };

    if (showMobileStub) {
        return <MobileStub onContinue={handleContinueToWeb} />;
    }


    if (loading || isLocationLoading) {
        return <Loader />;
    }

    if (!pageData || !pageData.product_offers) {
        return <Container><div className="error-message">Не удалось загрузить данные для выбранного региона.</div></Container>;
    }

    const regularCategoryTitles = ['Вкусные новинки', 'Новинки'];
    const regularProductOffers = pageData.product_offers.filter(
        offer => regularCategoryTitles.includes(offer.title)
    );
    const filterableCollections = pageData.product_offers.filter(
        offer => !regularCategoryTitles.includes(offer.title)
    );

    return (
        <Container>

            <div className="home-container">
                {pageData.banners && <MainBanner banners={pageData.banners} />}

                {regularProductOffers.map(category => (
                    <SectionBlock
                        key={category.id}
                        title={category.title}
                        products={category.goods}
                        compilationId={category.id}
                        showMore
                    />
                ))}

                {pageData.special_offers && pageData.special_offers.length > 0 && (
                    <SpecialOffersSlider title="Спецпредложения" banners={pageData.special_offers} />
                )}

                <FilterableSectionBlock collections={filterableCollections} />
                <QrPromo />
            </div>
            <ScrollToTopButton />
        </Container>
    );
}