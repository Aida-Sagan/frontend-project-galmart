import React, { useEffect, useState } from 'react';
import { useSearch } from '../../context/SearchContext.jsx';
import Container from '../../components/Container/Container';
import ProductCard from '../../components/Product/ProductCard.jsx';
import SearchSortDropdown from './SearchSortDropdown.jsx';
import searchEmptyIcon from '../../assets/search.png';
import './styles/SearchPage.css';

const SearchPage = () => {
    const { pageData, isLoading, searchValue, performSearch } = useSearch();
    const [sortBy, setSortBy] = useState('popularity');

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('query');
        if (query) {
            performSearch(query, 1, sortBy);
        }
    }, [sortBy]);

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
                            <ProductCard key={product.id} product={product} />
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
};

export default SearchPage;