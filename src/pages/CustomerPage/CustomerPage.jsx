import React from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { footerData } from '@/components/Footer/footerData.js';


import './style/CustomerPage.css';


const customerMap = footerData.customer?.links?.reduce((acc, item) => {
    acc[item.path] = item.title;
    return acc;
}, {}) || {};

const CustomerPage = () => {
    const location = useLocation();

    const pathSegments = location.pathname.split('/');
    const currentPathSegment = pathSegments[pathSegments.length - 1];

    const currentPageTitle = customerMap[currentPathSegment] || 'Выберите раздел';

    return (
        <div className="legal-page-layout">
            <header className="legal-header">
                <p>
                    Главная — {footerData.customer?.title || 'Покупателям'}
                    {currentPageTitle !== 'Выберите раздел' && ` — ${currentPageTitle}`}
                </p>
            </header>

            <div className="legal-content-wrapper">

                {/* Левая колонка: Сайдбар Покупателям */}
                <aside
                    id="customer-sidebar"
                    className="legal-sidebar"
                >
                    <nav>
                        {footerData.customer?.links?.map((item) => (
                            <NavLink
                                key={item.path}

                                to={item.path}
                                className={({ isActive }) =>
                                    `sidebar-item ${isActive ? 'sidebar-item--active' : ''}`
                                }
                                end
                            >
                                {item.title}
                            </NavLink>
                        ))}
                    </nav>
                </aside>

                {/* Правая колонка: Контент раздела. Рендерится через Outlet */}
                <main className="legal-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default CustomerPage;