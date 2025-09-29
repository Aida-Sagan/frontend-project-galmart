import React, { useState } from 'react';
import CitySelectionModal from './CitySelectionModal';
import AddressList from './AddressList';
import AddressModal from './AddressModal';
import { useLocation } from '../../context/LocationContext';
import { useAuth } from '../../context/AuthContext';

const LocationModal = ({ onClose, onCitySelect }) => {
    const { city, userAddresses, selectedAddress, selectAddress, addNewAddress } = useLocation();
    const { isAuthenticated } = useAuth();
    const [view, setView] = useState(() => city && isAuthenticated ? 'addressList' : 'city');

    const handleCitySelect = (selectedCity) => {
        onCitySelect(selectedCity);
        if (!isAuthenticated) {
            onClose();
        } else {
            setView('addressList');
        }
    };

    const handleAddressSelect = (addressId) => {
        const address = userAddresses.find(a => a.id === addressId);
        selectAddress(address);
        onClose();
    };

    const handleSaveNewAddress = async (addressData) => {
        try {
            await addNewAddress(addressData);
            setView('addressList');
        } catch (error) {
            console.error("Не удалось сохранить новый адрес:", error);
        }
    };

    const renderContent = () => {
        if (!isAuthenticated) {
            return <CitySelectionModal onSelectCity={handleCitySelect} />;
        }

        switch(view) {
            case 'city':
                return <CitySelectionModal onSelectCity={handleCitySelect} />;

            case 'addressList': {
                const addressesForCity = userAddresses.filter(addr => addr.city === city?.id);
                return (
                    <div className="modal-overlay">
                        <AddressList
                            addresses={addressesForCity}
                            selectedAddress={selectedAddress?.id}
                            onSelect={handleAddressSelect}
                            onAddNew={() => setView('newAddress')}
                        />
                    </div>
                );
            }
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