import React, { useState, useRef, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const libraries = ['places'];

const MapComponent = () => {
  const [map, setMap] = useState(null);
  const [center, setCenter] = useState({ lat: -6.58296, lng: 106.77569 });
  const [latitude, setLatitude] = useState(center.lat);
  const [longitude, setLongitude] = useState(center.lng);
  const autocompleteRef = useRef(null);

  const onLoad = (autoC) => {
    autocompleteRef.current = autoC;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setLatitude(lat);
        setLongitude(lng);
        setCenter({ lat, lng });
      }
    }
  };

  const handleLoadMap = useCallback((map) => {
    setMap(map);
  }, []);

  const handleMapError = (error) => {
    console.error('Google Maps error:', error);
  };

  return (
    <LoadScript
      googleMapsApiKey="AIzaSyCLkYHCK6PaBQgtzUaKJzqLoRy5fWXOVYc"
      libraries={libraries}
      onError={handleMapError}
    >
      <div className="container mx-auto p-6 space-y-6">
        <div className="bg-green-100 p-6 rounded-lg shadow-lg space-y-4">
          <div className="flex space-x-4 items-center">
            <Autocomplete onLoad={onLoad} onPlaceChanged={onPlaceChanged}>
              <input
                type="text"
                placeholder="Enter a location"
                className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </Autocomplete>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              onClick={onPlaceChanged}
            >
              Find
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">Latitude</label>
              <input type="text" value={latitude} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-100" />
            </div>
            <div>
              <label className="block text-gray-700">Longitude</label>
              <input type="text" value={longitude} readOnly className="w-full p-2 border border-gray-300 rounded bg-gray-100" />
            </div>
          </div>
        </div>
        <div className="h-96">
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={15}
            onLoad={handleLoadMap}
            onError={handleMapError}
          >
            <Marker position={center} />
          </GoogleMap>
        </div>
      </div>
    </LoadScript>
  );
};

export default MapComponent;
