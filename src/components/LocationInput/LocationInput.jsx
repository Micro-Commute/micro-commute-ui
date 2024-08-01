
import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import * as EL from 'esri-leaflet';
import 'esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css';
import * as ELG from 'esri-leaflet-geocoder';

const LocationInput = () => {
  const mapRef = useRef(null);

  useEffect(() => {
    const map = L.map(mapRef.current).setView([51.505, -0.09], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const searchControl = ELG.geosearch().addTo(map);

    const results = L.layerGroup().addTo(map);

    searchControl.on('results', function (data) {
      results.clearLayers();
      for (let i = data.results.length - 1; i >= 0; i--) {
        results.addLayer(L.marker(data.results[i].latlng));
      }
    });

  }, []);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <div ref={mapRef} style={{ height: '100%' }}></div>
    </div>
  );
};

export default LocationInput;
