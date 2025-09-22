import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Container from '../../components/Container/Container';
import './styles/ProfilePage.css';

const ProfilePage = () => {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    // Если пользователь не авторизован (например, разлогинился), он перенаправляется на главную.
    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    // Пока происходит проверка и редирект, можно ничего не отрисовывать
    if (!isAuthenticated) {
        return null;
    }

    return (
        <Container>
            <div className="profile-page">
                <h1 className="profile-title">Профиль</h1>
                <p className="profile-welcome">Здесь будет информация о вашем профиле.</p>
                <button onClick={logout} className="logout-button">
                    Выйти
                </button>
            </div>
        </Container>
    );
};

export default ProfilePage;