import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchAddresses, saveAddress as saveAddressApi } from '../api/services/addressService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const { isAuthenticated } = useAuth();

    const [city, setCity] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    useEffect(() => {
        const savedCityJSON = localStorage.getItem('userCity');
        if (savedCityJSON) {
            try {
                setCity(JSON.parse(savedCityJSON));
            } catch (e) {
                console.error("Ошибка чтения города", e);
                localStorage.removeItem('userCity');
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!isAuthenticated) {
            setUserAddresses([]);
            setSelectedAddress(null);
            return;
        }

        setIsLoading(true);
        fetchAddresses()
            .then(addresses => {
                const currentCityName = city?.name || '';

                const filteredAddresses = addresses.filter(addr => {
                    if (!addr.city) return false;
                    return addr.city.toLowerCase() === currentCityName.toLowerCase();
                });

                setUserAddresses(filteredAddresses);

                if (filteredAddresses.length > 0) {
                    setSelectedAddress(filteredAddresses[0]);
                } else {
                    setSelectedAddress(null);
                }
            })
            .catch(err => console.error("Ошибка загрузки адресов:", err))
            .finally(() => setIsLoading(false));

    }, [isAuthenticated, city]);

    const selectCity = (newCityObject) => {
        setCity(newCityObject);
        localStorage.setItem('userCity', JSON.stringify(newCityObject));
    };

    const selectAddress = (address) => {
        setSelectedAddress(address);
    };

    const addNewAddress = async (addressData) => {
        if (!isAuthenticated) return;
        // eslint-disable-next-line no-useless-catch
        try {
            const newAddress = await saveAddressApi(addressData);
            const cityName = newAddress.city.name || newAddress.city;
            const formattedAddress = { ...newAddress, city: cityName };

            setUserAddresses(prev => [...prev, formattedAddress]);
            setSelectedAddress(formattedAddress);
            return formattedAddress;
        } catch (error) {
            throw error;
        }
    };

    const openLocationModal = () => setIsLocationModalOpen(true);
    const closeLocationModal = () => setIsLocationModalOpen(false);

    const value = {
        city,
        selectCity,
        userAddresses,
        selectedAddress,
        selectAddress,
        addNewAddress,
        isLoading,
        isLocationModalOpen,
        openLocationModal,
        closeLocationModal,
    };

    return (
        <LocationContext.Provider value={value}>
            {children}
        </LocationContext.Provider>
    );
};

export const useLocation = () => {
    const context = useContext(LocationContext);
    if (!context) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};