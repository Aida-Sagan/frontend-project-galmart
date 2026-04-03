import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { searchStore } from '../../stores/searchStore';
import { useLocation } from 'react-router-dom';
import Container from '../../components/Container/Container';
import ProductCard from '../../components/Product/ProductCard';
import SearchSortDropdown from './SearchSortDropdown';
import searchEmptyIcon from '../../assets/search.png';

import './styles/SearchPage.css';

const SearchPage = observer((): any => {
    const { pageData, isLoading, performSearch } = searchStore;
    const [sortBy, setSortBy] = useState('popularity');
    const location = useLocation();
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const query = params.get('query');
        if (query) {
            performSearch(query, 1, sortBy);
        }
    }, [sortBy, location.search]);

    if (isLoading) {
        return (
            <div className="search-page-status">
                <Container>
                    <div className="loading-spinner">Загрузка результатов...</div>
                </Container>
            </div>
        );
    }

    return (
        <div className="search-page">
            <Container>
                <div className="search-page__header">
                    {pageData?.length > 0 && (
                        <div className="search-page__sort">
                            <SearchSortDropdown sortBy={sortBy} setSortBy={setSortBy} />
                        </div>
                    )}
                </div>

                {Array.isArray(pageData) && pageData.length > 0 ? (
                    <div className="search-page__grid">
                        {pageData.map((product) => (
                            <ProductCard key={product.id || Math.random()} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="search-page__empty">
                        <img src={searchEmptyIcon} alt="Ничего не найдено" />
                        <h2 className="search-page__empty_text">Ничего не найдено</h2>
                        <p className="search-page__empty_descr">Попробуйте изменить запрос</p>
                    </div>
                )}
            </Container>
        </div>
    );
});

export default SearchPage;