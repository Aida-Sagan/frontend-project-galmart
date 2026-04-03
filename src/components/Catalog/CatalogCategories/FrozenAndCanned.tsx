import React from 'react';
import { Link } from 'react-router-dom';
import fishImg from '@/assets/items/fish.png';
import frozenImg from '@/assets/items/pelmeni.png';
import conserveImg from '@/assets/items/macarons.png';


const categories = [
    {
        id: 7,
        title: 'Рыба, морепродукты',
        image: fishImg,
        bg: '#CFDBF1',
        width: 2,
        height: 1,
        slug: 'fish-seafood',
    },
    {
        id: 8,
        title: 'Замороженные продукты',
        image: frozenImg,
        bg: '#E5EBC3',
        width: 2,
        height: 1,
        slug: 'frozen-food',
    },
    {
        id: 9,
        title: 'Макароны, крупы, консервы',
        image: conserveImg,
        bg: '#C9E7F1',
        width: 1,
        height: 1,
        slug: 'groceries',
    },
];

const FrozenAndCanned = () => {
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

export default FrozenAndCanned;
