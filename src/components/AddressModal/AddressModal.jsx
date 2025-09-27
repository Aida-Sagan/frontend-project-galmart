import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import YandexMap from "./YandexMap";
import "./styles/AddressModal.css";
import { useLocation } from "../../context/LocationContext";
import { useAuth } from "../../context/AuthContext";
import { saveAddress, getCoordsByString, getCityPolygons, getAddressByCoords } from "../../api/services/addressService";

function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);
        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);
    return debouncedValue;
}

const isPointInAnyPolygon = (point, polygons) => {
    // point - [latitude, longitude]
    const isPointInPolygon = (p, poly) => {
        const x = p[0], y = p[1];
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0], yi = poly[i][1];
            const xj = poly[j][0], yj = poly[j][1];

            const intersect = ((yi > y) !== (yj > y)) &&
                (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

            if (intersect) inside = !inside;
        }
        return inside;
    };

    return polygons.some(polygon => isPointInPolygon(point, polygon));
};

export default function AddressModal({ isOpen, onClose, onSave }) {
    const { city, selectCity } = useLocation();
    const { token } = useAuth();

    const [addressString, setAddressString] = useState('');
    const [street, setStreet] = useState('');
    const [building, setBuilding] = useState('');
    const [coords, setCoords] = useState(null);
    const [apartment, setApartment] = useState("");
    const [entrance, setEntrance] = useState("");
    const [floor, setFloor] = useState("");
    const [comment, setComment] = useState("");
    const [isPrivateHouse, setIsPrivateHouse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryPolygons, setDeliveryPolygons] = useState([]);
    const [isManualInput, setIsManualInput] = useState(false);
    const [showCityDropdown, setShowCityDropdown] = useState(false);

    const cities = [
        { id: 1, name: 'Астана' },
        { id: 2, name: 'Алматы' },
    ];

    const debouncedAddressString = useDebounce(addressString, 500);

    useEffect(() => {
        const fetchPolygons = async () => {
            if (city?.id && token) {
                const polygonsData = await getCityPolygons(token);
                setDeliveryPolygons(polygonsData);
            } else {
                setDeliveryPolygons([]);
            }
        };
        fetchPolygons();
    }, [city, token]);

    useEffect(() => {
        if (isManualInput && token && debouncedAddressString && debouncedAddressString.length > 3 && city?.id) {
            getCoordsByString(debouncedAddressString, city.id, token).then(result => {
                if (result) {
                    setAddressString(result.title);
                    setStreet(result.address);
                    setBuilding(result.building);
                    setCoords([result.latitude, result.longitude]);
                }
            });
        }
    }, [debouncedAddressString, city, token, isManualInput]);

    const handleCitySelect = (selectedCity) => {
        selectCity(selectedCity);
        setShowCityDropdown(false);
        setAddressString('');
        setStreet('');
        setBuilding('');
        setCoords(null);
    };

    const handleSubmit = async () => {
        if (!addressString || !coords) {
            alert("Пожалуйста, выберите точку на карте или введите адрес.");
            return;
        }

        if (!token) {
            alert("Для сохранения адреса необходимо войти в аккаунт.");
            return;
        }

        const pointInPolygonCheck = isPointInAnyPolygon(coords, deliveryPolygons);
        console.log('Проверка нахождения точки в полигоне:', pointInPolygonCheck);
        console.log('Координаты:', coords);

        if (deliveryPolygons.length > 0 && !pointInPolygonCheck) {
            alert("Извините, выбранный адрес находится вне зоны доставки.");
            return;
        }

        setIsLoading(true);

        const addressData = {
            city: city.id,
            address: street,
            building: isPrivateHouse ? "-" : building,
            latitude: coords[0],
            longitude: coords[1],
            apartment: isPrivateHouse ? "" : apartment,
            entrance: isPrivateHouse ? "" : entrance,
            floor: isPrivateHouse ? "" : floor,
            private_house: isPrivateHouse,
            comment: comment,
            name: "Мой новый адрес",
        };

        try {
            const savedData = await saveAddress(addressData, token);
            onSave(savedData);
            onClose();
        } catch (error) {
            console.error("Ошибка при сохранении адреса:", error);
            alert("Не удалось сохранить адрес. Попробуйте снова.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleMapSelect = async ({ coords }) => {
        if (!token) {
            alert("Для выбора адреса на карте необходимо войти в аккаунт.");
            return;
        }

        setIsManualInput(false);

        const result = await getAddressByCoords(coords[0], coords[1], token);
        if (result) {
            setAddressString(result.title);
            setStreet(result.address);
            setBuilding(result.building);
            setCoords([result.latitude, result.longitude]);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-map">
                    <YandexMap
                        city={city}
                        onAddressSelect={handleMapSelect}
                    />
                </div>
                <div className="modal-form">
                    <div className="modal-header">
                        <h2>Новый адрес</h2>
                        <button className="close-btn" onClick={onClose}> <X size={20} /> </button>
                    </div>
                    <div className="form-fields">
                        <div className="form-group dropdown-container">
                            <label htmlFor="city-select" className={city?.name ? 'active' : ''}>Город</label>
                            <input
                                id="city-select"
                                readOnly
                                value={city?.name || ''}
                                className="form-input dropdown-input"
                                onClick={() => setShowCityDropdown(!showCityDropdown)}
                            />
                            <span className={`dropdown-arrow ${showCityDropdown ? 'open' : ''}`}>
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M0.46967 0.46967C0.762563 0.176777 1.23744 0.176777 1.53033 0.46967L7 5.93934L12.4697 0.46967C12.7626 0.176777 13.2374 0.176777 13.5303 0.46967C13.8232 0.762563 13.8232 1.23744 13.5303 1.53033L7.53033 7.53033C7.23744 7.82322 6.76256 7.82322 6.46967 7.53033L0.46967 1.53033C0.176777 1.23744 0.176777 0.762563 0.46967 0.46967Z" fill="#222222"/>
                                </svg>
                            </span>
                            {showCityDropdown && (
                                <ul className="city-dropdown-list">
                                    {cities.map(c => (
                                        <li
                                            key={c.id}
                                            className={`city-dropdown-item ${city?.id === c.id ? 'selected' : ''}`}
                                            onClick={() => handleCitySelect(c)}
                                        >
                                            <span>{c.name}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="form-group">
                            <input
                                id="address"
                                type="text"
                                value={addressString}
                                onChange={(e) => {
                                    setAddressString(e.target.value);
                                    setIsManualInput(true);
                                }}
                                className="form-input"
                                placeholder=" "
                            />
                            <label htmlFor="address">Улица, номер дома</label>
                        </div>
                        <label className="checkbox-container-address">
                            Это частный дом
                            <input type="checkbox" checked={isPrivateHouse} onChange={() => setIsPrivateHouse(!isPrivateHouse)} />
                            <span className="checkmark"></span>
                        </label>
                        {!isPrivateHouse && (
                            <div className="form-grid">
                                <div className="form-group">
                                    <input id="apartment" type="text" placeholder=" " value={apartment} onChange={(e) => setApartment(e.target.value)} className="form-input"/>
                                    <label htmlFor="apartment">Кв/офис</label>
                                </div>
                                <div className="form-group">
                                    <input id="entrance" type="text" placeholder=" " value={entrance} onChange={(e) => setEntrance(e.target.value)} className="form-input" />
                                    <label htmlFor="entrance">Подъезд</label>
                                </div>
                                <div className="form-group">
                                    <input id="floor" type="text" placeholder=" " value={floor} onChange={(e) => setFloor(e.target.value)} className="form-input" />
                                    <label htmlFor="floor">Этаж</label>
                                </div>
                            </div>
                        )}
                        <div className="form-group">
                            <textarea id="comment" placeholder=" " value={comment} onChange={(e) => setComment(e.target.value)} className="form-input" rows={3}/>
                            <label htmlFor="comment">Комментарий для курьера</label>
                        </div>
                        <button onClick={handleSubmit} className="btn-submit" disabled={isLoading}>
                            {isLoading ? 'Сохранение...' : 'Сохранить адрес'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}