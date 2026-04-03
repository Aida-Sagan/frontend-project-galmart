import { makeAutoObservable, runInAction } from 'mobx';
import { loginWithCode as apiLogin } from '../endpoint-service/services/authService';

class AuthStore {
    token: string | null = localStorage.getItem('authToken');
    isNewUser: boolean = JSON.parse(localStorage.getItem('isNewUser') || 'false');
    loginPhone: string = '';
    showLoginModal: boolean = false;

    constructor() {
        makeAutoObservable(this);
    }

    get isAuthenticated(): boolean {
        return !!this.token;
    }

    setLoginPhone(phone: string) {
        this.loginPhone = phone;
    }

    setShowLoginModal(show: boolean) {
        this.showLoginModal = show;
    }

    async login(phone: string, code: string) {
        const response = await apiLogin(phone, code);
        const userData = response.data.data;
        const { is_account_exists, access, refresh } = userData;

        localStorage.setItem('authToken', access);
        localStorage.setItem('refreshToken', refresh);
        localStorage.setItem('isNewUser', JSON.stringify(!is_account_exists));
        console.log('Tokens saved to localStorage', { access: !!access, refresh: !!refresh });

        runInAction(() => {
            this.token = access;
            this.showLoginModal = false;
            this.isNewUser = !is_account_exists;
        });

        return { is_account_exists };
    }

    completeRegistration = () => {
        this.isNewUser = false;
        localStorage.setItem('isNewUser', 'false');
        this.showLoginModal = false;
    }

    logout = () => {
        this.token = null;
        this.isNewUser = false;
        this.loginPhone = '';
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('isNewUser');
    }
}

export const authStore = new AuthStore();
