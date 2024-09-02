import React, {useEffect, useRef, useState} from "react";

import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import PropTypes from "prop-types";
import { OpenStreetMapProvider } from "leaflet-geosearch";
import { isDomAvailable } from "../../modules/util";

import * as locationInputStyles from "./LocationInput.module.css";

export default function LocationInput({
  locationValue,
  onLocationChange,
  searchDelayMillis = 500,
  ariaLabelledBy = null,
  style = undefined,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([]);
  const [state, setState] = useState("idle"); // One of [idle, edit]
  const address = locationValue ? locationValue.address : "";
  const ref = useRef(null);

  useEffect(() => {
    // Source: https://stackoverflow.com/a/42234988/5508855
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        // Clear results when the user clicks outside the LocationInput without
        // clicking on any of the suggestions, i.e., cancels the search
        setResults([]);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref])

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
    <div className={locationInputStyles.locationInput} ref={ref}>
      <input
        type="text"
        placeholder="Enter address"
        style={style}
        value={(() => {
          switch (state) {
            case "idle":
              return address;
            case "edit":
              return searchTerm;
            default:
              throw new Error(`Unexpected state: ${state}`);
          }
        })()}
        onChange={handleTextInputChange}
        onBlur={() => setState("idle")}
        onFocus={() => setState("edit")}
        aria-labelledby={ariaLabelledBy || undefined}
        aria-haspopup="listbox"
        aria-expanded={results.length > 0}
      />
      {results.length > 0 && (
        <ResultBox results={results} onResultClick={handleResultClick} />
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
  // ({address:str,coordinates:{longitude:float,latitude:float}}) -> void
  onLocationChange: PropTypes.func.isRequired,
  searchDelayMillis: PropTypes.number.isRequired,
  ariaLabelledBy: PropTypes.string,
};

LocationInput.defaultProps = {
  searchDelayMillis: 500,
};

function ResultBox({ results, onResultClick }) {
  return (
    <div style={{ width: "350px" }} className={locationInputStyles.resultBox}>
      {results.length > 0 && (
        <ol role="listbox" style={{ display: "block" }}>
          {results.map((result, index) => (
            <li key={index} role="option" onClick={() => onResultClick(result)}>
              {result.label}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
