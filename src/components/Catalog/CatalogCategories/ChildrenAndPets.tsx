import React from 'react';
import { Link } from 'react-router-dom';
import drinksImg from '@/assets/items/juice.png';
import alcoImg from '@/assets/items/alcohol.png';
import petImg from '@/assets/items/pets.png';

const categories = [
    {
        id: 13,
        title: 'Вода, напитки',
        image: drinksImg,
        bg: '#EFD6E7',
        width: 2,
        height: 1,
        slug: 'drinks',
    },
    {
        id: 14,
        title: 'Алкоголь',
        image: alcoImg,
        bg: '#F8CBC3',
        width: 1,
        height: 1,
        slug: 'alcohol',
    },
    {
        id: 15,
        title: 'Товары для животных',
        image: petImg,
        bg: '#CFDBF1',
        width: 2,
        height: 1,
        slug: 'pets',
    },
];

const ChildrenAndPets = () => {
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

export default ChildrenAndPets;
