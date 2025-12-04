import React, { useState, useMemo } from 'react';
import CitySelectionModal from './CitySelectionModal';
import AddressList from './AddressList';
import AddressModal from './AddressModal';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';
import './styles/LocationModal.css';

const LocationModal = ({ onClose, onCitySelect }) => {
    const { city, userAddresses, selectedAddress, selectAddress, addNewAddress } = useLocation();
    const { isAuthenticated } = useAuth();

    const [view, setView] = useState(() => (city && isAuthenticated ? 'addressList' : 'city'));

    const flatAddresses = useMemo(() => {
        if (!userAddresses) return [];

        return (userAddresses || []).flatMap(group =>
            (group.addresses || []).map(addr => ({
                ...addr,
                cityName: group.city
            }))
        );
    }, [userAddresses]);

    const handleCitySelect = (selectedCity) => {
        onCitySelect(selectedCity);
        if (!isAuthenticated) {
            onClose();
        } else {
            setView('addressList');
        }
    };

    const handleAddressSelect = (addressId) => {
        const address = flatAddresses.find(a => a.id === addressId);
        if (address) {
            selectAddress(address);
            onClose();
        }
    };

    const handleSaveNewAddress = async (addressData) => {
        try {
            await addNewAddress(addressData);
            setView('addressList');
        } catch (error) {
            console.error("Не удалось сохранить новый адрес:", error);
        }
    };

    if (!isAuthenticated || view === 'city') {
        return <CitySelectionModal onSelectCity={handleCitySelect} onClose={onClose} />;
    }

    if (view === 'newAddress') {
        return (
            <AddressModal
                isOpen={true}
                onClose={() => setView('addressList')}
                onSave={handleSaveNewAddress}
            />
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content-adress-list" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Выбор адреса</h2>
                    <button className="close-btn" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                    </button>
                </div>

                <div className="modal-body">
                    {flatAddresses.length > 0 ? (
                        <AddressList
                            addresses={flatAddresses}
                            selectedId={selectedAddress?.id}
                            onSelect={handleAddressSelect}
                        />
                    ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                            Список адресов пуст
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button
                        className="add-new-btn"
                        onClick={() => setView('newAddress')}
                    >
                        Добавить новый адрес
                    </button>
                </div>
            </div>
        </div>
    );
};

export default LocationModal;