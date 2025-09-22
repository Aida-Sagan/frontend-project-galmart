import React from 'react';
import './styles/AddressList.css';

const AddressList = ({ addresses, selectedAddress, onSelect, onAddNew }) => {
    return (
        <div className="address-list-content">
            <h2 className="modal-title">Выбор адреса</h2>
            <div className="addresses">
                {addresses.map((addr, index) => (
                    <label key={addr.id || index} className="address-item">
                        <span className="address-text">{addr.address}</span>
                        <input
                            type="radio"
                            name="address"
                            checked={selectedAddress === addr.id}
                            onChange={() => onSelect(addr.id)}
                        />
                        <span className="radio-custom"></span>
                    </label>
                ))}
            </div>
            <button onClick={onAddNew} className="btn-add-new-address">
                Добавить новый адрес
            </button>
        </div>
    );
};
export default AddressList;