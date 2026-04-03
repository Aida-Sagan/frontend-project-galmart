import { makeAutoObservable, runInAction, reaction } from 'mobx';
import { fetchAddresses, saveAddress } from '../endpoint-service/services/addressService';
import { authStore } from './authStore';

class LocationStore {
    city: any = JSON.parse(localStorage.getItem('selectedCity') || 'null');
    userAddresses: any[] = [];
    selectedAddress: any = JSON.parse(localStorage.getItem('selectedAddress') || 'null');
    isLoading: boolean = true;
    isLocationModalOpen: boolean = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });

        // If no city is saved, show the location modal
        if (!this.city) {
            this.isLocationModalOpen = true;
            this.isLoading = false;
        } else {
            this.isLoading = false;
        }

        // Fetch addresses when user authenticates
        reaction(
            () => authStore.isAuthenticated,
            (isAuthenticated) => {
                if (isAuthenticated) {
                    this.fetchUserAddresses();
                } else {
                    this.userAddresses = [];
                    this.selectedAddress = null;
                    localStorage.removeItem('selectedAddress');
                }
            },
            { fireImmediately: true }
        );
    }

    selectCity(newCity: any) {
        this.city = newCity;
        localStorage.setItem('selectedCity', JSON.stringify(newCity));
        this.selectedAddress = null;
        localStorage.removeItem('selectedAddress');
        if (authStore.isAuthenticated) {
            this.fetchUserAddresses();
        }
    }

    selectAddress(address: any) {
        this.selectedAddress = address;
        localStorage.setItem('selectedAddress', JSON.stringify(address));
    }

    openLocationModal() {
        this.isLocationModalOpen = true;
    }

    closeLocationModal() {
        this.isLocationModalOpen = false;
    }

    async fetchUserAddresses() {
        if (!authStore.isAuthenticated) return;
        try {
            const data = await fetchAddresses();
            runInAction(() => {
                this.userAddresses = data || [];
            });
        } catch (error) {
            console.error('Failed to fetch user addresses:', error);
        }
    }

    async addNewAddress(addressData: any) {
        const token = authStore.token;
        if (!token) return;
        await saveAddress(addressData);
        await this.fetchUserAddresses();
    }
}

export const locationStore = new LocationStore();
