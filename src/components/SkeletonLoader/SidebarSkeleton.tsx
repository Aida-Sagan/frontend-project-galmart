import React from 'react';
import './styles/SidebarSkeleton.css';

const SidebarSkeleton = () => {
    return (
        <aside className="sidebar-skeleton">
            {Array.from({ length: 8 }).map((_, index) => (
                <div key={index} className="skeleton-item"></div>
            ))}
        </aside>
    );
};

export default SidebarSkeleton;