import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useFavorites } from '../../../context/FavoritesContext';
import { toggleFavorite as toggleFavoriteApi } from '../../../api/services/authService';

import { ReactComponent as HeartIcon } from '../../../assets/svg/like.svg';
import { ReactComponent as HeartLikedIcon } from '../../../assets/svg/liked.svg';

import '../style/ProductActions.css';

const ProductActions = ({ product }) => {
    const [quantity, setQuantity] = useState(0);
    const addedToCart = quantity > 0;

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { favoriteIds, addFavoriteId, removeFavoriteId, isLoading: isLoadingFavorites } = useFavorites();

    const isFavorite = product && favoriteIds.has(product.id);

    const handleToggleFavorite = async (e) => {
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const willBeFavorite = !isFavorite;
        if (willBeFavorite) {
            addFavoriteId(product.id);
        } else {
            removeFavoriteId(product.id);
        }

        try {
            await toggleFavoriteApi(product.id);
        } catch (error) {
            console.error("Ошибка при добавлении в избранное:", error);
            if (willBeFavorite) {
                removeFavoriteId(product.id);
            } else {
                addFavoriteId(product.id);
            }
        }
    };


    const handleAddToCart = () => {
        if (!addedToCart) {
            setQuantity(1);
        }
    };

    const handleIncrement = (e) => {
        e.stopPropagation();
        setQuantity(prev => prev + 1);
    };

    const handleDecrement = (e) => {
        e.stopPropagation();
        setQuantity(prev => (prev > 1 ? prev - 1 : 0));
    };

    const finalPrice = product.unit_price * quantity;

    return (
        <div className="actions-container">
            <div className="price-info">
                {product.old_unit_price > 0 && (
                    <span className="old-price">{product.old_unit_price} {product.currency}</span>
                )}
                <span className="current-price">{product.unit_price} {product.currency}</span>
                <span className="unit-label">/ 1 шт</span>
            </div>
            <div className="controls-design">
                <div className="price-display-large">
                    {product.unit_price} {product.currency}
                </div>
                <button
                    className={`add-to-cart-btn-item ${addedToCart ? 'expanded' : ''}`}
                    onClick={handleAddToCart}
                >
                    {addedToCart ? (
                        <>
                            <span className="minus" onClick={handleDecrement}>-</span>
                            <div className="cart-info">
                                <span className="price-in-cart">{finalPrice} {product.currency}</span>
                                <span className="quantity-in-cart">{quantity} шт</span>
                            </div>
                            <span className="plus" onClick={handleIncrement}>+</span>
                        </>
                    ) : (
                        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18 7.875C18.6213 7.875 19.125 8.37868 19.125 9V16.875H27C27.6213 16.875 28.125 17.3787 28.125 18C28.125 18.6213 27.6213 19.125 27 19.125H19.125V27C19.125 27.6213 18.6213 28.125 18 28.125C17.3787 28.125 16.875 27.6213 16.875 27V19.125H9C8.37868 19.125 7.875 18.6213 7.875 18C7.875 17.3787 8.37868 16.875 9 16.875H16.875V9C16.875 8.37868 17.3787 7.875 18 7.875Z" fill="#FBFBFB"/>
                        </svg>

                    )}
                </button>
                <button
                    className="favorite-button-design"
                    onClick={handleToggleFavorite}
                    disabled={isLoadingFavorites}
                >
                    {isFavorite ? <HeartLikedIcon /> : <HeartIcon />}
                </button>
            </div>
            <div className="info-message">
                <p>Вес товара может незначительно измениться. Итоговая цена будет указана в чеке</p>
            </div>
        </div>
    );
};

export default ProductActions;