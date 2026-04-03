import { makeAutoObservable, runInAction, reaction } from 'mobx';
import { fetchFavorites } from '../endpoint-service/services/authService';
import { authStore } from './authStore';

class FavoritesStore {
    favoriteIds: Set<number> = new Set();
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });

        // React to auth state changes
        reaction(
            () => authStore.isAuthenticated,
            (isAuthenticated) => {
                if (isAuthenticated) {
                    this.loadFavorites();
                } else {
                    this.favoriteIds = new Set();
                }
            },
            { fireImmediately: true }
        );
    }

    async loadFavorites() {
        if (!authStore.isAuthenticated) return;
        this.isLoading = true;
        try {
            const response = await fetchFavorites({ limit: 1000, ordering: 'descending' });
            const goods = response.data?.data || [];
            const ids = goods.map((item: any) => item.id);
            runInAction(() => {
                this.favoriteIds = new Set(ids);
            });
        } catch (error) {
            console.error('Failed to load favorites:', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    addFavoriteId(id: number) {
        this.favoriteIds = new Set(this.favoriteIds).add(id);
    }

    removeFavoriteId(id: number) {
        const newSet = new Set(this.favoriteIds);
        newSet.delete(id);
        this.favoriteIds = newSet;
    }
}

export const favoritesStore = new FavoritesStore();
