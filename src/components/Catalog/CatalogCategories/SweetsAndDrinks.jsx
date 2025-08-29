import React from 'react';
import { Link } from 'react-router-dom';
import coffeeImg from '@/assets/items/coffee.png';
import sweetImg from '@/assets/items/vaffle.png';
import bearImg from '@/assets/items/bear.png';


const categories = [
    {
        id: 10,
        title: 'Чай, кофе, какао',
        image: coffeeImg,
        bg: '#C9DFB8',
        width: 1,
        height: 1,
        slug: 'tea-coffee',
    },
    {
        id: 11,
        title: 'Торты, десерты и сладости',
        image: sweetImg,
        bg: '#F5D9C6',
        width: 2,
        height: 1,
        slug: 'sweets',
    },
    {
        id: 12,
        title: 'Товары для детей',
        image: bearImg,
        bg: '#FFEFD2',
        width: 2,
        height: 1,
        slug: 'kids',
    },

];

const SweetsAndDrinks = () => {
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

export default SweetsAndDrinks;
