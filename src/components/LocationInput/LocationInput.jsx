import React, { useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import PropTypes from "prop-types";

export default function LocationInput({onLocationChange}) {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);

  const provider = new OpenStreetMapProvider();

  const handleSearch = async () => {
    const results = await provider.search({ query: address });
    setResults(results);
  };

  const handleResultClick = (result) => {
    const { x, y, label } = result;
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
        Search
      </button>
      {results.length > 0 && (
        <div className="results">
          {results.map((result, index) => (
            <div key={index} onClick={() => handleResultClick(result)}>
              {result.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

LocationInput.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
}
