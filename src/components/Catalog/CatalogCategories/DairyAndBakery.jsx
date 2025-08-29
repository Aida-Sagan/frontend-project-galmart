import React from 'react';
import { Link } from 'react-router-dom';
import milkImg from '@/assets/items/milk_pict.png';
import cookingImg from '@/assets/items/bread_png.png';
import fruitsImg from "@/assets/items/fruits_png.png";

const DairyAndBakery = () => {
    const categories = [
        {
            id: 1,
            title: 'Молочные продукты, сыры, яйцо',
            image: milkImg,
            bg: '#C9E7F1',
            width: 1,
            height: 1,
            slug: 'milk-eggs',
        },
        {
            id: 2,
            title: 'Овощи и фрукты',
            image: fruitsImg,
            bg: '#C9DFB8',
            width: 2,
            height: 1,
            slug: 'fruits',
        },
        {
            id: 3,
            title: 'Хлеб и выпечка',
            image: cookingImg,
            bg: '#F5D9C6',
            width: 2,
            height: 1,
            slug: 'bread-bakery',
        },
    ];

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
                    <img
                        src={category.image}
                        alt={category.title}
                        className="catalog-page__card-image"
                    />
                </Link>
            ))}
        </>
    );
};

export default DairyAndBakery;
