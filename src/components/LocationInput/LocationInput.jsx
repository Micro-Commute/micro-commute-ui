import React, { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import PropTypes from "prop-types";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { isDomAvailable } from "../../modules/util";

export default function LocationInput({
  locationValue,
  onLocationChange,
  searchDelayMillis = 500,
  ariaLabelledBy = null,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [state, setState] = useState("idle"); // One of [idle, edit]
  const address = locationValue ? locationValue.address : "";

  useEffect(() => {
    if (state === "edit") {
      const func = setTimeout(searchAddress, searchDelayMillis);
      return () => clearTimeout(func);
    }
  }, [state, searchTerm]);

  if (!isDomAvailable()) {
    // Leaflet-geosearch not available with SSR
    return <></>;
  }

  const provider = new OpenStreetMapProvider();

  const handleTextInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  function searchAddress() {
    provider.search({ query: searchTerm }).then(setResults);
  }

  const handleResultClick = (result) => {
    const { x, y, label } = result;
    setResults([]);
    setSearchTerm("");
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
        value={(() => {
          switch (state) {
            case "idle":
              return  address;
            case "edit":
              return searchTerm;
            default:
              throw new Error(`Unexpected state: ${state}`);
          }
        } )()}
        onChange={handleTextInputChange}
        onBlur={() => setState("idle")}
        onFocus={() => setState("edit")}
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
  locationValue: PropTypes.shape({
    address: PropTypes.string,
    coordinates: PropTypes.shape({
      latitude: PropTypes.number.isRequired,
      longitude: PropTypes.number.isRequired,
    }),
  }),
  onLocationChange: PropTypes.func.isRequired,
  searchDelayMillis: PropTypes.number.isRequired,
  ariaLabelledBy: PropTypes.string,
};

LocationInput.defaultProps = {
  searchDelayMillis: 500,
};
