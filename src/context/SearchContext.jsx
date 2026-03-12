import React, { createContext, useContext, useState, useCallback } from 'react';
import { fetchSearchProducts } from '../api/services/searchService.js';

const SearchContext = createContext();

export const SearchProvider = ({ children }) => {
    const [searchValue, setSearchValue] = useState('');
    const [pageData, setPageData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchHistory, setSearchHistory] = useState(
        JSON.parse(localStorage.getItem('searchHistory') || '[]')
    );

    const saveSearchHistory = useCallback((text) => {
        const trimmed = text.trim();
        if (!trimmed) return;
        setSearchHistory(prev => {
            const newHistory = [trimmed, ...prev.filter(i => i !== trimmed)].slice(0, 10);
            localStorage.setItem('searchHistory', JSON.stringify(newHistory));
            return newHistory;
        });
    }, []);

    const performSearch = useCallback(async (text, page = 1, sort = 'popularity') => {
        if (text.trim().length <= 2) {
            setPageData([]);
            return;
        }

        setIsLoading(true);
        try {
            const data = await fetchSearchProducts({ text, page, sort });
            setPageData(Array.isArray(data) ? data : []);
            saveSearchHistory(text);
        } catch (error) {
            console.error("Search failed", error);
            setPageData([]);
        } finally {
            setIsLoading(false);
        }
    }, [saveSearchHistory]);

    return (
        <SearchContext.Provider value={{
            searchValue,
            setSearchValue,
            pageData,
            isLoading,
            performSearch,
            searchHistory
        }}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => useContext(SearchContext);