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
            //localStorage.removeItem('userCity');
        }
    }, [token]);

    // Эффект для синхронизации флага isNewUser
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

            // Сразу устанавливаем токены как постоянные в обоих случаях
            setToken(access);
            localStorage.setItem('refreshToken', refresh);

            closeLoginModal();

            if (is_account_exists) {
                setIsNewUser(false);
                navigate('/profile');
            } else {
                // Если аккаунт не существует, сохраняем токен, но устанавливаем флаг регистрации
                setIsNewUser(true);
                navigate('/register');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Обработка ошибок входа (например, неверный код)
        }
    };

    // Теперь эта функция просто убирает флаг регистрации
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
        // Заменяем tempAuthData на isNewUser для логики регистрации
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