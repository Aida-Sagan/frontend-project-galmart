import React, { createContext, useReducer, useContext, useCallback } from 'react';
import { getUserData, getOnlineOrdersData } from '../api/services/profileService';

const initialState = {
    profile: null,
    orders: [],
    bonusBalance: { balance: 0, currency: '₸' },
    isLoading: false,
    error: null,
};

const ProfileActionTypes = {
    LOADING: 'LOADING',
    SET_PROFILE: 'SET_PROFILE',
    SET_ORDERS: 'SET_ORDERS',
    SET_BONUS_BALANCE: 'SET_BONUS_BALANCE',
    ERROR: 'ERROR',
    CLEAR_STATE: 'CLEAR_STATE',
};

const profileReducer = (state, action) => {
    switch (action.type) {
        case ProfileActionTypes.LOADING:
            return {
                ...state,
                isLoading: true,
                error: null,
            };
        case ProfileActionTypes.SET_PROFILE:
            return {
                ...state,
                isLoading: false,
                profile: action.payload,
            };
        case ProfileActionTypes.SET_ORDERS:
            return {
                ...state,
                isLoading: false,
                orders: action.payload,
            };
        case ProfileActionTypes.SET_BONUS_BALANCE:
            return {
                ...state,
                isLoading: false,
                bonusBalance: action.payload,
            };
        case ProfileActionTypes.ERROR:
            return {
                ...state,
                isLoading: false,
                error: action.payload,
            };
        case ProfileActionTypes.CLEAR_STATE:
            return initialState;
        default:
            return state;
    }
};

export const ProfileContext = createContext(initialState);

export const ProfileProvider = ({ children }) => {
    const [state, dispatch] = useReducer(profileReducer, initialState);

    const fetchUserProfile = useCallback(async () => {
        dispatch({ type: ProfileActionTypes.LOADING });
        try {
            const data = await getUserData();
            dispatch({ type: ProfileActionTypes.SET_PROFILE, payload: data });
        } catch (err) {
            dispatch({ type: ProfileActionTypes.ERROR, payload: err.message || 'Ошибка загрузки профиля' });
        }
    }, [dispatch]);

    const fetchOnlineOrders = useCallback(async () => {
        dispatch({ type: ProfileActionTypes.LOADING });
        try {
            const data = await getOnlineOrdersData();
            dispatch({ type: ProfileActionTypes.SET_ORDERS, payload: data.orders || data || [] });
        } catch (err) {
            dispatch({ type: ProfileActionTypes.ERROR, payload: err.message || 'Ошибка загрузки заказов' });
            dispatch({ type: ProfileActionTypes.SET_ORDERS, payload: [] });
        }
    }, [dispatch]);

    const fetchBonusBalance = useCallback(async () => {
        dispatch({ type: ProfileActionTypes.SET_BONUS_BALANCE, payload: { balance: 0, currency: '₸' } });
    }, [dispatch]);


    const clearProfileState = useCallback(() => {
        dispatch({ type: ProfileActionTypes.CLEAR_STATE });
    }, [dispatch]);

    const fetchAllProfileData = useCallback(() => Promise.all([
        fetchUserProfile(),
        fetchOnlineOrders(),
        fetchBonusBalance(),
    ]), [fetchUserProfile, fetchOnlineOrders, fetchBonusBalance]);

    const value = {
        ...state,
        fetchUserProfile,
        fetchOnlineOrders,
        fetchBonusBalance,
        clearProfileState,
        fetchAllProfileData,
    };

    return (
        <ProfileContext.Provider value={value}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (context === undefined) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};