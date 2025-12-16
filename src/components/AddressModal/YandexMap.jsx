import React, { useState, useRef, useEffect, useCallback } from 'react';
import { YMaps, Map, Placemark, SearchControl, Polygon } from '@pbe/react-yandex-maps';
import customPinIcon from '../../assets/svg/vector.svg';
import { getCityPolygons } from '../../api/services/addressService';

// Фиолетовый цвет (purple800 в Dart): #902067.
const PURPLE_STROKE_COLOR_RGBA = 'rgba(144, 32, 103, 0.3)';
const PURPLE_FILL_COLOR_RGBA = 'rgba(144, 32, 103, 0.1)';

const YandexMap = ({ city, onAddressSelect, serviceToken }) => {
    const mapRef = useRef(null);
    const [mapCenter, setMapCenter] = useState(null);
    const [deliveryPolygons, setDeliveryPolygons] = useState([]);

    const cityCenter = {
        'Астана': [51.128207, 71.430411],
        'Алматы': [43.238949, 76.889709],
    };
    const defaultCenter = cityCenter[city?.name || 'Астана'];

    useEffect(() => {
        setMapCenter(defaultCenter);
    }, [city]);

    // Эффект 2: Загрузка полигонов доставки
    useEffect(() => {
        const fetchPolygons = async () => {
            if (city?.id) {
                // Если API не требует serviceToken как аргумент, он берется из интерсептора.
                const polygonsData = await getCityPolygons(serviceToken); // Передаем токен на всякий случай

                // ВАЖНО: Проверьте, в каком порядке приходят координаты: [lat, lon] или [lon, lat]
                // Если API возвращает [lon, lat], то нужно преобразование:

                /*
                const transformedPolygons = polygonsData.map(polygon =>
                    polygon.map(ring =>
                        ring.map(([lat, lon]) => [lat, lon]) // Оставьте эту строку, если порядок [lat, lon]
                        // ring.map(([lon, lat]) => [lat, lon]) // Используйте эту строку, если порядок [lon, lat]
                    )
                );
                setDeliveryPolygons(transformedPolygons);
                */

                setDeliveryPolygons(polygonsData); // Используем данные как есть (предполагая [lat, lon])
            } else {
                setDeliveryPolygons([]);
            }
        };
        fetchPolygons();
    }, [city, serviceToken]); // Добавлен serviceToken в зависимости

    // ... (handleMapMovement и handleResultSelect остаются без изменений)
    const handleMapMovement = (ymaps) => {
        if (mapRef.current) {
            const newCenter = mapRef.current.getCenter();
            setMapCenter(newCenter);
            onAddressSelect({ coords: newCenter });
        }
    };

    const handleResultSelect = (e) => {
        const newCoords = e.get('result').geometry.getCoordinates();
        if (mapRef.current) {
            mapRef.current.setCenter(newCoords);
            onAddressSelect({ coords: newCoords });
        }
    };

    if (!mapCenter) return null;

    return (
        <YMaps query={{
            apikey: import.meta.env.VITE_YANDEX_API_KEY || "f5bf6e25-401c-46f6-bdd6-ec9ad60f3aab",
            lang: 'ru_RU',
            load: 'package.full'
        }}>
            <Map
                state={{ center: mapCenter, zoom: 12 }}
                width="100%"
                height="100%"
                instanceRef={mapRef}
                modules={['geocode']}
                onBoundsChange={handleMapMovement}
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
                                    // Используем RGBA для точного соответствия прозрачности
                                    fillColor: PURPLE_FILL_COLOR_RGBA,
                                    strokeColor: PURPLE_STROKE_COLOR_RGBA,
                                    fillOpacity: 1, // Прозрачность задается в RGBA
                                    strokeOpacity: 1, // Прозрачность задается в RGBA
                                    strokeWidth: 3,
                                    // Высокий zIndex для гарантии видимости
                                    zIndex: 10
                                }}
                            />
                        );
                    })}

                <Placemark
                    geometry={mapCenter}
                    options={{
                        draggable: false,
                        iconLayout: 'default#image',
                        iconImageHref: customPinIcon,
                        iconImageSize: [40, 40],
                        iconImageOffset: [-20, -40],
                        zIndex: 20
                    }}
                />
            </Map>
        </YMaps>
    );
};

export default YandexMap;