import React, { useState, useRef, useEffect, useCallback } from 'react';
import { YMaps, Map, Placemark, SearchControl, Polygon } from '@pbe/react-yandex-maps';
import customPinIcon from '../../assets/svg/vector.svg';
import { useAuth } from "../../context/AuthContext";
import { getCityPolygons } from '../../api/services/addressService';

const YandexMap = ({ city, onAddressSelect }) => {
    const { token } = useAuth();
    const mapRef = useRef(null);
    const [pinCoords, setPinCoords] = useState(null);
    const [deliveryPolygons, setDeliveryPolygons] = useState([]);

    const cityCenter = {
        'Астана': [51.128207, 71.430411],
        'Алматы': [43.238949, 76.889709],
    };
    const defaultCenter = cityCenter[city?.name || 'Астана'];

    useEffect(() => {
        setPinCoords(defaultCenter);
    }, [city]);

    useEffect(() => {
        const fetchPolygons = async () => {
            if (city?.id && token) {
                const polygonsData = await getCityPolygons(token);
                // Координаты уже в нужном формате [широта, долгота]
                setDeliveryPolygons(polygonsData);
            } else {
                setDeliveryPolygons([]);
            }
        };
        fetchPolygons();
    }, [city, token]);

    const handleResultSelect = (e) => {
        const newCoords = e.get('result').geometry.getCoordinates();
        if (mapRef.current) {
            mapRef.current.setCenter(newCoords);
            setPinCoords(newCoords);
            onAddressSelect({ coords: newCoords });
        }
    };

    const handlePinDragEnd = (e) => {
        const newCoords = e.get('target').geometry.getCoordinates();
        setPinCoords(newCoords);
        onAddressSelect({ coords: newCoords });
    };

    return (
        <YMaps query={{
            apikey: import.meta.env.VITE_YANDEX_API_KEY || "f5bf6e25-401c-46f6-bdd6-ec9ad60f3aab",
            lang: 'ru_RU',
            load: 'package.full'
        }}>
            <Map
                state={{ center: pinCoords || defaultCenter, zoom: 12 }}
                width="100%"
                height="100%"
                instanceRef={mapRef}
                modules={['geocode']}
            >
                <SearchControl options={{ float: 'right' }} onResultSelect={handleResultSelect} />

                {deliveryPolygons.length > 0 &&
                    deliveryPolygons.map((polygon, index) => {
                        if (!polygon || polygon.length === 0) return null;
                        return (
                            <Polygon
                                key={index}
                                geometry={polygon}
                                properties={{ hintContent: `Зона доставки ${index + 1}` }}
                                options={{
                                    fillColor: '#902067',
                                    strokeColor: '#a30067',
                                    opacity: 0.5,
                                    strokeWidth: 3
                                }}
                            />
                        );
                    })}

                {pinCoords && (
                    <Placemark
                        geometry={pinCoords}
                        options={{
                            draggable: true,
                            iconLayout: 'default#image',
                            iconImageHref: customPinIcon,
                            iconImageSize: [40, 40],
                            iconImageOffset: [-20, -40],
                        }}
                        onDragEnd={handlePinDragEnd}
                    />
                )}
            </Map>
        </YMaps>
    );
};

export default YandexMap;