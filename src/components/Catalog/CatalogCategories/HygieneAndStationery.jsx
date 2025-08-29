import React from 'react';
import { Link } from 'react-router-dom';
import kitchenImg from '@/assets/items/kitchen.png';
import homeImg from '@/assets/items/clean.png';


const categories = [
    {
        id: 19,
        title: 'Посуда, всё для кухни',
        image: kitchenImg,
        bg: '#F5D9C6',
        width: 1,
        height: 1,
        slug: 'kitchenware',
    },
    {
        id: 20,
        title: 'Товары для дома',
        image: homeImg,
        bg: '#FFEFD2',
        width: 2,
        height: 1,
        slug: 'home-goods',
    },
];

const HygieneAndStationery = () => {
    return (
        <>
            {categories.map(category => (
                <Link
                    to={`/catalog/${category.slug}`}
                    key={category.id}
                    className="catalog-page__card"
                    style={{
                        backgroundColor: category.bg,
                        gridColumn: `span ${category.width || 1}`,
                        gridRow: `span ${category.height || 1}`,
                    }}
                >
                    <h3 className="catalog-page__card-title">{category.title}</h3>
                    <img src={category.image} alt={category.title} className="catalog-page__card-image" />
                </Link>
            ))}
        </>
    );
};

export default HygieneAndStationery;
