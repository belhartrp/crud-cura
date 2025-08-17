import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Warna marker berdasarkan kategori (opsional)
const categoryColors = {
  macet: 'orange',
  kecelakaan: 'red',
  banjir: 'blue',
  kebakaran: 'darkred',
  demo: 'purple',
};

// Fungsi membuat icon marker
const getIcon = (color = 'blue') =>
  new L.Icon({
    iconUrl: `https://chart.googleapis.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|${color}`,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

// Komponen untuk menangkap klik di map
const ClickableMap = ({ setSelected }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // Sederhanakan alamat, misal lat/lng jadi string
      const address = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
      setSelected(`${lat.toFixed(5)}, ${lng.toFixed(5)}`, address);
    },
  });
  return null;
};

const MapView = ({ setSelected }) => {
  const defaultPosition = [-6.2, 106.816]; // Jakarta

  return (
    <MapContainer center={defaultPosition} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      <ClickableMap setSelected={setSelected} />
    </MapContainer>
  );
};

export default MapView;
