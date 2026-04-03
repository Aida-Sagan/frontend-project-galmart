import { makeAutoObservable, runInAction } from 'mobx';
import {
    getUserData,
    getOnlineOrdersData,
} from '../endpoint-service/services/profileService';

class ProfileStore {
    profile: any = null;
    orders: any[] = [];
    bonusBalance: any = null;
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });
    }

    async fetchUserProfile() {
        try {
            const data = await getUserData();
            runInAction(() => {
                this.profile = data;
            });
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        }
    }

    async fetchOrders() {
        try {
            const data = await getOnlineOrdersData();
            runInAction(() => {
                this.orders = data || [];
            });
        } catch (error) {
            console.error('Failed to fetch orders:', error);
        }
    }

    async fetchAllProfileData() {
        this.isLoading = true;
        try {
            await Promise.all([
                this.fetchUserProfile(),
                this.fetchOrders(),
            ]);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    clearProfileState() {
        this.profile = null;
        this.orders = [];
        this.bonusBalance = null;
        this.isLoading = false;
    }
}

export const profileStore = new ProfileStore();
