import React, { useState } from 'react';
import CitySelectionModal from './CitySelectionModal';
import AddressList from './AddressList';
import AddressModal from './AddressModal';
import { useLocation } from '../../context/LocationContext';

const LocationModal = ({ onClose, onCitySelect }) => {
    const { city, userAddresses, selectedAddress, selectAddress, addNewAddress } = useLocation();
    const [view, setView] = useState(() => city ? 'addressList' : 'city');

    const handleCitySelect = (selectedCity) => {
        onCitySelect(selectedCity);
        setView('addressList');
    };

    const handleAddressSelect = (addressId) => {
        const address = userAddresses.find(a => a.id === addressId);
        selectAddress(address);
        onClose();
    };

    const handleSaveNewAddress = async (addressData) => {
        try {
            console.log("Вызов addNewAddress из контекста...");
            await addNewAddress(addressData);
            setView('addressList');
        } catch (error) {
            console.error("Не удалось сохранить новый адрес:", error);
        }
    };

    const renderContent = () => {
        switch(view) {
            case 'city':
                return <CitySelectionModal onSelectCity={handleCitySelect} />;
            case 'addressList':
                { const addressesForCity = userAddresses.filter(addr => addr.city === city?.id);
                return (
                    <div className="modal-overlay">
                        <AddressList
                            addresses={addressesForCity}
                            selectedAddress={selectedAddress?.id}
                            onSelect={handleAddressSelect}
                            onAddNew={() => setView('newAddress')}
                        />
                    </div>
                ); }
            case 'newAddress':
                return (
                    <AddressModal
                        isOpen={true}
                        onClose={() => setView('addressList')}
                        onSave={handleSaveNewAddress}
                    />
                );
            default:
                return null;
        }
    };

    return renderContent();
};
export default LocationModal;