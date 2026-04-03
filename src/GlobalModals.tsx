import React from 'react';
import LocationModal from './components/AddressModal/LocationModal';
import { observer } from 'mobx-react-lite';
import { locationStore } from './stores/locationStore';

const GlobalModals = observer(() => {
    const {
        isLocationModalOpen,
        closeLocationModal,
        selectCity,
    } = locationStore;

    const handleCitySelectAndClose = (selectedCity: any) => {
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
});

export default GlobalModals;