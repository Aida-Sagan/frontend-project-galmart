import React, { useState, useRef, useEffect, useCallback } from 'react';
import { YMaps, Map, Placemark, SearchControl, Polygon } from '@pbe/react-yandex-maps';
import customPinIcon from '../../assets/svg/vector.svg';
import { useAuth } from "../../context/AuthContext";
import { getCityPolygons } from '../../api/services/addressService';

const YandexMap = ({ city, onAddressSelect }) => {
    const { token } = useAuth();
    const ymaps = useRef(null);
    const mapRef = useRef(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [deliveryPolygons, setDeliveryPolygons] = useState([]);

    const cityCenter = {
        'Астана': [51.128207, 71.430411],
        'Алматы': [43.238949, 76.889709],
    };

    const defaultCenter = cityCenter[city?.name || 'Астана'];

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
        setMapCenter(defaultCenter);
    }, [city]);

    // This function uses the Yandex Maps geocoder to get an address from coordinates
    const getAddress = useCallback((coords) => {
        if (!ymaps.current || !coords) return;
        ymaps.current.geocode(coords).then(res => {
            const firstGeoObject = res.geoObjects.get(0);
            const addressLine = firstGeoObject.getAddressLine();
            onAddressSelect({ address: addressLine, coords });
        });
    }, [onAddressSelect]);

    const handleMapChange = useCallback((e) => {
        const newCenter = e.get('newCenter');
        setMapCenter(newCenter);
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (mapCenter) {
                getAddress(mapCenter);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [mapCenter, getAddress]);

    const handleLoad = useCallback((api) => {
        ymaps.current = api;
    }, []);

    const handleResultSelect = (e) => {
        const newCoords = e.get('result').geometry.getCoordinates();
        if (mapRef.current) {
            mapRef.current.setCenter(newCoords);
            setMapCenter(newCoords);
        }
    };

    return (
        <YMaps query={{
            apikey: import.meta.env.VITE_YANDEX_API_KEY || "f5bf6e25-401c-46f6-bdd6-ec9ad60f3aab",
            lang: 'ru_RU',
            load: 'package.full'
        }}>
            <Map
                state={{ center: mapCenter || defaultCenter, zoom: 12 }}
                width="100%"
                height="100%"
                instanceRef={mapRef}
                onLoad={handleLoad}
                onBoundsChange={handleMapChange}
                modules={['geocode']}
            >
                <SearchControl options={{ float: 'right' }} onResultSelect={handleResultSelect} />

                {deliveryPolygons.length > 0 ? (
                    deliveryPolygons.map((polygonCoords, index) => {
                        if (!polygonCoords || polygonCoords.length === 0) return null;
                        return (
                            <Polygon
                                key={index}
                                geometry={polygonCoords}
                                properties={{ hintContent: `Зона доставки ${index + 1}` }}
                                options={{
                                    fillColor: '#902067',
                                    strokeColor: '#a30067',
                                    opacity: 0.5,
                                    strokeWidth: 3
                                }}
                            />
                        );
                    })
                ) : (
                    <div style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 1000, background: 'rgba(255,255,255,0.8)', padding: '10px', borderRadius: '5px', fontSize: '12px' }}>
                        {token ? 'Загрузка зон доставки...' : 'Для просмотра зон доставки войдите в аккаунт.'}
                    </div>
                )}

                {mapCenter && (
                    <Placemark
                        geometry={mapCenter}
                        options={{
                            draggable: false,
                            iconLayout: 'default#image',
                            iconImageHref: customPinIcon,
                            iconImageSize: [40, 40],
                            iconImageOffset: [-20, -40],
                        }}
                    />
                )}
            </Map>
        </YMaps>
    );
};

export default YandexMap;