import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import YandexMap from "./YandexMap";
import "./styles/AddressModal.css";
import { useLocation } from "../../context/LocationContext";
import { useAuth } from "../../context/AuthContext";
import { saveAddress } from "../../api/services/addressService.js";
import { getCoordsByString, getCityPolygons } from "../../api/services/addressService";

// Hook for debouncing user input
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
    const isPointInPolygon = (p, poly) => {
        const x = p[0], y = p[1];
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0], yi = poly[i][1];
            const xj = poly[j][0], yj = poly[j][1];
            const intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    };

    return polygons.some(polygon => isPointInPolygon(point, polygon));
};

export default function AddressModal({ isOpen, onClose, onSave }) {
    const { city } = useLocation();
    const { token } = useAuth();

    const [addressString, setAddressString] = useState('');
    const [coords, setCoords] = useState(null);
    const [apartment, setApartment] = useState("");
    const [entrance, setEntrance] = useState("");
    const [floor, setFloor] = useState("");
    const [comment, setComment] = useState("");
    const [isPrivateHouse, setIsPrivateHouse] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deliveryPolygons, setDeliveryPolygons] = useState([]);

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
        if (token && debouncedAddressString.length > 3 && city?.id) {
            getCoordsByString(debouncedAddressString, city.id, token).then(result => {
                if (result) {
                    setCoords([result.latitude, result.longitude]);
                }
            });
        }
    }, [debouncedAddressString, city, token]);

    const handleSubmit = async () => {
        if (!addressString || !coords) {
            alert("Пожалуйста, выберите точку на карте или введите адрес.");
            return;
        }

        if (!token) {
            alert("Для сохранения адреса необходимо войти в аккаунт.");
            return;
        }

        if (deliveryPolygons.length > 0 && !isPointInAnyPolygon(coords, deliveryPolygons)) {
            alert("Извините, выбранный адрес находится вне зоны доставки.");
            return;
        }

        setIsLoading(true);
        const streetAndBuilding = addressString.split(',').slice(0, 2).join(',').trim();


        const addressData = {
            city: city.id,
            address: streetAndBuilding,
            building: isPrivateHouse ? "" : (streetAndBuilding.includes(' ') ? streetAndBuilding.split(' ').pop() : (building || " ")),
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

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-map">
                    <YandexMap
                        city={city}
                        onAddressSelect={({ address, coords }) => {
                            setAddressString(address);
                            setCoords(coords);
                        }}
                    />
                </div>
                <div className="modal-form">
                    <div className="modal-header">
                        <h2>Новый адрес</h2>
                        <button className="close-btn" onClick={onClose}> <X size={20} /> </button>
                    </div>
                    <div className="form-fields">
                        <div className="form-group">
                            <input readOnly value={city?.name || ''} className="form-input" />
                            <label>Город</label>
                        </div>
                        <div className="form-group">
                            <input
                                id="address" type="text" value={addressString}
                                onChange={(e) => setAddressString(e.target.value)}
                                className="form-input" placeholder=" "
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