import milkImg from '@/assets/items/milk_pict.png';
import fruitsImg from '@/assets/items/fruits_png.png';
import cookingImg from '@/assets/items/bread_png.png';
import kitchenImg from '@/assets/items/kitchen.png';
import homeImg from '@/assets/items/clean.png';
import sausageImg from "@/assets/items/sausage.png";
import meatImg from "@/assets/items/meat.png";
import fishImg from '@/assets/items/fish.png';
import frozenImg from '@/assets/items/pelmeni.png';
import conserveImg from '@/assets/items/macarons.png';
import coffeeImg from "@/assets/items/coffee.png";
import sweetImg from "@/assets/items/vaffle.png";
import bearImg from "@/assets/items/bear.png";
import drinksImg from "@/assets/items/juice.png";
import alcoImg from "@/assets/items/alcohol.png";
import petImg from "@/assets/items/pets.png";
import beautyImg from '@/assets/items/beauty.png';
import penImg from '@/assets/items/pens.png';


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
    {
        id: 4,
        title: 'Кулинария',
        image: cookingImg,
        bg: '#EFD6E7',
        width: 2,
        height: 1,
        slug: 'cooking',
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


export default categories;
