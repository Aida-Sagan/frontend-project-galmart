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

import './styles/MainPage.css';

export default function MainPage() {
    const [pageData, setPageData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPageData = async () => {
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
    }, []);

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
            <div className="home-container">
                <MainBanner banners={pageData.banners} />

                {/*<div className="home-buttons">*/}
                {/*    <Link to="/login" className="home-btn">Войти</Link>*/}
                {/*    <Link to="/register" className="home-btn">Зарегистрироваться</Link>*/}
                {/*</div>*/}

                {regularProductOffers.map(category => (
                    <SectionBlock
                        key={category.id}
                        title={category.title}
                        products={category.goods}
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