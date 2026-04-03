import { makeAutoObservable, runInAction, reaction } from 'mobx';
import {
    getCartData,
    updateCart,
    deleteCart,
    setDeliveryTime,
    setOrder,
    getSavedCards,
    deleteSavedCard,
} from '../endpoint-service/services/cartService';
import { authStore } from './authStore';
import { locationStore } from './locationStore';

class CartStore {
    cartData: any = null;
    items: any[] = [];
    isLoading: boolean = false;
    savedCards: any[] = [];
    isCardsLoading: boolean = false;
    selectedPaymentMethodId: string | null = null;

    constructor() {
        makeAutoObservable(this, {}, { autoBind: true });

        // Fetch cart when auth or city changes
        reaction(
            () => ({
                isAuth: authStore.isAuthenticated,
                city: locationStore.city,
            }),
            ({ isAuth, city }) => {
                if (isAuth && city) {
                    this.fetchCart();
                    this.fetchSavedCards();
                }
            },
            { fireImmediately: true }
        );
    }

    async fetchCart() {
        if (!authStore.isAuthenticated) return;
        this.isLoading = true;
        try {
            const data = await getCartData();
            runInAction(() => {
                this.cartData = data;
                this.items = data?.items || [];
            });
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        } finally {
            runInAction(() => {
                this.isLoading = false;
            });
        }
    }

    async updateCartItemQuantity(itemId: number, quantity: number) {
        try {
            await updateCart(quantity, itemId);
            await this.fetchCart();
        } catch (error) {
            console.error('Failed to update cart item:', error);
        }
    }

    async clearCart() {
        try {
            await deleteCart();
            runInAction(() => {
                this.cartData = null;
                this.items = [];
            });
        } catch (error) {
            console.error('Failed to clear cart:', error);
        }
    }

    async setDeliveryTimeApi(date: any, time: any) {
        await setDeliveryTime(date, time);
        await this.fetchCart();
    }

    async setOrderApi(orderDetails: any) {
        const response = await setOrder(orderDetails);
        if (response?.payment_url) {
            window.location.href = response.payment_url;
        }
        return response;
    }

    async fetchSavedCards() {
        if (!authStore.isAuthenticated) return;
        this.isCardsLoading = true;
        try {
            const cards = await getSavedCards();
            runInAction(() => {
                this.savedCards = cards || [];
                if (this.savedCards.length > 0 && !this.selectedPaymentMethodId) {
                    this.selectedPaymentMethodId = this.savedCards[0].id;
                }
            });
        } catch (error) {
            console.error('Failed to fetch saved cards:', error);
        } finally {
            runInAction(() => {
                this.isCardsLoading = false;
            });
        }
    }

    setSelectedPaymentMethodId(id: string | null) {
        this.selectedPaymentMethodId = id;
    }

    async deleteCard(cardId: string) {
        try {
            await deleteSavedCard(cardId);
            runInAction(() => {
                this.savedCards = this.savedCards.filter((c: any) => c.id !== cardId);
                if (this.selectedPaymentMethodId === cardId) {
                    this.selectedPaymentMethodId = this.savedCards[0]?.id || null;
                }
            });
        } catch (error) {
            console.error('Failed to delete card:', error);
        }
    }
}

export const cartStore = new CartStore();
