import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchFavorites } from '../api/services/authService';

const FavoritesContext = createContext(null);

export const FavoritesProvider = ({ children }) => {
    const [favoriteIds, setFavoriteIds] = useState(new Set());
    const [isLoading, setIsLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            setFavoriteIds(new Set());
            setIsLoading(false);
            return;
        }

        const loadFavoriteIds = async () => {
            setIsLoading(true);
            try {
                const response = await fetchFavorites({ limit: 1000, ordering: 'popular' });
                const goods = response.data || [];
                const ids = goods.map(item => item.id);
                setFavoriteIds(new Set(ids));
            } catch (error)
            {
                console.error("Не удалось загрузить ID избранных:", error);
                setFavoriteIds(new Set());
            } finally {
                setIsLoading(false);
            }
        };

        loadFavoriteIds();

    }, [isAuthenticated]);

    const addFavoriteId = (id) => {
        setFavoriteIds(prevIds => new Set(prevIds).add(id));
    };

    const removeFavoriteId = (id) => {
        setFavoriteIds(prevIds => {
            const newIds = new Set(prevIds);
            newIds.delete(id);
            return newIds;
        });
    };

    const value = { favoriteIds, addFavoriteId, removeFavoriteId, isLoading };

    return (
        <FavoritesContext.Provider value={value}>
            {children}
        </FavoritesContext.Provider>
    );
};

export const useFavorites = () => {
    return useContext(FavoritesContext);
};