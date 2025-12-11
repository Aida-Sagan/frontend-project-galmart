import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCode as apiLogin } from '../api/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('authToken');
        return storedToken;
    });
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginPhone, setLoginPhone] = useState('');
    const [isNewUser, setIsNewUser] = useState(
        JSON.parse(localStorage.getItem('isNewUser')) || false
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            localStorage.setItem('authToken', token);
        } else {
            localStorage.removeItem('authToken');
            localStorage.removeItem('refreshToken');
        }
    }, [token]);

    useEffect(() => {
        localStorage.setItem('isNewUser', JSON.stringify(isNewUser));
        if (!isNewUser && token && window.location.pathname === '/register') {
            navigate('/', { replace: true });
        }
    }, [isNewUser, token, navigate]);

    const login = async (phone, code) => {
        try {
            const response = await apiLogin(phone, code);
            const { data } = response;
            const { is_account_exists, access, refresh } = data;

            setToken(access);
            localStorage.setItem('refreshToken', refresh);

            closeLoginModal();

            if (is_account_exists) {
                setIsNewUser(false);
                navigate('/profile');
            } else {
                setIsNewUser(true);
                navigate('/register');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    };

    const completeRegistration = () => {
        setIsNewUser(false);
        navigate('/');
    };

    const logout = () => {
        setToken(null);
        setIsNewUser(false);
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
        isNewUser,
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