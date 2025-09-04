import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ReactComponent as HeartIcon } from '../../assets/svg/like.svg';
import { ReactComponent as HeartLikedIcon } from '../../assets/svg/liked.svg';
import { ReactComponent as PlusIcon } from '../../assets/svg/plus.svg';
import { ReactComponent as MinusIcon } from '../../assets/svg/minus.svg';
import { ReactComponent as EcoIcon } from '../../assets/svg/eco.svg';
import { ReactComponent as GalmIcon } from '../../assets/svg/galm_icon.svg';
import { ReactComponent as BonusIcon } from '../../assets/svg/2_1.svg';
import { useAuth } from '../../context/AuthContext';
import { useFavorites } from '../../context/FavoritesContext.jsx';
import { toggleFavorite as toggleFavoriteApi } from '../../api/services/authService.js';
import './style/ProductCard.css';

const ProductCard = ({ product }) => {
    const {
        id,
        title,
        unit_price = 0,
        old_unit_price = 0,
        currency = '₸',
        unit = 'шт.',
        unit_value = 1,
        photos = [],
        inventory = 0,
        count = 0,
        flags = []
    } = product;

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const { favoriteIds, addFavoriteId, removeFavoriteId, isLoading: isLoadingFavorites } = useFavorites();

    const isFavorite = favoriteIds.has(id);

    const [quantity, setQuantity] = useState(count);
    const addedToCart = quantity > 0;

    const isGalmart = flags.includes('galmart_production');
    const isEco = flags.includes('eco');
    const hasBonus = flags.includes('bonus');

    const handleToggleFavorite = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        const willBeFavorite = !isFavorite;

        if (willBeFavorite) {
            addFavoriteId(id);
        } else {
            removeFavoriteId(id);
        }

        try {
            await toggleFavoriteApi(id);
        } catch (error) {
            console.error("Ошибка при добавлении в избранное:", error);
            if (willBeFavorite) {
                removeFavoriteId(id);
            } else {
                addFavoriteId(id);
            }
        }
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (quantity === 0) {
            setQuantity(1);
        }
    };

    const handleIncrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(prev => (prev < inventory ? prev + 1 : prev));
    };

    const handleDecrement = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setQuantity(prev => (prev > 0 ? prev - 1 : 0));
    };

    const getTotalPrice = () => {
        return (unit_price * quantity).toLocaleString('ru-RU');
    };

    const imageUrl = photos.length > 0 ? photos[0] : 'https://via.placeholder.com/200';
    const productUrl = `/product/${id}`;


    return (
        <Link to={productUrl} className="product-card">
            <div className="product-labels">
                {isGalmart && <span className="product-label galmart"><GalmIcon /></span>}
                {isEco && <span className="product-label eco"><EcoIcon /></span>}
                {hasBonus && <span className="product-label bonus"><BonusIcon /></span>}
            </div>
            <div className="image-container">
                <img src={imageUrl} alt={title} />
            </div>
            <button
                className={`favorite-btn ${isFavorite ? 'active' : ''}`}
                onClick={handleToggleFavorite}
                disabled={isLoadingFavorites}
            >
                {isFavorite ? <HeartLikedIcon /> : <HeartIcon />}
            </button>
            <div className="sub-description">
                <div className="product-details-container">
                    <p className="product-name">{title}</p>
                    <p className="product-subprice">
                        {old_unit_price > 0 && <span className="subprice-strike">{old_unit_price.toLocaleString('ru-RU')} {currency}</span>}
                        <span className="price-descr">{unit_price.toLocaleString('ru-RU')} {currency} / {unit_value} {unit}</span>
                    </p>
                </div>
                <div className="price-btn">
                    <p className="product-price">{unit_price.toLocaleString('ru-RU')} {currency}</p>
                    <button
                        className={`add-to-cart-btn ${addedToCart ? 'expanded' : ''}`}
                        onClick={handleAddToCart}
                    >
                        {addedToCart ? (
                            <>
                                <span className="minus" onClick={handleDecrement}>
                                    <div className="minus-icon-in-price">
                                         <MinusIcon />
                                    </div>
                                   </span>
                                <div className="cart-info">
                                    <span className="price-in-cart">{getTotalPrice()} {currency}</span>
                                    <span className="quantity-in-cart">{quantity} {unit}</span>
                                </div>
                                <span className="plus" onClick={handleIncrement}><PlusIcon /></span>
                            </>
                        ) : (
                            <div className="add-icon-in-price">
                                <PlusIcon />
                            </div>
                        )}
                    </button>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;