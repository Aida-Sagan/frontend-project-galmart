import { makeAutoObservable, runInAction } from 'mobx';
import { fetchSearchProducts } from '../endpoint-service/services/searchService';

class SearchStore {
    searchValue: string = '';
    pageData: any[] = [];
    isLoading: boolean = false;
    searchHistory: string[] = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    setSearchValue(value: string) {
        this.searchValue = value;
    }

    async performSearch(query: string, page: number = 1, sort: string = 'popularity') {
        if (!query || query.trim().length < 2) return;
        this.isLoading = true;
        try {
            const data = await fetchSearchProducts({ text: query, page, sort });
            runInAction(() => {
                this.pageData = data?.goods || data || [];

                // Save to history
                const trimmed = query.trim();
                const updatedHistory = [trimmed, ...this.searchHistory.filter(h => h !== trimmed)].slice(0, 10);
                this.searchHistory = updatedHistory;
                localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
            });
        } catch (error) {
            console.error('Search failed:', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }
}

export const searchStore = new SearchStore();
