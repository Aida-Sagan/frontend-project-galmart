// src/context/LocationContext.js

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { fetchAddresses, saveAddress as saveAddressApi } from '../api/services/addressService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    const { isAuthenticated, token } = useAuth();

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
                localStorage.removeItem('userCity');
            }
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (isAuthenticated && token) {
            setIsLoading(true);
            fetchAddresses(token).then(addresses => {
                const filteredAddresses = addresses.filter(addr => addr.city === city?.id);
                setUserAddresses(filteredAddresses || []);
                if (filteredAddresses && filteredAddresses.length > 0) {
                    setSelectedAddress(filteredAddresses[0]);
                } else {
                    setSelectedAddress(null);
                }
                setIsLoading(false);
            });
        } else {
            setUserAddresses([]);
            setSelectedAddress(null);
        }
    }, [isAuthenticated, token, city]);

    const selectCity = (newCityObject) => {
        localStorage.setItem('userCity', JSON.stringify(newCityObject));
        setCity(newCityObject);
    };

    const selectAddress = (address) => {
        setSelectedAddress(address);
    };

    const addNewAddress = async (addressData) => {
        if (!isAuthenticated) return;
        const newAddress = await saveAddressApi(addressData, token);
        // Correct the city field to be an ID, matching the other addresses
        const formattedAddress = { ...newAddress, city: newAddress.city.id };
        setUserAddresses(prevAddresses => [...prevAddresses, formattedAddress]);
        setSelectedAddress(formattedAddress);
        return formattedAddress;
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
    if (context === null) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};