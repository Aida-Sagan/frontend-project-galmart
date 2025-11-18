import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginWithCode as apiLogin } from '../api/services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => {
        const storedToken = localStorage.getItem('authToken');
        console.log('Auth Init: Loaded token from localStorage:', storedToken ? 'YES' : 'NO');
        return storedToken;
    });
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [loginPhone, setLoginPhone] = useState('');
    const [tempAuthData, setTempAuthData] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (token) {
            // ➡️ LOG 1: Сохранение постоянного токена (Access Token)
            console.log('✅ EFFECT: Saving Permanent Access Token to localStorage.');
            localStorage.setItem('authToken', token);
            setTempAuthData(null);
        } else {
            // ➡️ LOG 2: Очистка токена
            console.log('❌ EFFECT: Removing authToken from localStorage.');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userCity');
        }
    }, [token]);

    const login = async (phone, code) => {
        try {
            const response = await apiLogin(phone, code);
            const { data } = response;
            const { is_account_exists, access, refresh } = data;

            if (is_account_exists) {
                // ➡️ LOG 3: Сценарий ВХОДА (Постоянный токен)
                console.log('✅ LOGIN SUCCESS: Account exists. Setting Permanent Token.');
                console.log('   New Access Token (setToken):', access.substring(0, 15) + '...');
                console.log('   Refresh Token (localStorage):', refresh.substring(0, 15) + '...');

                setToken(access);
                localStorage.setItem('refreshToken', refresh);
                closeLoginModal();
                navigate('/profile');
            } else {
                // ➡️ LOG 4: Сценарий РЕГИСТРАЦИИ (Временный токен)
                console.log('⚠️ REGISTRATION START: Account does not exist. Setting Temporary Token.');
                console.log('   Temporary Access Token (tempAuthData):', access.substring(0, 15) + '...');

                setTempAuthData({ phone, access_token: access, refresh_token: refresh });
                closeLoginModal();
                navigate('/register');
            }
        } catch (error) {
            console.error('Login error:', error);
            // Обработка ошибок входа (например, неверный код)
        }
    };

    const completeRegistration = (finalAccessToken, finalRefreshToken) => {
        if (!finalAccessToken || !finalRefreshToken) {
            console.error('❌ ERROR: Final tokens missing during registration completion. Cannot set permanent session.');
            setTempAuthData(null);
            navigate('/login', { replace: true });
            return;
        }

        console.log('✅ REGISTRATION COMPLETE: Setting Final Permanent Token.');
        console.log('   Final Access Token (setToken):', finalAccessToken.substring(0, 15) + '...');

        setToken(finalAccessToken);
        localStorage.setItem('refreshToken', finalRefreshToken);
        setTempAuthData(null);
        navigate('/');
    };

    const logout = () => {
        // ➡️ LOG 6: Выход
        console.log('👋 LOGOUT: Clearing all tokens.');
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