import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import SidebarSkeleton from '../../components/SkeletonLoader/SidebarSkeleton';
import './style/Sidebar.css';

const Sidebar = ({ categories }) => {
    const [openCategories, setOpenCategories] = useState({});
    const { categoryId } = useParams();

    useEffect(() => {
        if (categoryId) {
            setOpenCategories({ [categoryId]: true });
        }
    }, [categoryId]);

    const toggleCategory = (id) => {
        const isAlreadyOpen = !!openCategories[id];
        setOpenCategories(isAlreadyOpen ? {} : { [id]: true });
    };

    if (!categories || categories.length === 0) {
        return <SidebarSkeleton />;
    }

    return (
        <aside className="sidebar">
            {categories.map(category => {
                const isOpen = !!openCategories[category.id];
                const isParentActive = categoryId && parseInt(categoryId) === category.id;

                return (
                    <div key={category.id} className="sidebar-category">
                        <div
                            className="sidebar-category-header"
                            onClick={() => toggleCategory(category.id)}
                        >
                            <NavLink
                                to={`/catalog/${category.id}`}
                                className={`sidebar-category-link ${isParentActive ? 'active' : ''}`}
                            >
                                {category.title}
                            </NavLink>
                            <span className={`arrow-icon ${isOpen ? 'open' : ''}`}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M18 9L12 15L6 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </span>
                        </div>

                        {category.sections?.length > 0 && isOpen && (
                            <ul className="subcategory-list">
                                {category.sections.map(sub => (
                                    <li key={sub.id}>
                                        <NavLink
                                            to={`/catalog/${category.id}/${sub.id}`}
                                            className={({ isActive }) =>
                                                `subcategory-link ${isActive ? 'active' : ''}`
                                            }
                                        >
                                            {sub.title}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                );
            })}
        </aside>
    );
};

export default Sidebar;