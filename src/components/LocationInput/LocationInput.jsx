import React, { useEffect, useState } from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import PropTypes from "prop-types";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { isDomAvailable } from "../../modules/util";

export default function LocationInput({
  onLocationChange,
  searchDelayMillis = 500,
  ariaLabelledBy = null,
}) {
  const [address, setAddress] = useState("");
  const [results, setResults] = useState([]);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (focus) {
      const func = setTimeout(searchAddress, searchDelayMillis);
      return () => clearTimeout(func);
    }
  }, [focus, address]);

  if (!isDomAvailable()) {
    // Leaflet-geosearch not available with SSR
    return <></>;
  }

  const provider = new OpenStreetMapProvider();

  const handleTextInputChange = (event) => {
    setAddress(event.target.value);
  };

  function searchAddress() {
    provider.search({ query: address }).then(setResults);
  }

  const handleResultClick = (result) => {
    const { x, y, label } = result;
    setResults([]);
    setAddress(label);
    onLocationChange({
      address: label,
      coordinates: { latitude: y, longitude: x },
    });
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Enter address"
        value={address}
        onChange={handleTextInputChange}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
        aria-labelledby={ariaLabelledBy || undefined}
        aria-haspopup="listbox"
        aria-expanded={results.length > 0}
      />
      {results.length > 0 && (
        <ol role="listbox" style={{ display: "block" }}>
          {results.map((result, index) => (
            <li
              key={index}
              role="option"
              onClick={() => handleResultClick(result)}
            >
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
  ariaLabelledBy: PropTypes.string,
};

LocationInput.defaultProps = {
  searchDelayMillis: 500,
};
