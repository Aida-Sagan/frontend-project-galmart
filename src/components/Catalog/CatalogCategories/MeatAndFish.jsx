import React from 'react';
import { Link } from 'react-router-dom';
import cookingImg from '@/assets/items/pasta.png';
import sausageImg from '@/assets/items/sausage.png';
import meatImg from '@/assets/items/meat.png';

const categories = [
    {
        id: 4,
        title: 'Кулинария',
        image: cookingImg,
        bg: '#EFD6E7',
        width: 2,
        height: 1,
        slug: 'food',
    },
    {
        id: 5,
        title: 'Колбасы и мясные деликатесы',
        image: sausageImg,
        bg: '#EFD6E7',
        width: 1,
        height: 1,
        slug: 'sausages',
    },
    {
        id: 6,
        title: 'Мясо и птица',
        image: meatImg,
        bg: '#F8CBC3',
        width: 2,
        height: 1,
        slug: 'meat-poultry',
    },

];

const MeatAndFish = () => {
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

export default MeatAndFish;
