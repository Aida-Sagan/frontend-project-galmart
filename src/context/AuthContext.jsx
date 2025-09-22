
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCode as apiLogin } from '../api/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('authToken'));
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginPhone, setLoginPhone] = useState('');
    const [tempAuthData, setTempAuthData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
            setTempAuthData(null);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('userCity');
        }
    }, [token]);

    const login = async (phone, code) => {
        const response = await apiLogin(phone, code);

        const { data } = response;
        const { is_account_exists, access, refresh } = data;

        if (is_account_exists) {
            setToken(access);
            localStorage.setItem('refreshToken', refresh);
            closeLoginModal();
            navigate('/profile');
        } else {
            setTempAuthData({ phone, access_token: access, refresh_token: refresh });
            closeLoginModal();
            navigate('/register');
        }
    };

    const completeRegistration = (finalAccessToken, finalRefreshToken) => {
        setToken(finalAccessToken);
        localStorage.setItem('refreshToken', finalRefreshToken);
        setTempAuthData(null);
        navigate('/');
    };

    const logout = () => {
        setToken(null);
        localStorage.removeItem('refreshToken');
        navigate('/');
    };

    const openLoginModal = () => setIsLoginModalOpen(true);
    const closeLoginModal = () => setIsLoginModalOpen(false);

    const value = {
        isAuthenticated: !!token,
        token,
        loginPhone,
        setLoginPhone,
        tempAuthData,
        login,
        logout,
        completeRegistration,
        isLoginModalOpen,
        openLoginModal,
        closeLoginModal,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    return useContext(AuthContext);
};