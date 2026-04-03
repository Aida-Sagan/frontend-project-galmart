import React from 'react';
import { Link } from 'react-router-dom';
import beautyImg from '@/assets/items/beauty.png';
import homeImg from '@/assets/items/home.png';
import penImg from '@/assets/items/pens.png';


const categories = [
    {
        id: 16,
        title: 'Красота и гигиена',
        image: beautyImg,
        bg: '#E5EBC3',
        width: 2,
        height: 1,
        slug: 'beauty-hygiene',
    },
    {
        id: 17,
        title: 'Бытовая химия',
        image: homeImg,
        bg: '#C9E7F1',
        width: 2,
        height: 1,
        slug: 'house-chemicals',
    },
    {
        id: 18,
        title: 'Канцтовары, творчество, досуг',
        image: penImg,
        bg: '#C9E7F1',
        width: 1,
        height: 1,
        slug: 'stationery',
    },
];

const HouseholdGoods = () => {
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

export default HouseholdGoods;
