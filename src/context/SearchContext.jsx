import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { searchProducts } from '../api/services/searchService.js';

const SearchContext = createContext();

const STORAGE_KEY = 'searchHistory';

export const SearchProvider = ({ children }) => {
    const [pageData, setPageData] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchValue, setSearchValue] = useState('');

    const updateHistoryStorage = (text) => {
        if (!text || text.trim().length < 2) return;

        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updated = [text, ...saved.filter(item => item !== text)].slice(0, 10);

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setSearchHistory(updated);
    };

    const getHistory = useCallback(() => {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setSearchHistory(saved);
    }, []);

    const deleteFromHistory = useCallback((textToDelete) => {
        setSearchHistory(prev => {
            const updated = prev.filter(item => item !== textToDelete);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return updated;
        });
    }, []);

    const performSearch = useCallback(async (text, page = 1, sort = 'default') => {
        const trimmedText = text?.trim();
        setSearchValue(trimmedText);

        if (!trimmedText || trimmedText.length < 3) {
            setPageData([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await searchProducts({ text: trimmedText, page, sort });

            const products = Array.isArray(response) ? response : (response.products || []);
            setPageData(products);

            if (products.length > 0) {
                updateHistoryStorage(trimmedText);
            }
        } catch (error) {
            console.error("Critical Search Error:", error.message);
            setPageData([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const clearSearch = useCallback(() => {
        setPageData([]);
        setSearchValue('');
    }, []);

    const value = useMemo(() => ({
        pageData,
        searchHistory,
        isLoading,
        searchValue,
        performSearch,
        getHistory,
        deleteFromHistory,
        clearSearch,
        setSearchValue
    }), [pageData, searchHistory, isLoading, searchValue, performSearch, getHistory, deleteFromHistory, clearSearch]);

    return (
        <SearchContext.Provider value={value}>
            {children}
        </SearchContext.Provider>
    );
};

export const useSearch = () => {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error('useSearch must be used within a SearchProvider');
    }
    return context;
};