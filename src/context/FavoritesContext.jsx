import React, { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState(() => {
        const savedFavorites = localStorage.getItem('favoriteIds');
        return savedFavorites ? JSON.parse(savedFavorites) : [];
    });

    useEffect(() => {
        localStorage.setItem('favoriteIds', JSON.stringify(favoriteIds));
    }, [favoriteIds]);

    const addFavorite = (productId) => {
        setFavoriteIds((prev) => [...prev, productId]);
    };

    const removeFavorite = (productId) => {
        setFavoriteIds((prev) => prev.filter((id) => id !== productId));
    };

    const isFavorite = (productId) => {
        return favoriteIds.includes(productId);
    };

    const value = {
        favoriteIds,
        addFavorite,
        removeFavorite,
        isFavorite,
    };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};