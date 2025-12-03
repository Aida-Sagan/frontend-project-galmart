import React from 'react';
import CartItem from '../CartItem/CartItem';
import ItemsBlock from './ItemsBlock';
import { useCart } from '../../context/CartContext';

const CartItemsSection = () => {

    const {
        cartData,
    } = useCart();

    if (!cartData || !cartData.items) {
        return null;
    }

    const allItems = cartData.items;


    const promoItems = allItems.filter(item => item.is_promo);
    const outOfStockItems = allItems.filter(item => item.out_of_stock);
    const orderItems = allItems.filter(
        item => !item.is_promo && !item.out_of_stock
    );

    return (
        <>
            <ItemsBlock title="Состав заказа">
                {orderItems.map(item => (

                    <CartItem
                        key={item.id}
                        item={item}
                    />
                ))}
            </ItemsBlock>

            {promoItems.length > 0 && (
                <ItemsBlock title="Акционные товары" className="promo-block">
                    {promoItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            isPromo={true}
                        />
                    ))}
                </ItemsBlock>
            )}

            {outOfStockItems.length > 0 && (
                <ItemsBlock title="Нет в наличии" className="out-of-stock-block">
                    {outOfStockItems.map(item => (
                        <CartItem
                            key={item.id}
                            item={item}
                            isOutOfStock={true}
                        />
                    ))}
                </ItemsBlock>
            )}
        </>
    );
};

export default CartItemsSection;