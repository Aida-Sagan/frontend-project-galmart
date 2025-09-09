import React from 'react';
import './styles/CitySelectionModal.css';

export default function CitySelectionModal({ onSelectCity }) {
    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <p className="modal-title">Выберите ваш город</p>
                <div className="city-buttons">
                    <button className="city-btn astana" onClick={() => onSelectCity('Астана')}>
                        Астана
                    </button>
                    <button className="city-btn almaty" onClick={() => onSelectCity('Алматы')}>
                        Алматы
                    </button>
                </div>
                <p className="modal-description">
                    Выберите город, чтобы видеть актуальные цены и доступные остатки.
                </p>
            </div>
        </div>
    );
}