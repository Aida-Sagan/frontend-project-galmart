import React from 'react';
import './styles/AddressList.css';

const AddressList = ({ addresses, selectedId, onSelect }) => {
    return (
        <div className="address-list">
            {addresses.map((addr) => (
                <div
                    key={addr.id}
                    className={`address-item ${selectedId === addr.id ? 'active' : ''}`}
                    onClick={() => onSelect(addr.id)}
                >
                    <div className="address-text">
                        {addr.full_address || addr.address}
                    </div>

                    <div className="radio-indicator">
                        <div className="radio-inner"></div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AddressList;