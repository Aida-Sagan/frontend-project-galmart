import React from 'react';
import LocationModal from './components/AddressModal/LocationModal.jsx';
import { useLocation } from './context/LocationContext.jsx';

export default function GlobalModals() {
    const {
        isLocationModalOpen,
        closeLocationModal,
        selectCity,
    } = useLocation();

    const handleCitySelectAndClose = (selectedCity) => {
        selectCity(selectedCity);

    };

    return (
        <>
            {isLocationModalOpen && (
                <LocationModal
                    onClose={closeLocationModal}
                    onCitySelect={handleCitySelectAndClose}
                />
            )}
        </>
    );
}