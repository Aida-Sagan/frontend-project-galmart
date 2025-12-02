import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
// Импортируем обновленные функции (которые внутри используют $api)
import { fetchAddresses, saveAddress as saveAddressApi } from '../api/services/addressService';

const LocationContext = createContext(null);

export const LocationProvider = ({ children }) => {
    // token нам здесь больше не нужен для передачи в функции, только статус
    const { isAuthenticated } = useAuth();

    const [city, setCity] = useState(null);
    const [userAddresses, setUserAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

    // 1. Инициализация города при загрузке
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

    // 2. Загрузка адресов при смене города или авторизации
    useEffect(() => {
        if (isAuthenticated) {
            setIsLoading(true);

            // ВАЖНО: Вызываем без аргументов.
            // Axios сам подставит токен и хедер City из localStorage.
            fetchAddresses()
                .then(addresses => {
                    // Оставляем фильтрацию на фронте для надежности,
                    // чтобы точно показывать адреса только текущего города
                    const filteredAddresses = addresses.filter(addr =>
                        addr.city && city?.name && addr.city.toLowerCase() === city.name.toLowerCase()
                    );

                    setUserAddresses(filteredAddresses || []);

                    if (filteredAddresses && filteredAddresses.length > 0) {
                        setSelectedAddress(filteredAddresses[0]);
                    } else {
                        setSelectedAddress(null);
                    }
                    setIsLoading(false);
                })
                .catch(err => {
                    console.error(err);
                    setIsLoading(false);
                });
        } else {
            setUserAddresses([]);
            setSelectedAddress(null);
        }
        // Зависимость от city важна: при смене города интерсептор начнет слать новый ID,
        // и мы перезапросим данные.
    }, [isAuthenticated, city]);

    const selectCity = (newCityObject) => {
        // Сохраняем, чтобы интерсептор увидел новый город
        localStorage.setItem('userCity', JSON.stringify(newCityObject));
        setCity(newCityObject);
    };

    const selectAddress = (address) => {
        setSelectedAddress(address);
    };

    const addNewAddress = async (addressData) => {
        if (!isAuthenticated) return;

        try {
            // ВАЖНО: Вызываем без токена
            const newAddress = await saveAddressApi(addressData);

            const cityName = newAddress.city.name || newAddress.city;
            const formattedAddress = { ...newAddress, city: cityName };

            setUserAddresses(prevAddresses => [...prevAddresses, formattedAddress]);
            setSelectedAddress(formattedAddress);
            return formattedAddress;
        } catch (error) {
            console.error("Failed to add address", error);
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
    if (context === null) {
        throw new Error('useLocation must be used within a LocationProvider');
    }
    return context;
};