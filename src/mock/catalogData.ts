export const catalogData = [
    {
        id: 1,
        name: 'Молочные продукты, сыры, яйца',
        slug: 'milk-eggs',
        subcategories: [
            { name: 'Молоко, сливки', slug: 'milk-cream', items: ['Молоко коровье', 'Молоко растительное', 'Сливки', 'Сывороточные напитки'] },
            { name: 'Масло сливочное, маргарин', slug: 'butter-margarine', items: ['Маргарин', 'Масло гхи', 'Масло сливочное, спред'] },
            { name: 'Кисломолочные продукты', slug: 'fermented-dairy', items: ['Закваски', 'Кефиры, ряженки', 'Кисломолочные напитки'] },
            { name: 'Йогурты', slug: 'yogurts', items: ['Йогурты густые', 'Йогурты питьевые', 'Сладкие десерты'] },
            { name: 'Сыры', slug: 'cheese', items: ['Копченые', 'Мягкие, рассольные', 'Плавленые', 'Твердые, полутвердые', 'Творожные'] },
            { name: 'Творог, творожные десерты', slug: 'curd-desserts', items: ['Сырки творожные', 'Творог', 'Десерты творожные'] },
            { name: 'Сгущенное молоко, коктейли', slug: 'condensed-milk-cocktails', items: ['Молочные коктейли', 'Сгущенное молоко'] },
            { name: 'Яйцо', slug: 'eggs', items: ['Яйца куриные', 'Яйца перепелиные'] },
        ],
    },
    {
        id: 2,
        name: 'Овощи, фрукты',
        slug: 'fruits',
        subcategories: [
            { name: 'Овощи', slug: 'vegetables', items: ['Огурцы', 'Помидоры', 'Картофель', 'Морковь'] },
            { name: 'Фрукты', slug: 'fruits-inner', items: ['Яблоки', 'Бананы', 'Апельсины', 'Груши'] },
        ],
    },
    {
        id: 3,
        name: 'Хлеб и выпечка',
        slug: 'bread-bakery',
        subcategories: [
            { name: 'Хлеб', slug: 'bread', items: ['Белый хлеб', 'Черный хлеб', 'Багеты'] },
            { name: 'Выпечка', slug: 'bakery', items: ['Булочки', 'Круассаны', 'Пироги'] },
        ],
    },
    {
        id: 4,
        name: 'Кулинария',
        slug: 'cooking',
        subcategories: [
            { name: 'Горячие блюда', slug: 'hot-dishes', items: ['Плов', 'Котлеты', 'Макароны с мясом'] },
            { name: 'Салаты', slug: 'salads', items: ['Оливье', 'Винегрет', 'Селедка под шубой'] },
        ],
    },
    {
        id: 5,
        name: 'Колбасы и мясные деликатесы',
        slug: 'sausages',
        subcategories: [
            { name: 'Колбасы', slug: 'sausages-main', items: ['Вареные', 'Копченые', 'Полукопченые'] },
            { name: 'Мясные деликатесы', slug: 'meat-delicacies', items: ['Буженина', 'Ветчина', 'Пастрома'] },
        ],
    },
    {
        id: 6,
        name: 'Мясо и птица',
        slug: 'meat-poultry',
        subcategories: [
            { name: 'Мясо', slug: 'meat', items: ['Говядина', 'Свинина', 'Баранина'] },
            { name: 'Птица', slug: 'poultry', items: ['Курица', 'Индейка'] },
        ],
    },
    {
        id: 7,
        name: 'Рыба, морепродукты',
        slug: 'fish-seafood',
        subcategories: [
            { name: 'Рыба', slug: 'fish', items: ['Семга', 'Форель', 'Хек'] },
            { name: 'Морепродукты', slug: 'seafood', items: ['Креветки', 'Кальмары', 'Мидии'] },
        ],
    },
    {
        id: 8,
        name: 'Замороженные продукты',
        slug: 'frozen',
        subcategories: [
            { name: 'Полуфабрикаты', slug: 'semi-finished', items: ['Пельмени', 'Вареники', 'Котлеты'] },
            { name: 'Овощи и ягоды', slug: 'frozen-vegetables', items: ['Кукуруза', 'Горошек', 'Клубника'] },
        ],
    },
    {
        id: 9,
        name: 'Макароны, крупы, консервы',
        slug: 'groceries',
        subcategories: [
            { name: 'Макароны', slug: 'pasta', items: ['Спагетти', 'Рожки', 'Лапша'] },
            { name: 'Крупы', slug: 'grains', items: ['Рис', 'Гречка', 'Овсянка'] },
            { name: 'Консервы', slug: 'canned', items: ['Говядина тушеная', 'Фасоль', 'Кукуруза'] },
        ],
    },
    {
        id: 10,
        name: 'Чай, кофе, какао',
        slug: 'tea-coffee',
        subcategories: [
            { name: 'Чай', slug: 'tea', items: ['Черный', 'Зеленый', 'Травяной'] },
            { name: 'Кофе', slug: 'coffee', items: ['Растворимый', 'Молотый', 'В зернах'] },
            { name: 'Какао', slug: 'cocoa', items: ['Какао порошок', 'Горячий шоколад'] },
        ],
    },
    {
        id: 11,
        name: 'Торты, десерты и сладости',
        slug: 'sweets',
        subcategories: [
            { name: 'Торты', slug: 'cakes', items: ['Медовик', 'Наполеон', 'Шоколадный'] },
            { name: 'Печенье', slug: 'cookies', items: ['Овсяное', 'Песочное', 'С орехами'] },
            { name: 'Конфеты', slug: 'candies', items: ['Шоколадные', 'Карамельки', 'Ириски'] },
        ],
    },
    {
        id: 12,
        name: 'Товары для детей',
        slug: 'kids',
        subcategories: [
            { name: 'Детское питание', slug: 'baby-food', items: ['Каши', 'Пюре', 'Молочные смеси'] },
            { name: 'Подгузники и гигиена', slug: 'baby-hygiene', items: ['Подгузники', 'Салфетки', 'Кремы'] },
            { name: 'Игрушки и одежда', slug: 'baby-toys-clothes', items: ['Игрушки', 'Комбинезоны', 'Шапки'] },
        ],
    },
    {
        id: 13,
        name: 'Товары для животных',
        slug: 'pets',
        subcategories: [
            { name: 'Корма', slug: 'pet-food', items: ['Сухой корм', 'Консервы', 'Лакомства'] },
            { name: 'Уход и гигиена', slug: 'pet-hygiene', items: ['Шампуни', 'Наполнители', 'Салфетки'] },
            { name: 'Игрушки и аксессуары', slug: 'pet-toys', items: ['Игрушки', 'Ошейники', 'Миски'] },
        ],
    }

];
