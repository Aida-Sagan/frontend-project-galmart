import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { footerData } from '@/components/Footer/footerData.js';
import './style/LegalPage.css';

const legalMap = footerData.legal.links.reduce((acc, item) => {
    acc[item.path] = item.title;
    return acc;
}, {});

const LegalPage = () => {
    const location = useLocation();

    const pathSegments = location.pathname.split('/');
    const currentPathSegment = pathSegments[pathSegments.length - 1];

    const currentPageTitle = legalMap[currentPathSegment] || 'Выберите раздел';

    return (
        <div className="legal-page-layout">
            <header className="legal-header">
                <p>
                    Главная — {footerData.legal.title}
                    {currentPageTitle !== 'Выберите раздел' && ` — ${currentPageTitle}`}
                </p>
            </header>

            <div className="legal-content-wrapper">

                <aside
                    id="legal-sidebar"
                    className="legal-sidebar"
                >
                    <nav>
                        {footerData.legal.links.map((item) => (
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

                <main className="legal-main-content">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default LegalPage;