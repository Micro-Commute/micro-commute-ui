import React, { useState } from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import PropTypes from "prop-types";

export default function LocationInput({onLocationChange}) {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const provider = new OpenStreetMapProvider();

  const handleTextInputChange = (event) => {
    setAddress(event.target.value);
  };

  const handleTextInputKeyDown = (event) => {
    if (event.key === "Enter") {
      provider
        .search({query: address})
        .then(setResults)
    }
  }

  const handleResultClick = (result) => {
    const { x, y, label } = result;
    setResults([]);
    setAddress(label);
    onLocationChange({ address: label, coordinates: { lat: y, lng: x } });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={handleTextInputChange}
        onKeyDown={handleTextInputKeyDown}
      />
      {results.length > 0 && (
        <div>
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
