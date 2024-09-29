import React, { useEffect, useState } from 'react';

// Carga condicional de Mapbox
let Map: any;
let Marker: any;

if (typeof window !== 'undefined') {
  // Solo importa mapbox-gl en el cliente
  Map = require('react-map-gl').default;
  Marker = require('react-map-gl').Marker;
}

interface MapboxMapProps {
  onLocationSelect: (lat: number, lng: number) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({ onLocationSelect }) => {
  const [viewport, setViewport] = useState({
    latitude: 20.659698,
    longitude: -103.349609,
    zoom: 10,
  });

  const [marker, setMarker] = useState({ latitude: 37.7749, longitude: -122.4194 });

  useEffect(() => {
    // Verificar que estamos en el cliente antes de manipular Mapbox
    if (typeof window !== 'undefined') {
      setViewport({
        latitude: 37.7749,
        longitude: -122.4194,
        zoom: 10,
      });
    }
  }, []);

  const handleMapClick = (e: any) => {
    const { lngLat } = e;
    setMarker({ latitude: lngLat.lat, longitude: lngLat.lng });
    onLocationSelect(lngLat.lat, lngLat.lng);
  };

  if (typeof window === 'undefined') {
    // Si estamos en SSR, devolver null
    return null;
  }

  return (
    <Map
      initialViewState={viewport}
      style={{ width: '100%', height: '400px' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_API_KEY}
      onClick={handleMapClick}
    >
      <Marker latitude={marker.latitude} longitude={marker.longitude} />
    </Map>
  );
};

export default MapboxMap;
