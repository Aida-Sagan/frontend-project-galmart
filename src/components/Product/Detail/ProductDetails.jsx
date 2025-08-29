import React from 'react';
import '../style/ProductDetails.css';

const ProductDetails = ({ product, isOpen }) => {
    return (
        <div className={`details-collapsible ${isOpen ? 'open' : ''}`}>
            <div className="details-content">
                <div className="detail-section">
                    <h4>Описание</h4>
                    <p>{product.description || 'Мягкая, тонкого помола, цвет белый или белый с кремовым оттенком.'}</p>
                </div>
                <div className="detail-section">
                    <h4>Состав</h4>
                    <p>{product.composition || 'Мука пшеничная хлебопекарная фортифицированная, обогащенная витаминно-минеральным премиксом.'}</p>
                </div>
                <div className="detail-section">
                    <h4>Условия хранения</h4>
                    <p>{product.storage_conditions || 'Хранить в сухом прохладном месте.'}</p>
                </div>
                <div className="detail-section">
                    <h4>Характеристики</h4>
                    <ul className="characteristics-list">
                        <li><span>Бренд</span><span>{product.brand || 'Ламбер'}</span></li>
                        <li><span>Страна</span><span>{product.country || 'Казахстан'}</span></li>
                        <li><span>Артикул</span><span>{product.articul}</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;