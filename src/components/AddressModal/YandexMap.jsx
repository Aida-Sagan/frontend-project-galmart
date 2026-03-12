import React, { useState, useRef, useEffect, useCallback } from 'react';
import { YMaps, Map, Placemark, SearchControl, Polygon } from '@pbe/react-yandex-maps';
import customPinIcon from '../../assets/svg/vector.svg';
import { getCityPolygons } from '../../api/services/addressService';

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

    // Загрузка полигонов доставки
    useEffect(() => {
        const fetchPolygons = async () => {
            if (city?.id) {
                const polygonsData = await getCityPolygons(serviceToken);

                /*
                const transformedPolygons = polygonsData.map(polygon =>
                    polygon.map(ring =>
                        ring.map(([lat, lon]) => [lat, lon])
                        // ring.map(([lon, lat]) => [lat, lon])
                    )
                );
                setDeliveryPolygons(transformedPolygons);
                */

                setDeliveryPolygons(polygonsData);
            } else {
                setDeliveryPolygons([]);
            }
        };
        fetchPolygons();
    }, [city, serviceToken]);

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
            apikey: import.meta.env.VITE_YANDEX_API_KEY,
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
                                    fillColor: PURPLE_FILL_COLOR_RGBA,
                                    strokeColor: PURPLE_STROKE_COLOR_RGBA,
                                    fillOpacity: 1,
                                    strokeOpacity: 1,
                                    strokeWidth: 3,
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