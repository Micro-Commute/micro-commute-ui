import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';   

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';   

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';   

const LocationInput = ({ onLocationChange }) => {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const provider = new OpenStreetMapProvider();

  const handleSearch = async () => {
    const results = await provider.search({ query: address });
    setResults(results);
  };

  const handleResultClick = (result) => {
    const { x, y, label } = result;
    setSelectedLocation({ lat: y, lng: x });
    setResults([]);
    setAddress(label);
    onLocationChange({ address: label, coordinates: { lat: y, lng: x } });
  };

  return (
    <div className="location-input">
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button onClick={handleSearch} style={{ backgroundColor: 'white', color: 'blue' }}>
        <FontAwesomeIcon icon={faSearch} />
      </button>
      {results.length > 0 && (
        <div className="results">
          {results.map((result, index) => (
            <div key={index} onClick={() => handleResultClick(result)}>
              <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: 'black' }} />
              {result.label}
            </div>
          ))}
        </div>
      )}
      {selectedLocation && (
        <MapContainer center={[selectedLocation.lat, selectedLocation.lng]} zoom={13} style={{ height: '400px', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[selectedLocation.lat, selectedLocation.lng]}>
            <Popup>
              {address}
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default LocationInput;

