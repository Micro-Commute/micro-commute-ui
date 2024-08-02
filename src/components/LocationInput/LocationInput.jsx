import React, {useEffect, useState} from 'react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

import 'leaflet/dist/leaflet.css';
import 'leaflet-geosearch/dist/geosearch.css';
import PropTypes from "prop-types";

export default function LocationInput({onLocationChange, searchDelayMillis = 500}) {
  const [address, setAddress] = useState('');
  const [results, setResults] = useState([]);
  const provider = new OpenStreetMapProvider();

  const handleTextInputChange = (event) => {
    setAddress(event.target.value);
  };

  useEffect(() => {
    const func = setTimeout(searchAddress, searchDelayMillis);
    return () => clearTimeout(func)
  }, [address])

  function searchAddress() {
    provider
      .search({query: address})
      .then(setResults)
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
      />
      {results.length > 0 && (
        <ol style={{display: "block"}}>
          {results.map((result, index) => (
            <li key={index} onClick={() => handleResultClick(result)}>
              {result.label}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

LocationInput.propTypes = {
  onLocationChange: PropTypes.func.isRequired,
  searchDelayMillis: PropTypes.number.isRequired,
}
