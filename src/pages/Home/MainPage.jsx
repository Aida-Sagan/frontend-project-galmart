import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { useAuth } from '../../context/AuthContext.jsx';
import LocationModal from '../../components/AddressModal/LocationModal.jsx';
import './styles/MainPage.css';

export default function MainPage() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    const {
        city,
        selectCity,
        isLoading: isLocationLoading,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal
    } = useLocation();

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const loadPageData = async () => {
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
    }, [city]);

    useEffect(() => {
        // Показываем модальное окно, если:
        // 1. Контексты загрузились
        // 2. Город не выбран
        // 3. Пользователь не авторизован
        if (!isLocationLoading && !city && !isAuthenticated) {
            openLocationModal();
        }
    }, [city, isLocationLoading, isAuthenticated, openLocationModal]);

    const handleCitySelect = (selectedCity) => {
        selectCity(selectedCity);
    };

    if (loading) {
        return <Loader />;
    }

    if (!pageData || !pageData.product_offers) {
        return <Container><div>Не удалось загрузить данные.</div></Container>;
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
            {isLocationModalOpen &&
                <LocationModal
                    onClose={closeLocationModal}
                    onCitySelect={handleCitySelect}
                />
            }

            <div className="home-container">
                <MainBanner banners={pageData.banners} />

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